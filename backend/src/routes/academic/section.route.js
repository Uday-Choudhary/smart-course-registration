const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const { verifyToken, requireAdmin } = require("../../miiddleware/authMiddleware");
const createSection = require("../../controllers/sections/createSection");
const getAllSections = require("../../controllers/sections/getAllSections");
const getSectionById = require("../../controllers/sections/getSectionById");
const updateSection = require("../../controllers/sections/updateSection");
const deleteSection = require("../../controllers/sections/deleteSection");
const addCourseToSection = require("../../controllers/sections/addCourseToSection");


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
const sectionValidation = [
  body("sectionCode").trim().notEmpty(),
  body("capacity").isInt({ min: 1 }),
  body("termId").isInt({ min: 1 }),
];

const addCourseValidation = [
  body("sectionId").isInt({ min: 1 }),
  body("courseId").isInt({ min: 1 }),
  body("facultyId").optional(),
];

const idValidation = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a valid positive integer"),
];

const updateSectionValidation = [
  body("sectionCode").optional().trim().notEmpty(),
  body("capacity").optional().isInt({ min: 1 }),
  body("termId").optional().isInt({ min: 1 }),
];

// Routes
router.get("/", getAllSections);
router.get("/:id", idValidation, handleValidationErrors,
  getSectionById
);
router.post("/create", verifyToken, requireAdmin, sectionValidation, handleValidationErrors,
  createSection
);
router.post("/add-course", verifyToken, requireAdmin, addCourseValidation, handleValidationErrors,
  addCourseToSection
);
router.put("/:id", verifyToken, requireAdmin, idValidation, updateSectionValidation, handleValidationErrors,
  updateSection
);
router.delete("/:id", verifyToken, requireAdmin, idValidation, handleValidationErrors,
  deleteSection
);
module.exports = router;