const express = require("express");
const router = express.Router();

const { createSection, getSections } = require("../../controllers/academic/section.controller");

router.post("/create", createSection);
router.get("/", getSections);

module.exports = router;

