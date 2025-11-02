const express = require("express");
const router = express.Router();

const { enrollStudent } = require("../../controllers/academic/enroll.controller");

router.post("/register", enrollStudent);

module.exports = router;
