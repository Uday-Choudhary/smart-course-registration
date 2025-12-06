const prisma = require("../../prisma");
const bcrypt = require("bcryptjs");
const { validateEmail } = require("../../utils/validators");

const createStudent = async (req, res) => {
  try {
    const { full_name, email, phone, sex, address, birthday, bloodType } = req.body;

    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const role = await prisma.role.findUnique({ where: { name: "Student" } });
    if (!role) return res.status(400).json({ error: "Student role not found" });

    const newStudent = await prisma.user.create({
      data: {
        full_name, email, phone, sex, address, birthday, bloodType, roleId: role.id, password: await bcrypt.hash("default@123", 10),// temporary password hashed
      }, select: {
        id: true, full_name: true, email: true, phone: true, sex: true, address: true, birthday: true, bloodType: true,
      },
    });

    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
}

module.exports = createStudent;
