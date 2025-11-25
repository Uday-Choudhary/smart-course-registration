const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getMyProfile,
  getMyTimetable,
  getMyRegistrations,
} = require("../../controllers/academic/student.controller");

const {
  verifyToken,
  requireAdmin,
} = require("../../miiddleware/authMiddleware");

// Self profile for any authenticated user
router.get("/registrations", verifyToken, getMyRegistrations);
router.get("/timetable", verifyToken, getMyTimetable);
router.get("/me", verifyToken, getMyProfile);

// Admin CRUD
router.get("/", verifyToken, requireAdmin, getAllStudents);
router.post("/", verifyToken, requireAdmin, createStudent);
router.put("/:id", verifyToken, requireAdmin, updateStudent);
router.delete("/:id", verifyToken, requireAdmin, deleteStudent);

module.exports = router;
