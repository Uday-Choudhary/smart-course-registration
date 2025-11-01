const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();




/////// regsiter code here 

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(name , email)

    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: "all fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "password should be at least 6 characters long" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate role
    const validRoles = ["Student", "Faculty", "Admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be Student, Faculty, or Admin" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "user already exists" });
    }

    // Get role ID from role name
    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).json({ error: "Invalid role" });
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
      message: "User registered successfully",
      user: { 
        id: newUser.id, 
        name: newUser.full_name, 
        email: newUser.email, 
        role: newUser.role.name 
      },
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

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        role: true
      }
    });
    
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "login successful",
      token,
      user: { 
        id: user.id, 
        name: user.full_name, 
        email: user.email, 
        role: user.role.name 
      },
    });
  } catch (err) {
    console.error("login Error:", err);
    return res.status(500).json({ error: "Server error" });  
  }
};
