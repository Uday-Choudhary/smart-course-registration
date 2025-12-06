const prisma = require("../../prisma");

const createProgram = async (req, res) => {
  try {
    const { name, departmentId } = req.body;

    if (validateRequiredFields({ name, departmentId })) {
      return res.status(400).json({ success: false, error: "Name and Department ID are required" });
    }
    if (!validateId(departmentId)) {
      return res.status(400).json({ success: false, error: "Invalid Department ID" });
    }

    // Verify that department exists
    const department = await prisma.department.findUnique({
      where: { id: parseInt(departmentId) },
    });
    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    const program = await prisma.program.create({
      data: {
        name: name.trim(),
        departmentId: parseInt(departmentId),
      },
      include: {
        department: true,
      },
    });
    res.status(201).json({
      success: true,
      message: "Program created successfully",
      data: program,
    });
  } catch (error) {
    console.error("createProgram Error:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: "Program with this name already exists"
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create program",
      details: error.message
    });
  }
}

module.exports = createProgram;
