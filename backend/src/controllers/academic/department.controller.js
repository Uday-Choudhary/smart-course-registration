const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// createing a department

exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    const dept = await prisma.department.create({
      data: { name },
    });

    res.status(201).json(dept);
  } catch (error) {
    console.error("createDepartment Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// geting all departments 

exports.getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
