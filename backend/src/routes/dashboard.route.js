const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboard.controller");
const { verifyToken, requireAdmin } = require("../miiddleware/authMiddleware"); // Note the double 'i' in middleware path from server.js

// GET /api/dashboard/stats
router.get("/stats", verifyToken, requireAdmin, getDashboardStats);

module.exports = router;
