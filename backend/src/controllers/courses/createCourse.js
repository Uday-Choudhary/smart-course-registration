const prisma = require("../../prisma");

// access Admin
const createCourse=async(req, res) => {
    try {
        const {code,title,creditHours,description,termId}=req.body;
        if (!termId) {
            return res.status(400).json({
                success:false,
                error: "Term ID is required",
            });
        }
        if (!code || code.trim().length === 0) {
            return res.status(400).json({
                success:false,
                error:"Course code is required",
            });
        }

        const trimmedCode=code.trim();
        if (trimmedCode !== trimmedCode.toUpperCase()) {
            return res.status(400).json({
                success:false,
                error:"Course code must be in UPPERCASE only",
            });
        }
        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                success:false,
                error:"Course title is required",
            });
        }

        if (title.trim().length < 3) {
            return res.status(400).json({
                success:false,
                error:"Course title must be at least 3 characters long",
            });
        }
        const course=await prisma.course.create({
            data: {
                code: trimmedCode.toUpperCase(),
                title: title.trim(),
                creditHours: parseInt(creditHours),
                description: description ? description.trim() : null,
                termId: parseInt(termId),
                faculties: req.body.facultyIds ? {
                    connect: req.body.facultyIds.map(id => ({ id }))
                } : undefined,
            },
        });
        res.status(201).json({
            success:true,
            message:"Course created successfully",
            data:course,
        });
    } catch (error) {
        console.error("createCourse Error:",error);
        if (error.code === 'P2002') {
            return res.status(409).json({
                success:false,
                error:"Course with this code already exists"
            });
        }
        res.status(500).json({
            success:false,
            error:"Failed to create course",
            details:error.message
        });
    }
};

module.exports = createCourse;
