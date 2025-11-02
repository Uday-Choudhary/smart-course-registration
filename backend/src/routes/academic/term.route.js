const express=require("express");
const router=express.Router();
const {body,param,validationResult} =require("express-validator");
const {verifyToken,requireAdmin} =require("../../miiddleware/authMiddleware");
const {createTerm,getAllTerms,getTermById,updateTerm,deleteTerm,}= 
require("../../controllers/academic/term.controller");

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
const termValidation = [
  body("year")
    .isInt({ min: 1900, max: 3000 })
    .withMessage("Year must be a valid integer between 1900 and 3000"),
  body("semester")
    .trim()
    .notEmpty()
    .withMessage("Semester is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Semester must be between 2 and 50 characters"),
];

const idValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a valid positive integer"),
];

const updateTermValidation =[
  body("year")
    .optional()
    .isInt({ min: 1900, max: 3000 })
    .withMessage("Year must be a valid integer between 1900 and 3000"),
  body("semester")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Semester cannot be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage("Semester must be between 2 and 50 characters"),
];

// Routes
router.get("/", getAllTerms);
router.get("/:id",idValidation,handleValidationErrors,
  getTermById
);
//admin only
router.post("/create",verifyToken,requireAdmin,termValidation,handleValidationErrors,
  createTerm
);
//admin only
router.put("/:id",verifyToken,requireAdmin,idValidation,updateTermValidation,handleValidationErrors,
  updateTerm
);
// admin only
router.delete("/:id",verifyToken,requireAdmin,idValidation,handleValidationErrors,
  deleteTerm
);
module.exports = router;

