const express = require("express");
const router = express.Router();
const { verifyToken } = require("../miiddleware/authMiddleware");
const getProfile = require("../controllers/profiles/getProfile");
const updateProfile = require("../controllers/profiles/updateProfile");


router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile);

module.exports = router;
