const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
        password: "default@123", // temporary password
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
