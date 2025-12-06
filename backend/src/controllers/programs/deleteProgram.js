const prisma = require("../../prisma");

const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(400).json({ success: false, error: "Invalid program ID" });
    }
    await prisma.program.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("deleteProgram Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Program not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete program",
      details: error.message
    });
  }
}

module.exports = deleteProgram;
