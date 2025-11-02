const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSection = async (req, res) => {
  try {
    const { courseId, facultyId, semester } = req.body;

    const section = await prisma.section.create({
      data: { courseId, facultyId, semester },
    });

    res.status(201).json(section);
  } catch (error) {
    console.error("createSection Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSections = async (req, res) => {
  try {
    const sections = await prisma.section.findMany({
      include: {
        faculty: true,
        course: true,
      },
    });

    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
