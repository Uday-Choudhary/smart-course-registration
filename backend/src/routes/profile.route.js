const express = require("express");
const router = express.Router();
const { verifyToken } = require("../miiddleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile);

module.exports = router;
