const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../miiddleware/authMiddleware");

const enrollStudent = require("../../controllers/enrollments/enrollStudent");
const dropCourse = require("../../controllers/enrollments/dropCourse");
const getMyWaitlists = require("../../controllers/enrollments/getMyWaitlists");


router.post("/register", verifyToken, enrollStudent);
router.delete("/drop/:registrationId", verifyToken, dropCourse);
router.get("/waitlists", verifyToken, getMyWaitlists);

module.exports = router;
