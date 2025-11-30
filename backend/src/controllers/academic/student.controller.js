const prisma = require("../../prisma");
const { validateEmail } = require("../../utils/validators");
const bcrypt = require("bcryptjs");

// GET all students (Admin)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: { name: "Student" } },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        address: true,
        birthday: true,
        bloodType: true,
      },
    });

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// CREATE a student (Admin)
exports.createStudent = async (req, res) => {
  try {
    const { full_name, email, phone, sex, address, birthday, bloodType } = req.body;

    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const role = await prisma.role.findUnique({ where: { name: "Student" } });
    if (!role) return res.status(400).json({ error: "Student role not found" });

    const newStudent = await prisma.user.create({
      data: {
        full_name,
        email,
        phone,
        sex,
        address,
        birthday,
        bloodType,
        roleId: role.id,
        password: await bcrypt.hash("default@123", 10), // temporary password hashed
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        address: true,
        birthday: true,
        bloodType: true,
      },
    });

    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
};

// UPDATE a student (Admin)
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, sex, address, birthday, bloodType } = req.body;

    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        full_name,
        email,
        phone,
        sex,
        address,
        birthday,
        bloodType,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        address: true,
        birthday: true,
        bloodType: true,
      },
    });

    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// DELETE a student (Admin)
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// GET current user's student profile (Auth)
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "not authenticated" });

    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        address: true,
        birthday: true,
        bloodType: true,
        role: { select: { name: true } },
      },
    });

    if (!me) return res.status(404).json({ error: "profile not found" });

    res.json(me);
  } catch (error) {
    console.error("Error fetching my profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// GET student's timetable (Auth)
exports.getMyTimetable = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "not authenticated" });

    // 1. Get all registrations for the student
    const registrations = await prisma.registration.findMany({
      where: { studentId: userId },
      include: {
        section: {
          include: {
            sectionCourses: {
              include: {
                course: true,
                faculty: {
                  select: { full_name: true },
                },
                schedules: {
                  include: {
                    room: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 2. Flatten and format the data
    const timetable = [];

    registrations.forEach((reg) => {
      const section = reg.section;
      if (!section) return;

      section.sectionCourses.forEach((sc) => {
        const course = sc.course;
        const facultyName = sc.faculty?.full_name || "TBA";

        sc.schedules.forEach((sched) => {
          timetable.push({
            id: sched.id,
            courseCode: course.code,
            courseTitle: course.title,
            sectionCode: section.sectionCode,
            faculty: facultyName,
            day: sched.dayOfWeek, // e.g., "Monday", "MON"
            startTime: sched.startTime, // DateTime object
            endTime: sched.endTime,     // DateTime object
            room: sched.room?.roomCode || "TBA",
            color: getRandomColor(course.code), // Optional: helper for UI color
          });
        });
      });
    });

    res.json(timetable);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
};

// Helper to generate consistent colors based on string
function getRandomColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

// GET student's registrations (Auth)
exports.getMyRegistrations = async (req, res) => {
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
};


// GET student dashboard stats (Auth)
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "not authenticated" });

    console.log("=== DASHBOARD STATS DEBUG ===");
    console.log("User ID:", userId);

    // 1. Fetch all registrations with full details
    const registrations = await prisma.registration.findMany({
      where: { studentId: userId },
      include: {
        section: {
          include: {
            term: true,
            sectionCourses: {
              include: {
                course: true,
                schedules: {
                  include: { room: true }
                }
              }
            }
          }
        }
      }
    });

    console.log("Total registrations found:", registrations.length);
    console.log("Registrations:", registrations.map(r => ({
      id: r.id,
      termId: r.section.termId,
      term: `${r.section.term.year} ${r.section.term.semester}`,
      course: r.section.sectionCourses[0]?.course.code
    })));

    // 2. Fetch recent notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // 3. Determine Active Term
    // Strategy: Use the term from the latest registration (by term ID), or fallback to system latest term
    let activeTermId = null;

    if (registrations.length > 0) {
      // Find the registration with the highest termId
      const latestReg = registrations.reduce((prev, current) => {
        return (prev.section.termId > current.section.termId) ? prev : current;
      });
      activeTermId = latestReg.section.termId;
      console.log("Active term ID (from registrations):", activeTermId);
    } else {
      // Fallback to system latest term
      const systemLatestTerm = await prisma.term.findFirst({
        orderBy: { id: 'desc' }
      });
      activeTermId = systemLatestTerm?.id;
      console.log("Active term ID (from system):", activeTermId);
    }

    // 4. Calculate Stats

    // Credits Earned (All time)
    const creditsEarned = registrations.reduce((sum, reg) => {
      const courseCredits = reg.section.sectionCourses[0]?.course.creditHours || 0;
      return sum + courseCredits;
    }, 0);

    console.log("Credits earned:", creditsEarned);

    // Filter for Active Term
    const activeRegistrations = activeTermId
      ? registrations.filter(reg => reg.section.termId === activeTermId)
      : [];

    console.log("Active registrations count:", activeRegistrations.length);
    console.log("Active registrations:", activeRegistrations.map(r => ({
      course: r.section.sectionCourses[0]?.course.code,
      termId: r.section.termId
    })));

    // Enrolled Courses (Active Term)
    const enrolledCoursesCount = activeRegistrations.length;

    // Upcoming Classes (Today, Active Term)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"
    const upcomingClasses = [];

    console.log("Today is:", today);

    activeRegistrations.forEach(reg => {
      const section = reg.section;
      section.sectionCourses.forEach(sc => {
        sc.schedules.forEach(sched => {
          console.log(`Schedule: ${sched.dayOfWeek} vs ${today}`);
          if (sched.dayOfWeek.toLowerCase() === today.toLowerCase()) {
            upcomingClasses.push({
              id: sched.id,
              courseCode: sc.course.code,
              courseTitle: sc.course.title,
              startTime: sched.startTime,
              endTime: sched.endTime,
              room: sched.room?.roomCode || "TBA"
            });
          }
        });
      });
    });

    console.log("Upcoming classes:", upcomingClasses.length);

    // Sort upcoming classes by start time
    upcomingClasses.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    // Format Recent Activity
    const recentActivity = notifications.map(notif => ({
      id: notif.id,
      message: notif.message,
      createdAt: notif.createdAt,
      read: notif.read
    }));

    const responseData = {
      success: true,
      data: {
        gpa: "N/A", // Placeholder as grades aren't implemented
        creditsEarned,
        enrolledCourses: enrolledCoursesCount,
        upcomingClasses,
        recentActivity
      }
    };

    console.log("Response data:", JSON.stringify(responseData, null, 2));
    console.log("=== END DEBUG ===");

    res.json(responseData);

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
