const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.enrollStudent = async (req, res) => {
  try {
    const { studentId, sectionId } = req.body;

    const enrollment = await prisma.registration.create({
      data: { studentId, sectionId },
    });

    res.status(201).json({ message: "Enrollment successful", enrollment });
  } catch (error) {
    console.error("enrollStudent Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
