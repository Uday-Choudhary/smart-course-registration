const prisma = require("../../prisma");

const getNotifications=async (req,res) => {
    try {
        const userId = req.user.id;

        const notifications = await prisma.notification.findMany({
            where: { userId },orderBy: { createdAt: "desc" },});

        res.json(notifications);
    } catch (error) {
        console.error("Get notifications error:",error);
        res.status(500).json({ error:"Failed to fetch notifications" });
    }
}

module.exports=getNotifications;
