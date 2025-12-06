const prisma = require("../../prisma");

const getEnrollmentTrends = async (req, res) => {
    try {
        const currentTerm = await prisma.term.findFirst({
            orderBy: { id: 'desc' }
        });

        if (!currentTerm) {
            return res.status(404).json({
                success: false,
                error: "No term found"
            });
        }

        // Get registrations from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const registrations = await prisma.registration.findMany({
            where: {
                section: { termId: currentTerm.id },
                createdAt: { gte: thirtyDaysAgo }
            },
            select: {
                createdAt: true
            }
        });

        // Group by date
        const trendMap = {};
        registrations.forEach(reg => {
            const date = reg.createdAt.toISOString().split('T')[0];
            trendMap[date] = (trendMap[date] || 0) + 1;
        });

        // Convert to array and sort
        const trends = Object.entries(trendMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json({
            success: true,
            data: trends
        });

    } catch (error) {
        console.error("getEnrollmentTrends Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch enrollment trends",
            details: error.message
        });
    }
};

// Get capacity analytics

module.exports = getEnrollmentTrends;
