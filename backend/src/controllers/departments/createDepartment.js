const prisma = require("../../prisma");

const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Department name is required" });
    }
    const department = await prisma.department.create({
      data: {
        name: name.trim(),
      },
    });
    res.status(201).json({
      success: true, message: "Department created successfully", data: department,
    });
  } catch (error) {
    console.error("createDepartment Error:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false, error: "Department with this name already exists"
      });
    }
    res.status(500).json({
      success: false, error: "Failed to create department", details: error.message
    });
  }
}

module.exports = createDepartment;
