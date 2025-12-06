const express = require("express");
const router = express.Router();

const getAllFaculty = require("../../controllers/faculties/getAllFaculty");
const createFaculty = require("../../controllers/faculties/createFaculty");
const updateFaculty = require("../../controllers/faculties/updateFaculty");
const deleteFaculty = require("../../controllers/faculties/deleteFaculty");
const getDashboardStats = require("../../controllers/faculties/getDashboardStats");

const { verifyToken } = require("../../miiddleware/authMiddleware");


// Faculty dashboard stats (authenticated)
router.get("/dashboard-stats", verifyToken, getDashboardStats);

// Admin routes
router.get("/", getAllFaculty);       // GET all
router.post("/", createFaculty);      // CREATE
router.put("/:id", updateFaculty);    // UPDATE
router.delete("/:id", deleteFaculty); // DELETE

module.exports = router;

