const prisma = require("../../prisma");
const { findTimeClashes, findValidAlternatives, formatTime } = require("./helpers");

const enrollStudent = async (req, res) => {
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

    // 3. Check if Already Enrolled in This Section
    const alreadyEnrolled = existingRegistrations.some(
      reg => reg.sectionId === parseInt(sectionId)
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        error: "Already registered",
        message: "You are already enrolled in this section."
      });
    }

    // 4. Check for Time Clashes
    const targetSchedules = targetSection.sectionCourses.flatMap(sc => sc.schedules);
    const clashes = findTimeClashes(targetSchedules, existingRegistrations);

    // 5. Handle Clashes (Return Error + Alternatives)
    if (clashes.length > 0) {
      const alternatives = await findValidAlternatives(targetSection, existingRegistrations);

      // Format alternatives for frontend
      const formattedAlternatives = alternatives.map(alt => {
        const schedules = alt.sectionCourses.flatMap(sc =>
          sc.schedules.map(sch => ({
            day: sch.dayOfWeek,
            time: `${formatTime(sch.startTime)} - ${formatTime(sch.endTime)}`,
            room: sch.room?.roomCode || 'TBA'
          }))
        );

        const faculty = alt.sectionCourses[0]?.faculty;
        const availableSeats = alt.capacity - alt.registrations.length;

        return {
          id: alt.id,
          sectionCode: alt.sectionCode,
          facultyName: faculty?.full_name || 'TBA',
          schedules,
          availableSeats,
          capacity: alt.capacity
        };
      });

      return res.status(409).json({
        success: false,
        error: "Time clash detected",
        message: "This section conflicts with your existing schedule.",
        clashes,
        alternatives: formattedAlternatives
      });
    }

    // 6. Perform Enrollment (Atomic Transaction)
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
        // First check if already on waitlist
        const existingWaitlist = await tx.waitlist.findFirst({
          where: {
            studentId: studentId,
            sectionId: parseInt(sectionId)
          }
        });

        if (existingWaitlist) {
          // Already on waitlist - calculate current position
          const position = await tx.waitlist.count({
            where: {
              sectionId: parseInt(sectionId),
              createdAt: { lte: existingWaitlist.createdAt }
            }
          });

          return {
            status: 200,
            body: {
              message: "You are already on the waitlist for this section.",
              waitlistPosition: position,
              waitlistEntry: existingWaitlist
            }
          };
        }

        // Not on waitlist yet - add them
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
}

module.exports = enrollStudent;
