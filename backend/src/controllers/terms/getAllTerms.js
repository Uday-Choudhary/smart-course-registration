const prisma = require("../../prisma");

/**
 * Get all terms
 * @route GET /api/academic/terms
 * @access Admin
 */
const getAllTerms = async (req, res) => {
    try {
        const terms = await prisma.term.findMany({
            orderBy: [
                { year: 'desc' },
                { semester: 'asc' },
            ],
            include: {
                courses: {
                    select: {
                        id: true,
                        code: true,
                        title: true,
                        creditHours: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            count: terms.length,
            data: terms,
        });
    } catch (error) {
        console.error("getAllTerms Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch terms",
            details: error.message
        });
    }
};

module.exports = getAllTerms;
