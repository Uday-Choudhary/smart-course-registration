const express=require("express");
const router=express.Router();
const {body,param,validationResult} =require("express-validator");
const {verifyToken,requireAdmin} =require("../../miiddleware/authMiddleware");
const {createRoom,getAllRooms,getRoomById,updateRoom,deleteRoom,}=require("../../controllers/academic/room.controller");

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
const roomValidation = [
  body("roomCode")
    .trim()
    .notEmpty()
    .withMessage("Room code is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Room code must be between 1 and 50 characters")
    .matches(/^[A-Za-z0-9\s\-_]+$/)
    .withMessage("Room code can only contain letters, numbers, spaces, hyphens, and underscores"),
];

const idValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a valid positive integer"),
];

const updateRoomValidation = [
  body("roomCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Room code cannot be empty")
    .isLength({ min: 1, max: 50 })
    .withMessage("Room code must be between 1 and 50 characters")
    .matches(/^[A-Za-z0-9\s\-_]+$/)
    .withMessage("Room code can only contain letters, numbers, spaces, hyphens, and underscores"),
];

// Routes
router.get("/",getAllRooms);
router.get("/:id",idValidation,handleValidationErrors,
  getRoomById
);
router.post("/create",verifyToken,requireAdmin,roomValidation,handleValidationErrors,
  createRoom
);
router.put("/:id",verifyToken,requireAdmin,idValidation,updateRoomValidation,handleValidationErrors,
  updateRoom
);
router.delete("/:id",verifyToken,requireAdmin,idValidation,handleValidationErrors,
  deleteRoom
);
module.exports=router;