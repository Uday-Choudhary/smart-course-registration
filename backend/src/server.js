require("dotenv").config();

const express = require('express')
const cors = require("cors");
const helmet = require("helmet");
const { PrismaClient } = require("@prisma/client");

const app = express()
const prisma = new PrismaClient();

app.use(cors());
app.use(helmet());
app.use(express.json())
app.use("/api/department", require("./routes/academic/department.route"));
app.use("/api/program", require("./routes/academic/program.route"));
app.use("/api/term", require("./routes/academic/term.route"));
app.use("/api/course", require("./routes/academic/course.route"));
app.use("/api/section", require("./routes/academic/section.route"));
app.use("/api/room", require("./routes/academic/room.route"));
app.use("/api/enroll", require("./routes/academic/enroll.route")); 


app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// test route to check roles
app.get("/roles", async (req, res) => {
  const roles = await prisma.role.findMany();
  res.json(roles);
});

// authroutes
const authRoutes = require("./routes/auth.route");
app.use("/api/auth", authRoutes);

// middleware 
const { verifyToken, requireAdmin, requireFacultyOrAdmin, requireAuth } = require("./miiddleware/authMiddleware");

app.get("/api/test/public", (req, res) => {
  res.json({ message: "public route, no auth needed" });
});

app.get("/api/test/protected", verifyToken, (req, res) => {
  res.json({ 
    message: "protected route",
    user: req.user
  });
});

app.get("/api/test/admin", verifyToken, requireAdmin, (req, res) => {
  res.json({ 
    message: "admin only",
    user: req.user
  });
});

app.get("/api/test/faculty", verifyToken, requireFacultyOrAdmin, (req, res) => {
  res.json({ 
    message: "faculty/admin only",
    user: req.user
  });
});

app.get("/api/test/student", verifyToken, (req, res) => {
  if (req.user.role === 'Student') {
    res.json({ 
      message: "student route",
      user: req.user
    });
  } else {
    res.status(403).json({ 
      error: "nah, students only",
      current: req.user.role
    });
  }
});


app.get("/api/profile", verifyToken, (req, res) => {
  res.json({
    message:"profile info",
    user: req.user
  });
}); 


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`backend running on port ${PORT}`)) 
