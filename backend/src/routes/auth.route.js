const express = require("express");
const { registerUser, loginUser, changePassword } = require("../controllers/auth.controller");
const { getProfile } = require("../controllers/profile.controller");
const { verifyToken } = require("../miiddleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiter for auth endpoints (5 attempts per 15 minutes)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: { error: "Too many attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/profile", verifyToken, getProfile);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;