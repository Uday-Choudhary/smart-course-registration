const prisma = require("../../prisma");

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(400).json({ success: false, error: "Invalid department ID" });
    }
    const department = await prisma.department.findUnique({
      where: { id: parseInt(id) },
      include: {
        programs: true,
      },
    });
    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("getDepartmentById Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch department",
      details: error.message
    });
  }
}

module.exports = getDepartmentById;
