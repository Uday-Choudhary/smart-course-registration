const express = require("express");
const router = express.Router();
const { verifyToken } = require("../miiddleware/authMiddleware");
const getNotifications = require("../controllers/notifications/getNotifications");
const markAsRead = require("../controllers/notifications/markAsRead");
const markAllAsRead = require("../controllers/notifications/markAllAsRead");


router.get("/", verifyToken, getNotifications);
router.put("/:id/read", verifyToken, markAsRead);
router.put("/read-all", verifyToken, markAllAsRead);

module.exports = router;
