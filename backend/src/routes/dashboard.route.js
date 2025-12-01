const express = require("express");
const router = express.Router();
const {
    getDashboardStats,
    getEnrollmentTrends,
    getCapacityAnalytics,
    getCalendarEvents
} = require("../controllers/dashboard.controller");
const { getAllWaitlists } = require("../controllers/admin/waitlist.controller");
const { verifyToken, requireAdmin } = require("../miiddleware/authMiddleware");

// GET /api/dashboard/stats
router.get("/stats", verifyToken, requireAdmin, getDashboardStats);
router.get("/enrollment-trends", verifyToken, requireAdmin, getEnrollmentTrends);
router.get("/capacity", verifyToken, requireAdmin, getCapacityAnalytics);
router.get("/calendar-events", verifyToken, requireAdmin, getCalendarEvents);
router.get("/waitlists", verifyToken, requireAdmin, getAllWaitlists);

module.exports = router;
