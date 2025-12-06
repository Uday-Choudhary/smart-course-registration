const prisma = require("../../prisma");

/**
 * Update term by ID
 * @route PUT /api/academic/terms/:id
 * @access Admin
 */
const updateTerm = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, semester } = req.body;
        const updateData = {};
        if (year !== undefined) updateData.year = parseInt(year);
        if (semester !== undefined) updateData.semester = semester.trim();

        const term = await prisma.term.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        res.status(200).json({
            success: true,
            message: "Term updated successfully",
            data: term,
        });
    } catch (error) {
        console.error("updateTerm Error:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: "Term not found",
            });
        }
        res.status(500).json({
            success: false,
            error: "Failed to update term",
            details: error.message
        });
    }
};

module.exports = updateTerm;
