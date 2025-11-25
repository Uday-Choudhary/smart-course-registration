
const prisma = require("../../prisma");

// --- Helper Functions ---

// Convert a Date object to minutes from midnight for easy comparison
const getMinutes = (date) => {
  const d = new Date(date);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
};

// Check if two schedules overlap
const doSchedulesClash = (scheduleA, scheduleB) => {
  if (scheduleA.dayOfWeek !== scheduleB.dayOfWeek) return false;

  const startA = getMinutes(scheduleA.startTime);
  const endA = getMinutes(scheduleA.endTime);
  const startB = getMinutes(scheduleB.startTime);
  const endB = getMinutes(scheduleB.endTime);

  // Overlap logic: (StartA < EndB) AND (EndA > StartB)
  return startA < endB && endA > startB;
};

// Find any clashes between target schedules and existing registrations
const findTimeClashes = (targetSchedules, existingRegistrations) => {
  const clashes = [];

  for (const reg of existingRegistrations) {
    const existingSchedules = reg.section.sectionCourses.flatMap(sc => sc.schedules);

    for (const targetSch of targetSchedules) {
      for (const existingSch of existingSchedules) {
        if (doSchedulesClash(targetSch, existingSch)) {
          clashes.push({
            clashingCourse: reg.section.sectionCourses[0]?.course?.code,
            day: targetSch.dayOfWeek,
            time: `${targetSch.startTime.toISOString()} - ${targetSch.endTime.toISOString()} `
          });
        }
      }
    }
  }
  return clashes;
};

// Find alternative sections that don't clash and have seats
const findValidAlternatives = async (targetSection, existingRegistrations) => {
  // Get all course IDs in this section (usually just one)
  const courseIds = targetSection.sectionCourses.map(sc => sc.courseId);

  // Find other sections for the same course(s) in the same term
  const candidates = await prisma.section.findMany({
    where: {
      termId: targetSection.termId,
      id: { not: targetSection.id }, // Exclude the one we are trying to join
      sectionCourses: { some: { courseId: { in: courseIds } } }
    },
    include: {
      sectionCourses: { include: { schedules: true } },
      registrations: true // Need this to check capacity
    }
  });

  const validAlternatives = [];

  for (const candidate of candidates) {
    // 1. Skip if full
    if (candidate.registrations.length >= candidate.capacity) continue;

    // 2. Check for clashes with existing registrations
    const candidateSchedules = candidate.sectionCourses.flatMap(sc => sc.schedules);
    const clashes = findTimeClashes(candidateSchedules, existingRegistrations);

    // 3. If no clashes, it's a valid alternative
    if (clashes.length === 0) {
      validAlternatives.push(candidate);
    }
  }

  return validAlternatives;
};

// --- Main Controller ---

exports.enrollStudent = async (req, res) => {
  try {
    const { studentId, sectionId } = req.body;

    // 1. Fetch Target Section
    const targetSection = await prisma.section.findUnique({
      where: { id: parseInt(sectionId) },
      include: {
        term: true,
        sectionCourses: { include: { schedules: true, course: true } },
      },
    });

    if (!targetSection) return res.status(404).json({ error: "Section not found" });

    // 2. Fetch Student's Existing Registrations (Same Term)
    const existingRegistrations = await prisma.registration.findMany({
      where: {
        studentId: studentId,
        section: { termId: targetSection.termId },
      },
      include: {
        section: {
          include: {
            sectionCourses: { include: { schedules: true, course: true } },
          },
        },
      },
    });

    // 3. Check for Time Clashes
    const targetSchedules = targetSection.sectionCourses.flatMap(sc => sc.schedules);
    const clashes = findTimeClashes(targetSchedules, existingRegistrations);

    // 4. Handle Clashes (Return Error + Alternatives)
    if (clashes.length > 0) {
      const alternatives = await findValidAlternatives(targetSection, existingRegistrations);

      return res.status(409).json({
        error: "Time clash detected",
        clashes,
        alternatives
      });
    }

    // 5. Perform Enrollment (Atomic Transaction)
    const result = await prisma.$transaction(async (tx) => {
      // Check capacity inside transaction
      const currentCount = await tx.registration.count({
        where: { sectionId: parseInt(sectionId) }
      });

      if (currentCount < targetSection.capacity) {
        // Case A: Seats Available -> Enroll
        const enrollment = await tx.registration.create({
          data: { studentId, sectionId: parseInt(sectionId) }
        });
        return { status: 201, body: { message: "Enrollment successful", enrollment } };

      } else {
        // Case B: Section Full -> Add to Waitlist
        const waitlistCount = await tx.waitlist.count({
          where: { sectionId: parseInt(sectionId) }
        });
        const waitlistEntry = await tx.waitlist.create({
          data: { studentId, sectionId: parseInt(sectionId) }
        });

        return {
          status: 200,
          body: {
            message: "Section full. Added to waitlist.",
            waitlistPosition: waitlistCount + 1,
            waitlistEntry
          }
        };
      }
    });

    res.status(result.status).json(result.body);

  } catch (error) {
    console.error("enrollStudent Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
