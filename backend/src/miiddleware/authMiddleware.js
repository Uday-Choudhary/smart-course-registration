const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "no token" });
    }
    const token = authHeader.split(' ')[1]; // Bearer token
    if (!token) {
      return res.status(401).json({ error: "no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }
    req.user = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "token expired" });
    }
    console.error("token error:", error);
    return res.status(500).json({ error: "auth error" });
  }
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "not authenticated" });
    }
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: "not allowed",
        required: allowedRoles,
        current: userRole
      });
    }
    next();
  };
};

// admin
const requireAdmin = authorizeRole('Admin');
const requireFacultyOrAdmin = authorizeRole('Faculty', 'Admin');
const requireAuth = authorizeRole('Student', 'Faculty', 'Admin');

module.exports = {
  verifyToken,
  authorizeRole,
  requireAdmin,
  requireFacultyOrAdmin,
  requireAuth
};
