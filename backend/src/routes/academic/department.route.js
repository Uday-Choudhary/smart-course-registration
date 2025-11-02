const express = require("express");
const router = express.Router();

const {
  createDepartment,
  getDepartments,
} = require("../../controllers/academic/department.controller");

router.post("/create", createDepartment);
router.get("/", getDepartments);

module.exports = router;
