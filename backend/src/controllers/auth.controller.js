const prisma = require("../prisma");

// register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: "all fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "password too short, need at least 6 chars" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "email format is wrong" });
    }
    const validRoles = ["Student", "Faculty", "Admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "invalid role" });
    }

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

    if (!email || !password) {
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
