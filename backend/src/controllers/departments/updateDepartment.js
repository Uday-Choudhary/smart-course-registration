const prisma = require("../../prisma");

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(400).json({ success: false, error: "Invalid department ID" });
    }
    const { name } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();

    const department = await prisma.department.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    console.error("updateDepartment Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: "Department with this name already exists",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update department",
      details: error.message
    });
  }
}

module.exports = updateDepartment;
