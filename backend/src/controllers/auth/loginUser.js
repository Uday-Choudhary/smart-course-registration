const prisma = require("../../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser=async (req,res) => {
  try {
    const {email,password}= req.body;

    const missingField = validateRequiredFields({ email,password });
    if (missingField) {
      return res.status(400).json({ error:"email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },include: {
        role:true
      }
    });

    if (!user) {
      return res.status(400).json({ error:"wrong email or password" });
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "wrong email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role.name }, process.env.JWT_SECRET, { expiresIn: "1d" }
    );

    return res.json({
      message: "logged in", token, user: {
        id: user.id, name: user.full_name, email: user.email, role: user.role.name
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "server error" });
  }
}

module.exports = loginUser;
