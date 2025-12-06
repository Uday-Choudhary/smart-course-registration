const express = require("express");
const router = express.Router();

const getAllStudents = require("../../controllers/students/getAllStudents");
const createStudent = require("../../controllers/students/createStudent");
const updateStudent = require("../../controllers/students/updateStudent");
const deleteStudent = require("../../controllers/students/deleteStudent");
const getMyProfile = require("../../controllers/students/getMyProfile");
const getMyTimetable = require("../../controllers/students/getMyTimetable");
const getMyRegistrations = require("../../controllers/students/getMyRegistrations");
const getDashboardStats = require("../../controllers/students/getDashboardStats");

const {
  verifyToken,
  requireAdmin,
} = require("../../miiddleware/authMiddleware");


// Self profile for any authenticated user
router.get("/dashboard-stats", verifyToken, getDashboardStats);
router.get("/registrations", verifyToken, getMyRegistrations);
router.get("/timetable", verifyToken, getMyTimetable);
router.get("/me", verifyToken, getMyProfile);

// Admin CRUD
router.get("/", verifyToken, requireAdmin, getAllStudents);
router.post("/", verifyToken, requireAdmin, createStudent);
router.put("/:id", verifyToken, requireAdmin, updateStudent);
router.delete("/:id", verifyToken, requireAdmin, deleteStudent);

module.exports = router;
