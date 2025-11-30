
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

// Format time to human-readable format (e.g., "10:00 AM")
const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Find any clashes between target schedules and existing registrations
const findTimeClashes = (targetSchedules, existingRegistrations) => {
  const clashes = [];

  for (const reg of existingRegistrations) {
    const existingSchedules = reg.section.sectionCourses.flatMap(sc => sc.schedules);

    for (const targetSch of targetSchedules) {
      for (const existingSch of existingSchedules) {
        if (doSchedulesClash(targetSch, existingSch)) {
          const courseInfo = reg.section.sectionCourses[0]?.course;
          clashes.push({
            courseCode: courseInfo?.code || 'Unknown',
            courseTitle: courseInfo?.title || 'Unknown Course',
            day: targetSch.dayOfWeek,
            time: `${formatTime(targetSch.startTime)} - ${formatTime(targetSch.endTime)}`
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
      sectionCourses: {
        include: {
          schedules: {
            include: {
              room: true
            }
          },
          faculty: true,
          course: true
        }
      },
      registrations: true // Need this to check capacity
    }
  });

  console.log('Found candidates:', candidates.length);
  const validAlternatives = [];

  for (const candidate of candidates) {
    console.log(`Checking candidate section ${candidate.sectionCode}:`, {
      registrations: candidate.registrations.length,
      capacity: candidate.capacity,
      schedules: candidate.sectionCourses.flatMap(sc => sc.schedules).map(s => ({
        day: s.dayOfWeek,
        start: s.startTime,
        end: s.endTime
      }))
    });

    // 1. Skip if full
    if (candidate.registrations.length >= candidate.capacity) {
      console.log(`  -> Skipped: Section is full`);
      continue;
    }

    // 2. Check for clashes with existing registrations
    const candidateSchedules = candidate.sectionCourses.flatMap(sc => sc.schedules);
    const clashes = findTimeClashes(candidateSchedules, existingRegistrations);

    console.log(`  -> Clashes found: ${clashes.length}`);

    // 3. If no clashes, it's a valid alternative
    if (clashes.length === 0) {
      validAlternatives.push(candidate);
      console.log(`  -> Added as valid alternative`);
    }
  }

  console.log('Total valid alternatives:', validAlternatives.length);
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
};

// --- Drop Course Controller ---

exports.dropCourse = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const studentId = req.user?.id; // From auth middleware

    if (!studentId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 1. Verify the registration belongs to the student
    const registration = await prisma.registration.findUnique({
      where: { id: parseInt(registrationId) },
      include: {
        section: {
          include: {
            sectionCourses: {
              include: { course: true }
            }
          }
        }
      }
    });

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    if (registration.studentId !== studentId) {
      return res.status(403).json({ error: "Unauthorized to drop this course" });
    }

    // 2. Perform drop and waitlist promotion in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete the registration
      await tx.registration.delete({
        where: { id: parseInt(registrationId) }
      });

      // Find the next student on the waitlist (oldest entry = first in line)
      const nextInLine = await tx.waitlist.findFirst({
        where: { sectionId: registration.sectionId },
        orderBy: { createdAt: 'asc' },
        include: {
          student: {
            select: { full_name: true, email: true }
          }
        }
      });

      let promotedStudent = null;

      if (nextInLine) {
        // Promote the waitlisted student to enrollment
        const newEnrollment = await tx.registration.create({
          data: {
            studentId: nextInLine.studentId,
            sectionId: nextInLine.sectionId
          }
        });

        // Remove from waitlist
        await tx.waitlist.delete({
          where: { id: nextInLine.id }
        });

        // Create notification for promoted student
        const courseInfo = registration.section.sectionCourses[0]?.course;
        await tx.notification.create({
          data: {
            userId: nextInLine.studentId,
            message: `You've been enrolled in ${courseInfo?.code || 'course'} - ${registration.section.sectionCode} from the waitlist!`
          }
        });

        promotedStudent = {
          id: nextInLine.studentId,
          name: nextInLine.student.full_name,
          email: nextInLine.student.email
        };
      }

      return { promotedStudent };
    });

    res.json({
      success: true,
      message: "Course dropped successfully",
      promotedStudent: result.promotedStudent
    });

  } catch (error) {
    console.error("dropCourse Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// --- Get Student's Waitlist Entries ---

exports.getMyWaitlists = async (req, res) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const waitlists = await prisma.waitlist.findMany({
      where: { studentId },
      include: {
        section: {
          include: {
            term: {
              select: {
                id: true,
                year: true,
                semester: true
              }
            },
            sectionCourses: {
              include: {
                course: {
                  select: {
                    id: true,
                    code: true,
                    title: true,
                    creditHours: true
                  }
                },
                faculty: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true
                  }
                },
                schedules: {
                  include: {
                    room: {
                      select: {
                        id: true,
                        roomCode: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Format the response with position calculation
    const formattedWaitlists = await Promise.all(
      waitlists.map(async (waitlist) => {
        // Calculate position by counting earlier entries
        const position = await prisma.waitlist.count({
          where: {
            sectionId: waitlist.sectionId,
            createdAt: { lte: waitlist.createdAt }
          }
        });

        const section = waitlist.section;
        const sectionCourse = section.sectionCourses[0];
        const course = sectionCourse?.course;
        const faculty = sectionCourse?.faculty;
        const schedules = sectionCourse?.schedules || [];

        return {
          id: waitlist.id,
          joinedAt: waitlist.createdAt,
          position,
          course: {
            id: course?.id,
            code: course?.code,
            title: course?.title,
            creditHours: course?.creditHours
          },
          section: {
            id: section.id,
            sectionCode: section.sectionCode,
            capacity: section.capacity
          },
          faculty: {
            id: faculty?.id,
            name: faculty?.full_name || 'TBA',
            email: faculty?.email
          },
          schedules: schedules.map((sch) => ({
            id: sch.id,
            day: sch.dayOfWeek,
            startTime: sch.startTime,
            endTime: sch.endTime,
            room: sch.room?.roomCode || 'TBA'
          })),
          term: {
            id: section.term?.id,
            year: section.term?.year,
            semester: section.term?.semester
          }
        };
      })
    );

    res.json({
      success: true,
      count: formattedWaitlists.length,
      data: formattedWaitlists
    });

  } catch (error) {
    console.error("getMyWaitlists Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch waitlists"
    });
  }
};
