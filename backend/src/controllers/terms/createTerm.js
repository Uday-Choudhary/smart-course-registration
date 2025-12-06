const prisma = require("../../prisma");

/**
 * Create a new term
 * @route POST /api/academic/terms/create
 * @access Admin
 */
const createTerm = async (req, res) => {
    try {
        const { year, semester } = req.body;
        const term = await prisma.term.create({
            data: {
                year: parseInt(year),
                semester: semester.trim(),
            },
        });
        res.status(201).json({
            success: true,
            message: "Term created successfully",
            data: term,
        });
    } catch (error) {
        console.error("createTerm Error:", error);
        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                error: "Term with this year and semester combination may already exist"
            });
        }
        res.status(500).json({
            success: false,
            error: "Failed to create term",
            details: error.message
        });
    }
};

module.exports = createTerm;
