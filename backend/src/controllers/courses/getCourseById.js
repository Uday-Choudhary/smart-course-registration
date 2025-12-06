const prisma = require("../../prisma");

/**
 * Get course by ID
 * @route GET /api/academic/courses/:id
 * @access Authenticated
 */
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id: parseInt(id) },
            include: {
                sectionCourses: {
                    include: {
                        section: true,
                        faculty: {
                            select: {
                                id: true,
                                full_name: true,
                                email: true,
                            },
                        },
                        schedules: {
                            include: {
                                room: true,
                            },
                        },
                    },
                },
            },
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        console.error("getCourseById Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch course",
            details: error.message
        });
    }
};

module.exports = getCourseById;
