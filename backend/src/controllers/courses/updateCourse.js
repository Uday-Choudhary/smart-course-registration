const prisma = require("../../prisma");

// access Admin
const updateCourse=async(req, res) => {
    try {
        const {id}=req.params;
        const {code,title,creditHours,description,termId}=req.body;

        const updateData = {};
        if (code !== undefined) updateData.code = code.trim().toUpperCase();
        if (title !== undefined) updateData.title = title.trim();
        if (creditHours !== undefined) updateData.creditHours = parseInt(creditHours);
        if (description !== undefined) updateData.description = description ? description.trim() : null;
        if (termId !== undefined) updateData.termId = parseInt(termId);
        if (req.body.facultyIds) {
            updateData.faculties = {
                set: req.body.facultyIds.map(id => ({ id }))
            };
        }

        const course=await prisma.course.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course,
        });
    } catch (error) {
        console.error("updateCourse Error:",error);
        if (error.code === 'P2025') {
            return res.status(404).json({
                success:false,
                error:"Course not found",
            });
        }
        if (error.code==='P2002') {
            return res.status(409).json({
                success: false,
                error: "Course with this code already exists",
            });
        }
        res.status(500).json({
            success: false,
            error: "Failed to update course",
            details: error.message
        });
    }
};

module.exports=updateCourse;
