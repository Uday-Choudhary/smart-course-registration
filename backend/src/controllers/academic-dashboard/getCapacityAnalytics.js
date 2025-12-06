const prisma = require("../../prisma");

const getCapacityAnalytics = async (req, res) => {
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

        const sections = await prisma.section.findMany({
            where: { termId: currentTerm.id },
            include: {
                _count: {
                    select: { registrations: true }
                }
            }
        });

        // Categorize sections by utilization
        const categories = {
            full: 0,      // 100%
            high: 0,      // 80-99%
            medium: 0,    // 50-79%
            low: 0        // <50%
        };

        sections.forEach(section => {
            const utilization = (section._count.registrations / section.capacity) * 100;

            if (utilization >= 100) {
                categories.full++;
            } else if (utilization >= 80) {
                categories.high++;
            } else if (utilization >= 50) {
                categories.medium++;
            } else {
                categories.low++;
            }
        });

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error("getCapacityAnalytics Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch capacity analytics",
            details: error.message
        });
    }
};

// Get calendar events (deadlines)

module.exports = getCapacityAnalytics;
