const express=require("express");
const router=express.Router();
const {body,param,validationResult} =require("express-validator");
const {verifyToken,requireAdmin} =require("../../miiddleware/authMiddleware");
const {createProgram,getAllPrograms,getProgramById,updateProgram,deleteProgram,}= 
require("../../controllers/academic/program.controller");

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
const programValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Program name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Program name must be between 2 and 100 characters"),
  body("departmentId")
    .isInt({ min: 1 })
    .withMessage("Department ID must be a valid positive integer"),
];

const idValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a valid positive integer"),
];

const updateProgramValidation =[
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Program name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Program name must be between 2 and 100 characters"),
  body("departmentId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Department ID must be a valid positive integer"),
];

// Routes
router.get("/", getAllPrograms);
router.get("/:id",idValidation,handleValidationErrors,
  getProgramById
);
//admin only
router.post("/create",verifyToken,requireAdmin,programValidation,handleValidationErrors,
  createProgram
);
//admin only
router.put("/:id",verifyToken,requireAdmin,idValidation,updateProgramValidation,handleValidationErrors,
  updateProgram
);
// admin only
router.delete("/:id",verifyToken,requireAdmin,idValidation,handleValidationErrors,
  deleteProgram
);
module.exports = router;
