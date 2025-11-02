const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const { verifyToken, requireAdmin } = require("../../miiddleware/authMiddleware");
const { createSection, getAllSections, getSectionById, updateSection, deleteSection, } = require("../../controllers/academic/section.controller");

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
  body("courseId").isInt({ min: 1 }),
  body("termId").isInt({ min: 1 }),
  body("facultyId").optional(),
];

const idValidation = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a valid positive integer"),
];

const updateSectionValidation = [
  body("sectionCode").optional().trim().notEmpty(),
  body("capacity").optional().isInt({ min: 1 }),
  body("courseId").optional().isInt({ min: 1 }),
  body("termId").optional().isInt({ min: 1 }),
  body("facultyId").optional(),
];

// Routes
router.get("/", getAllSections);
router.get("/:id", idValidation, handleValidationErrors,
  getSectionById
);
router.post("/create", verifyToken, requireAdmin, sectionValidation, handleValidationErrors,
  createSection
);
router.put("/:id", verifyToken, requireAdmin, idValidation, updateSectionValidation, handleValidationErrors,
  updateSection
);
router.delete("/:id", verifyToken, requireAdmin, idValidation, handleValidationErrors,
  deleteSection
);
module.exports = router;