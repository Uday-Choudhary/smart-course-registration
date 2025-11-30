const express = require("express");
const router = express.Router();

const {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getDashboardStats,
} = require("../../controllers/academic/faculty.controller.js");

const { verifyToken } = require("../../miiddleware/authMiddleware");

// Faculty dashboard stats (authenticated)
router.get("/dashboard-stats", verifyToken, getDashboardStats);

// Admin routes
router.get("/", getAllFaculty);       // GET all
router.post("/", createFaculty);      // CREATE
router.put("/:id", updateFaculty);    // UPDATE
router.delete("/:id", deleteFaculty); // DELETE

module.exports = router;

