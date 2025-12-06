const prisma = require("../../prisma");

/**
 * Delete section by ID
 * @route DELETE /api/academic/sections/:id
 * @access Admin
 */
const deleteSection = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if section has registrations or waitlists
        const registrations = await prisma.registration.findFirst({
            where: { sectionId: parseInt(id) },
        });

        if (registrations) {
            return res.status(400).json({
                success: false,
                error: "Cannot delete section: Registrations are associated with this section.",
            });
        }

        // Delete associated SectionCourses and Schedules first
        const sectionCourses = await prisma.sectionCourse.findMany({ where: { sectionId: parseInt(id) } });
        for (const sc of sectionCourses) {
            await prisma.sectionSchedule.deleteMany({ where: { sectionCourseId: sc.id } });
        }
        await prisma.sectionCourse.deleteMany({ where: { sectionId: parseInt(id) } });

        await prisma.section.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    } catch (error) {
        console.error("deleteSection Error:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, error: "Section not found" });
        }
        res.status(500).json({
            success: false,
            error: "Failed to delete section",
            details: error.message
        });
    }
};

module.exports = deleteSection;
