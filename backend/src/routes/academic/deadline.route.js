const express = require("express");
const router = express.Router();
const {
    getAllDeadlines,
    createDeadline,
    updateDeadline,
    deleteDeadline
} = require("../../controllers/academic/deadline.controller");
const { verifyToken, requireAdmin } = require("../../miiddleware/authMiddleware");

router.get("/", verifyToken, getAllDeadlines);
router.post("/create", verifyToken, requireAdmin, createDeadline);
router.put("/:id", verifyToken, requireAdmin, updateDeadline);
router.delete("/:id", verifyToken, requireAdmin, deleteDeadline);

module.exports = router;
