const express = require("express");
const router = express.Router();

const { enrollStudent, dropCourse, getMyWaitlists } = require("../../controllers/academic/enroll.controller");

router.post("/register", enrollStudent);
router.delete("/drop/:registrationId", dropCourse);
router.get("/waitlists", getMyWaitlists);

module.exports = router;
