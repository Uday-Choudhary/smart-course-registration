const prisma = require("../../prisma");

/**
 * Get all sections
 * @route GET /api/academic/sections
 * @access Admin
 */
const getAllSections = async (req, res) => {
    try {
        const sections = await prisma.section.findMany({
            orderBy: [
                { termId: 'desc' },
                { sectionCode: 'asc' },
            ],
            include: {
                term: true,
                sectionCourses: {
                    include: {
                        course: {
                            include: {
                                faculties: {
                                    select: { id: true, full_name: true }
                                }
                            }
                        },
                        faculty: {
                            select: { id: true, full_name: true, email: true },
                        },
                        schedules: {
                            include: { room: true }
                        }
                    }
                },
            },
        });

        res.status(200).json({
            success: true,
            count: sections.length,
            data: sections,
        });
    } catch (error) {
        console.error("getAllSections Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch sections",
            details: error.message
        });
    }
};

module.exports = getAllSections;
