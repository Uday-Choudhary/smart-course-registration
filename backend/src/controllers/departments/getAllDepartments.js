const prisma = require("../../prisma");

const getAllDepartments = async (req, res) => {
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
}

module.exports = getAllDepartments;
