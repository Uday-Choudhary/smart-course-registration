const prisma = require("../../prisma");
const { validateId, validateRequiredFields } = require("../../utils/validators");

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (validateRequiredFields({ name })) {
      return res.status(400).json({ success: false, error: "Department name is required" });
    }
    const department = await prisma.department.create({
      data: {
        name: name.trim(),
      },
    });
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("createDepartment Error:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: "Department with this name already exists"
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create department",
      details: error.message
    });
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        programs: true,
      },
    });
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("getAllDepartments Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch departments",
      details: error.message
    });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
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
};

// Update department by ID
exports.updateDepartment = async (req, res) => {
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
};

// Delete department by ID
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(400).json({ success: false, error: "Invalid department ID" });
    }
    const programs = await prisma.program.findFirst({
      where: { departmentId: parseInt(id) },
    });
    if (programs) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete department: Programs are associated with this department. Please delete programs first.",
      });
    }
    await prisma.department.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("deleteDepartment Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete department",
      details: error.message
    });
  }
};
