const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../miiddleware/authMiddleware");

const { enrollStudent, dropCourse, getMyWaitlists } = require("../../controllers/academic/enroll.controller");

router.post("/register", verifyToken, enrollStudent);
router.delete("/drop/:registrationId", verifyToken, dropCourse);
router.get("/waitlists", verifyToken, getMyWaitlists);

module.exports = router;
