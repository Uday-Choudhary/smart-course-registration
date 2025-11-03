const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { getProfile } = require("../controllers/profile.controller");
const { verifyToken } = require("../miiddleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfile);

module.exports = router;