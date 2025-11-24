const prisma = require("../prisma");

// Get user notifications
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        res.json(notifications);
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Ensure the notification belongs to the user
        const notification = await prisma.notification.findUnique({
            where: { id: parseInt(id) },
        });

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        if (notification.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await prisma.notification.update({
            where: { id: parseInt(id) },
            data: { read: true },
        });

        res.json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Mark as read error:", error);
        res.status(500).json({ error: "Failed to update notification" });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Mark all as read error:", error);
        res.status(500).json({ error: "Failed to update notifications" });
    }
}
;
