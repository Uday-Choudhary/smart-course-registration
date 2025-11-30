const prisma = require("../../prisma");
const bcrypt = require("bcryptjs");

// getting all faculyt
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await prisma.user.findMany({
      where: { role: { name: "Faculty" } },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        subjects: true,
        sectionCoursesTaught: {
          select: {
            id: true,
            section: {
              select: {
                sectionCode: true,
                term: {
                  select: {
                    year: true,
                    semester: true,
                  },
                },
              },
            },
            course: {
              select: {
                code: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Parse subjects from JSON and format sections
    const formattedFaculty = faculty.map((f) => ({
      ...f,
      subjects: f.subjects ? (typeof f.subjects === 'string' ? JSON.parse(f.subjects) : f.subjects) : [],
      classes: f.sectionCoursesTaught.map((sc) =>
        `${sc.course.code} - ${sc.section.sectionCode} (${sc.section.term.semester} ${sc.section.term.year})`
      ),
    }));

    res.json(formattedFaculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ error: "Failed to fetch faculty data" });
  }
};

// creating new faculty admin adds
exports.createFaculty = async (req, res) => {
  try {
    const { full_name, email, phone, subjects, sex } = req.body;

    const role = await prisma.role.findUnique({
      where: { name: "Faculty" },
    });

    if (!role) return res.status(400).json({ error: "Faculty role not found" });

    const newFaculty = await prisma.user.create({
      data: {
        full_name,
        email,
        phone,
        sex,
        subjects: subjects ? JSON.stringify(subjects) : null, // store as JSON string
        roleId: role.id,
        password: await bcrypt.hash("default@123", 10), // temporary password hashed
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        subjects: true,
        sectionCoursesTaught: {
          select: {
            id: true,
            section: {
              select: {
                sectionCode: true,
                term: {
                  select: {
                    year: true,
                    semester: true,
                  },
                },
              },
            },
            course: {
              select: {
                code: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // formating the response to match getAllFaculty format 
    const formattedFaculty = {
      ...newFaculty,
      subjects: newFaculty.subjects ? (typeof newFaculty.subjects === 'string' ? JSON.parse(newFaculty.subjects) : newFaculty.subjects) : [],
      classes: newFaculty.sectionCoursesTaught.map((sc) =>
        `${sc.course.code} - ${sc.section.sectionCode} (${sc.section.term.semester} ${sc.section.term.year})`
      ),
    };

    res.status(201).json(formattedFaculty);
  } catch (error) {
    console.error("Error creating faculty:", error);
    res.status(500).json({ error: "Failed to create faculty" });
  }
};

// update facxulty 
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, subjects, email, sex } = req.body;

    const updatedFaculty = await prisma.user.update({
      where: { id },
      data: {
        full_name,
        email,
        phone,
        sex,
        subjects: subjects ? JSON.stringify(subjects) : null,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        subjects: true,
        sectionCoursesTaught: {
          select: {
            id: true,
            section: {
              select: {
                sectionCode: true,
                term: {
                  select: {
                    year: true,
                    semester: true,
                  },
                },
              },
            },
            course: {
              select: {
                code: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Format the response to match getAllFaculty format
    const formattedFaculty = {
      ...updatedFaculty,
      subjects: updatedFaculty.subjects ? (typeof updatedFaculty.subjects === 'string' ? JSON.parse(updatedFaculty.subjects) : updatedFaculty.subjects) : [],
      classes: updatedFaculty.sectionCoursesTaught.map((sc) =>
        `${sc.course.code} - ${sc.section.sectionCode} (${sc.section.term.semester} ${sc.section.term.year})`
      ),
    };

    res.json(formattedFaculty);
  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({ error: "Failed to update faculty" });
  }
};

//delete faculty 
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ error: "Failed to delete faculty" });
  }
};

// GET faculty dashboard stats (Auth)
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "not authenticated" });

    console.log("=== FACULTY DASHBOARD STATS DEBUG ===");
    console.log("Faculty ID:", userId);
    console.log("Faculty Email:", req.user.email); // Log the email

    // 1. Fetch all section courses taught by this faculty
    const sectionCourses = await prisma.sectionCourse.findMany({
      where: { facultyId: userId },
      include: {
        section: {
          include: {
            term: true,
            registrations: {
              include: {
                student: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        course: true,
        schedules: {
          include: {
            room: true
          }
        }
      }
    });

    console.log("Total section courses taught (DB fetch):", sectionCourses.length);
    if (sectionCourses.length > 0) {
      console.log("Sample Section Course:", JSON.stringify(sectionCourses[0], null, 2));
    }

    // 2. Fetch recent notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // 3. Determine Active Term (latest term with sections)
    let activeTermId = null;
    if (sectionCourses.length > 0) {
      const latestSectionCourse = sectionCourses.reduce((prev, current) => {
        return (prev.section.termId > current.section.termId) ? prev : current;
      });
      activeTermId = latestSectionCourse.section.termId;
    } else {
      // Fallback to system latest term
      const systemLatestTerm = await prisma.term.findFirst({
        orderBy: { id: 'desc' }
      });
      activeTermId = systemLatestTerm?.id;
    }

    console.log("Calculated Active term ID:", activeTermId);

    // 4. Filter for Active Term
    // TEMPORARY DEBUG: Show ALL sections, ignore term filtering
    const activeSectionCourses = sectionCourses;
    /*
    const activeSectionCourses = activeTermId
      ? sectionCourses.filter(sc => sc.section.termId === activeTermId)
      : [];
    */

    console.log("Active section courses count:", activeSectionCourses.length);

    // 5. Calculate Stats

    // Total Sections (Active Term)
    const totalSections = activeSectionCourses.length;

    // Total Students (Unique students across all active sections)
    const studentIds = new Set();
    activeSectionCourses.forEach(sc => {
      sc.section.registrations.forEach(reg => {
        studentIds.add(reg.studentId);
      });
    });
    const totalStudents = studentIds.size;

    // My Sections (detailed list for display)
    const mySections = activeSectionCourses.map(sc => ({
      id: sc.id,
      courseCode: sc.course.code,
      courseTitle: sc.course.title,
      sectionCode: sc.section.sectionCode,
      enrolledCount: sc.section.registrations.length,
      capacity: sc.section.capacity
    }));

    // Upcoming Classes (Today)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const upcomingClasses = [];

    activeSectionCourses.forEach(sc => {
      sc.schedules.forEach(sched => {
        if (sched.dayOfWeek.toLowerCase() === today.toLowerCase()) {
          upcomingClasses.push({
            id: sched.id,
            courseCode: sc.course.code,
            courseTitle: sc.course.title,
            sectionCode: sc.section.sectionCode,
            startTime: sched.startTime,
            endTime: sched.endTime,
            room: sched.room?.roomCode || "TBA",
            enrolledCount: sc.section.registrations.length
          });
        }
      });
    });

    // Sort upcoming classes by start time
    upcomingClasses.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    console.log("Upcoming classes today:", upcomingClasses.length);

    // Recent Activity
    const recentActivity = notifications.map(notif => ({
      id: notif.id,
      message: notif.message,
      createdAt: notif.createdAt,
      read: notif.read
    }));

    // Student Roster Summary (top sections by enrollment)
    const topSections = [...mySections]
      .sort((a, b) => b.enrolledCount - a.enrolledCount)
      .slice(0, 5);

    const responseData = {
      success: true,
      data: {
        totalSections,
        totalStudents,
        upcomingClasses,
        mySections,
        topSections,
        recentActivity
      }
    };

    console.log("Response data:", JSON.stringify(responseData, null, 2));
    console.log("=== END DEBUG ===");

    res.json(responseData);

  } catch (error) {
    console.error("Error fetching faculty dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

