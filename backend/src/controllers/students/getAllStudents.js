const prisma = require("../../prisma");

const getAllStudents = async (req, res) => {
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
}

module.exports = getAllStudents;
