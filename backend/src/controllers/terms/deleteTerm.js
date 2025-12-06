const prisma = require("../../prisma");

/**
 * Delete term by ID
 * @route DELETE /api/academic/terms/:id
 * @access Admin
 */
const deleteTerm = async (req, res) => {
    try {
        const { id } = req.params;
        const sections = await prisma.section.findFirst({
            where: { termId: parseInt(id) },
        });
        if (sections) {
            return res.status(400).json({
                success: false,
                error: "Cannot delete term: Sections are associated with this term. Please delete sections first.",
            });
        }
        await prisma.term.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({
            success: true,
            message: "Term deleted successfully",
        });
    } catch (error) {
        console.error("deleteTerm Error:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: "Term not found",
            });
        }
        res.status(500).json({
            success: false,
            error: "Failed to delete term",
            details: error.message
        });
    }
};

module.exports = deleteTerm;
