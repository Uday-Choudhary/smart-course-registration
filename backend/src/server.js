require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const prisma = require("./prisma");

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());



app.use("/api/department", require("./routes/academic/department.route"));
app.use("/api/program", require("./routes/academic/program.route"));
app.use("/api/term", require("./routes/academic/term.route"));
app.use("/api/course", require("./routes/academic/course.route"));
app.use("/api/section", require("./routes/academic/section.route"));
app.use("/api/room", require("./routes/academic/room.route"));
app.use("/api/schedule", require("./routes/academic/schedule.route"));
app.use("/api/enroll", require("./routes/academic/enroll.route"));
app.use("/api/students", require("./routes/academic/student.route"));
app.use("/api/faculty", require("./routes/academic/faculty.route"));
app.use("/api/profile", require("./routes/profile.route"));
app.use("/api/notifications", require("./routes/notification.route"));




const authRoutes = require("./routes/auth.route");
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: " Smart Course API is running" });
});


app.get("/roles", async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (err) {
    next(err);
  }
});

const {
  verifyToken,
  requireAdmin,
  requireFacultyOrAdmin,
} = require("./miiddleware/authMiddleware");



app.use((err, req, res, next) => {
  console.error(" Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);