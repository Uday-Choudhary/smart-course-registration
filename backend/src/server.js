const express=require('express')
const cors = require("cors");
const helmet = require("helmet");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app=express()
const prisma = new PrismaClient();

app.use(cors());
app.use(helmet());
app.use(express.json())

app.get('/',(req,res)=>{
    res.status.apply(200).json({mes:"api is running"})
})
// test route to check roles
app.get("/roles", async (req, res) => {
  const roles = await prisma.role.findMany();
  res.json(roles);
});

//auth routes and end points 
const authRoutes = require("./routes/auth.route");
app.use("/api/auth", authRoutes);

// Import middleware
const { verifyToken, requireAdmin, requireFacultyOrAdmin, requireAuth } = require("./miiddleware/authMiddleware");

// Test routes for middleware
app.get("/api/test/public", (req, res) => {
  res.json({ message: "This is a public route - no authentication required" });
});

app.get("/api/test/protected", verifyToken, (req, res) => {
  res.json({ 
    message: "This is a protected route - authentication required",
    user: req.user
  });
});

app.get("/api/test/admin", verifyToken, requireAdmin, (req, res) => {
  res.json({ 
    message: "This is an admin-only route",
    user: req.user
  });
});

app.get("/api/test/faculty", verifyToken, requireFacultyOrAdmin, (req, res) => {
  res.json({ 
    message: "This route is accessible by Faculty and Admin only",
    user: req.user
  });
});

app.get("/api/test/student", verifyToken, (req, res) => {
  if (req.user.role === 'Student') {
    res.json({ 
      message: "This is a student-specific route",
      user: req.user
    });
  } else {
    res.status(403).json({ 
      error: "Access denied. This route is for students only.",
      current: req.user.role
    });
  }
});

// Profile route - accessible by all authenticated users
app.get("/api/profile", verifyToken, (req, res) => {
  res.json({
    message: "User profile information",
    user: req.user
  });
}); 


const PORT=process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`backend running on port ${PORT}`)) 
