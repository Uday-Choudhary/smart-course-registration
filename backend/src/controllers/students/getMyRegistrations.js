const prisma = require("../../prisma");

const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "not authenticated" });

    const registrations = await prisma.registration.findMany({
      where: { studentId: userId },
      include: {
        section: {
          include: {
            term: {
              select: {
                id: true,
                year: true,
                semester: true,
              },
            },
            sectionCourses: {
              include: {
                course: {
                  select: {
                    id: true,
                    code: true,
                    title: true,
                    creditHours: true,
                  },
                },
                faculty: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true,
                  },
                },
                schedules: {
                  include: {
                    room: {
                      select: {
                        id: true,
                        roomCode: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response
    const formattedRegistrations = registrations.map((reg) => {
      const section = reg.section;
      const sectionCourse = section.sectionCourses[0]; // Assuming one course per section
      const course = sectionCourse?.course;
      const faculty = sectionCourse?.faculty;
      const schedules = sectionCourse?.schedules || [];

      return {
        id: reg.id,
        registeredAt: reg.createdAt,
        course: {
          id: course?.id,
          code: course?.code,
          title: course?.title,
          creditHours: course?.creditHours,
        },
        section: {
          id: section.id,
          sectionCode: section.sectionCode,
        },
        faculty: {
          id: faculty?.id,
          name: faculty?.full_name || 'TBA',
          email: faculty?.email,
        },
        schedules: schedules.map((sch) => ({
          id: sch.id,
          day: sch.dayOfWeek,
          startTime: sch.startTime,
          endTime: sch.endTime,
          room: sch.room?.roomCode || 'TBA',
        })),
        term: {
          id: section.term?.id,
          year: section.term?.year,
          semester: section.term?.semester,
        },
      };
    });

    res.json({
      success: true,
      count: formattedRegistrations.length,
      data: formattedRegistrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch registrations"
    });
  }
}

module.exports = getMyRegistrations;
