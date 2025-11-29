const express = require("express");
const router = express.Router();

const {
    getAdminDashboardStats,
    getEnrollmentTrends,
    getCapacityAnalytics,
    getCalendarEvents
} = require("../../controllers/academic/dashboard.controller");

router.get("/stats", getAdminDashboardStats);
router.get("/enrollment-trends", getEnrollmentTrends);
router.get("/capacity", getCapacityAnalytics);
router.get("/calendar-events", getCalendarEvents);

module.exports = router;
