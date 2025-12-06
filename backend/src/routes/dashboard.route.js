const express = require("express");
const router = express.Router();
const getDashboardStats = require("../controllers/dashboard/getDashboardStats");
const getEnrollmentTrends = require("../controllers/dashboard/getEnrollmentTrends");
const getCapacityAnalytics = require("../controllers/dashboard/getCapacityAnalytics");
const getCalendarEvents = require("../controllers/dashboard/getCalendarEvents");
const getAllWaitlists = require("../controllers/waitlists/getAllWaitlists");
const { verifyToken, requireAdmin } = require("../miiddleware/authMiddleware");


// GET /api/dashboard/stats
router.get("/stats", verifyToken, requireAdmin, getDashboardStats);
router.get("/enrollment-trends", verifyToken, requireAdmin, getEnrollmentTrends);
router.get("/capacity", verifyToken, requireAdmin, getCapacityAnalytics);
router.get("/calendar-events", verifyToken, requireAdmin, getCalendarEvents);
router.get("/waitlists", verifyToken, requireAdmin, getAllWaitlists);

module.exports = router;
