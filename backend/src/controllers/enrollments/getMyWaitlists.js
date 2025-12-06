const prisma = require("../../prisma");

const getMyWaitlists = async (req, res) => {
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
}

module.exports = getMyWaitlists;
