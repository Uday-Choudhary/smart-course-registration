const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();




/////// regsiter code here 

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: "all fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "password should be at least 6 characters long" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "user already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPass, role },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


//////// login code here

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "all fields are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "invalid password. lease try again or reset your password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("login Error:", err);
    return res.status(500).json({ error: "Server error" });  
  }
};
