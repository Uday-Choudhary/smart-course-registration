const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createCourse = async (req, res) => {
  try {
    const { code, title, credits, programId } = req.body;

    const course = await prisma.course.create({
      data: { code, title, credits, programId },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("createCourse Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { program: true },
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
