const prisma = require("../../prisma");

/**
 * Create a new section (Batch)
 * @route POST /api/academic/sections/create
 * @access Admin
 */
const createSection = async (req, res) => {
    try {
        const { sectionCode, capacity, termId } = req.body;

        const term = await prisma.term.findUnique({
            where: { id: parseInt(termId) },
        });

        if (!term) {
            return res.status(404).json({
                success: false,
                error: "Term not found",
            });
        }

        const section = await prisma.section.create({
            data: {
                sectionCode: sectionCode.trim(),
                capacity: parseInt(capacity),
                termId: parseInt(termId),
            },
            include: {
                term: true,
            },
        });

        res.status(201).json({
            success: true,
            message: "Section (Batch) created successfully",
            data: section,
        });
    } catch (error) {
        console.error("createSection Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create section",
            details: error.message
        });
    }
};

module.exports = createSection;
