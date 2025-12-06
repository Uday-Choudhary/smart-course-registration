const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const { verifyToken, requireAdmin, requireAuth } = require("../../miiddleware/authMiddleware");
const createCourse = require("../../controllers/courses/createCourse");
const getAllCourses = require("../../controllers/courses/getAllCourses");
const getCourseById = require("../../controllers/courses/getCourseById");
const updateCourse = require("../../controllers/courses/updateCourse");
const deleteCourse = require("../../controllers/courses/deleteCourse");


// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// Validation rules
const courseValidation = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Course code is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Course code must be between 2 and 20 characters")
    .matches(/^[A-Z0-9\s\-]+$/)
    .withMessage("Course code can only contain uppercase letters, numbers, spaces, and hyphens"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Course title must be between 3 and 200 characters"),
  body("creditHours")
    .isInt({ min: 1, max: 10 })
    .withMessage("Credit hours must be an integer between 1 and 10"),
  body("termId")
    .isInt({ min: 1 })
    .withMessage("Term ID is required and must be a valid positive integer"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
];

const idValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a valid positive integer"),
];

const updateCourseValidation = [
  body("code")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Course code cannot be empty")
    .isLength({ min: 2, max: 20 })
    .withMessage("Course code must be between 2 and 20 characters")
    .matches(/^[A-Z0-9\s\-]+$/)
    .withMessage("Course code can only contain uppercase letters, numbers, spaces, and hyphens"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Course title cannot be empty")
    .isLength({ min: 3, max: 200 })
    .withMessage("Course title must be between 3 and 200 characters"),
  body("creditHours")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Credit hours must be an integer between 1 and 10"),
  body("termId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Term ID must be a valid positive integer"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
];

// Routes
router.get("/", verifyToken, requireAuth, getAllCourses);
router.get("/:id", verifyToken, requireAuth, idValidation, handleValidationErrors,
  getCourseById
);
router.post("/create", verifyToken, requireAdmin, courseValidation, handleValidationErrors,
  createCourse
);
router.put("/:id", verifyToken, requireAdmin, idValidation, updateCourseValidation, handleValidationErrors,
  updateCourse
);
router.delete("/:id", verifyToken, requireAdmin, idValidation, handleValidationErrors,
  deleteCourse
);
module.exports = router;