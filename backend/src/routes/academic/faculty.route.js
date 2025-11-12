const express = require("express");
const router = express.Router();

const {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require("../../controllers/academic/faculty.controller.js");

router.get("/", getAllFaculty);       // GET all
router.post("/", createFaculty);      // CREATE
router.put("/:id", updateFaculty);    // UPDATE
router.delete("/:id", deleteFaculty); // DELETE

module.exports = router;
