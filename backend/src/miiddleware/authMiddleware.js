const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user details from database to ensure user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    // Add user info to request object
    req.user = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token." });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired." });
    }
    console.error("Token verification error:", error);
    return res.status(500).json({ error: "Server error during token verification." });
  }
};

// Middleware to authorize specific roles
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Access denied. Please authenticate first." });
    }

    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = authorizeRole('Admin');

// Middleware to check if user is faculty or admin
const requireFacultyOrAdmin = authorizeRole('Faculty', 'Admin');

// Middleware to check if user is student, faculty, or admin (all authenticated users)
const requireAuth = authorizeRole('Student', 'Faculty', 'Admin');

module.exports = {
  verifyToken,
  authorizeRole,
  requireAdmin,
  requireFacultyOrAdmin,
  requireAuth
};
