const express=require("express");
const router=express.Router();
const {body,param,validationResult} =require("express-validator");
const {verifyToken,requireAdmin} =require("../../miiddleware/authMiddleware");
const {createDepartment,getAllDepartments,getDepartmentById,updateDepartment,deleteDepartment,}= 
require("../../controllers/academic/department.controller");

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
const departmentValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Department name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Department name must be between 2 and 100 characters"),
];

const idValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a valid positive integer"),
];

const updateDepartmentValidation =[
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Department name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Department name must be between 2 and 100 characters"),
];

// Routes
router.get("/", getAllDepartments);
router.get("/:id",idValidation,handleValidationErrors,
  getDepartmentById
);
//admin only
router.post("/create",verifyToken,requireAdmin,departmentValidation,handleValidationErrors,
  createDepartment
);
//admin only
router.put("/:id",verifyToken,requireAdmin,idValidation,updateDepartmentValidation,handleValidationErrors,
  updateDepartment
);
// admin only
router.delete("/:id",verifyToken,requireAdmin,idValidation,handleValidationErrors,
  deleteDepartment
);
module.exports = router;
