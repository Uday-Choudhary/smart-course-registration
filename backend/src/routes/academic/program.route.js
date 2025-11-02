const express = require("express");
const router = express.Router();

const { createProgram, getPrograms } = require("../../controllers/academic/program.controller");

router.post("/create", createProgram);
router.get("/", getPrograms);

module.exports = router;
