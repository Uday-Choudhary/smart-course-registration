const prisma = require("../../prisma");

// access Admin
const deleteCourse=async(req, res) => {
    try {
        const {id}=req.params;

        const sectionCourses = await prisma.sectionCourse.findFirst({
            where: { courseId: parseInt(id) },
        });

        if (sectionCourses) {
            return res.status(400).json({
                success:false,
                error: "Cannot delete course: Sections are associated with this course. Please remove course from sections first.",
            });
        }

        await prisma.course.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.error("deleteCourse Error:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: "Course not found",
            });
        }
        res.status(500).json({
            success: false,
            error: "Failed to delete course",
            details: error.message
        });
    }
};

module.exports = deleteCourse;
