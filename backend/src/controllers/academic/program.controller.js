const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createProgram = async (req, res) => {
  try {
    const { name, departmentId } = req.body;

    const program = await prisma.program.create({
      data: { name, departmentId },
    });

    res.status(201).json(program);
  } catch (error) {
    console.error("createProgram Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPrograms = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      include: { department: true },
    });

    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
