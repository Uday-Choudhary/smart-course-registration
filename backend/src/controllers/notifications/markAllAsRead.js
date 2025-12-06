const prisma = require("../../prisma");

const markAllAsRead=async (req,res) => {
    try {
        const userId = req.user.id;

        await prisma.notification.updateMany({
            where: { userId,read:false },data:{ read:true },});

        res.json({ message:"All notifications marked as read" });
    } catch (error) {
        console.error("Mark all as read error:",error);
        res.status(500).json({ error:"Failed to update notifications" });
    }
}

module.exports=markAllAsRead;
