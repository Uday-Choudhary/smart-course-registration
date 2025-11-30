const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateEmail, validatePassword, validateRequiredFields } = require("../utils/validators");

// register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const missingField = validateRequiredFields({ name, email, password, role });
    if (missingField) {
      return res.status(400).json({ error: "all fields are required" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: "Need a special character, a number and a minimum of 8 characters" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "email format is wrong" });
    }
    const validRoles = ["Student", "Faculty", "Admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "invalid role" });
    }

    // // Secure Admin Registration
    // if (role === "Admin") {
    //   const adminSecret = process.env.ADMIN_SECRET;
    //   if (!adminSecret || req.body.adminSecret !== adminSecret) {
    //     return res.status(403).json({ error: "Unauthorized to create Admin account" });
    //   }
    // }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "user already exists" });
    }

    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).json({ error: "role not found in db" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        full_name: name,
        email,
        password: hashedPass,
        roleId: roleRecord.id
      },
      include: {
        role: true
      }
    });

    return res.status(201).json({
      message: "user created",
      user: {
        id: newUser.id,
        name: newUser.full_name,
        email: newUser.email,
        role: newUser.role.name
      },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "something went wrong" });
  }
};
// login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const missingField = validateRequiredFields({ email, password });
    if (missingField) {
      return res.status(400).json({ error: "email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true
      }
    });

    if (!user) {
      return res.status(400).json({ error: "wrong email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "wrong email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "logged in",
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role.name
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "server error" });
  }
};

// // change password
// exports.changePassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     const userId = req.user.id; // from verifyToken middleware

//     if (!oldPassword || !newPassword) {
//       return res.status(400).json({ error: "Both old and new passwords are required" });
//     }

//     if (!validatePassword(newPassword)) {
//       return res.status(400).json({ error: "" });
//     }
      
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Incorrect old password" });
//     }

//     const hashedPass = await bcrypt.hash(newPassword, 10);
//     await prisma.user.update({
//       where: { id: userId },
//       data: { password: hashedPass },
//     });

//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Change password error:", error);
//     res.status(500).json({ error: "Failed to update password" });
//   }
// };
