const prisma = require("../../prisma");

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
}

module.exports = deleteStudent;
