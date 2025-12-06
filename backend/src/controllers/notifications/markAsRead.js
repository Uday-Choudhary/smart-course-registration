const prisma = require("../../prisma");

const markAsRead = async (req, res) => {
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
}

module.exports = markAsRead;
