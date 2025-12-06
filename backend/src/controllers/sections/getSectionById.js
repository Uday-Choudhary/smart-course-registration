const prisma = require("../../prisma");

/**
 * Get section by ID
 * @route GET /api/academic/sections/:id
 * @access Admin
 */
const getSectionById = async (req, res) => {
    try {
        const { id } = req.params;

        const section = await prisma.section.findUnique({
            where: { id: parseInt(id) },
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
                registrations: {
                    include: {
                        student: {
                            select: { id: true, full_name: true, email: true },
                        },
                    },
                },
                waitlists: {
                    include: {
                        student: {
                            select: { id: true, full_name: true, email: true },
                        },
                    },
                },
            },
        });

        if (!section) {
            return res.status(404).json({
                success: false,
                error: "Section not found",
            });
        }

        res.status(200).json({
            success: true,
            data: section,
        });
    } catch (error) {
        console.error("getSectionById Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch section",
            details: error.message
        });
    }
};

module.exports = getSectionById;
