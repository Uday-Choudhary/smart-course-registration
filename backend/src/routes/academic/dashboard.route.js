const express = require("express");
const router = express.Router();

const getAdminDashboardStats = require("../../controllers/academic-dashboard/getAdminDashboardStats");
const getEnrollmentTrends = require("../../controllers/academic-dashboard/getEnrollmentTrends");
const getCapacityAnalytics = require("../../controllers/academic-dashboard/getCapacityAnalytics");
const getCalendarEvents = require("../../controllers/academic-dashboard/getCalendarEvents");


router.get("/stats", getAdminDashboardStats);
router.get("/enrollment-trends", getEnrollmentTrends);
router.get("/capacity", getCapacityAnalytics);
router.get("/calendar-events", getCalendarEvents);

module.exports = router;
