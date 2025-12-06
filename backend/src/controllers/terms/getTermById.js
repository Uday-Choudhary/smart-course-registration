const prisma = require("../../prisma");

// access Public
const getTermById=async(req, res) => {
    try {
        const {id}=req.params;
        const term=await prisma.term.findUnique({
            where: {id:parseInt(id) },
            include: {
                courses: {
                    select: {
                        id: true,
                        code: true,
                        title: true,
                        creditHours: true,
                        faculties: {
                            select: {
                                full_name: true
                            }
                        }
                    },
                },
                sections: {
                    include: {
                        sectionCourses: {
                            include: {
                                course: {
                                    select: {
                                        id: true,
                                        code: true,
                                        title: true,
                                    },
                                },
                                faculty: {
                                    select: {
                                        id: true,
                                        full_name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!term) {
            return res.status(404).json({
                success:false,
                error: "Term not found",
            });
        }
        res.status(200).json({
            success:true,
            data:term,
        });
    } catch (error) {
        console.error("getTermById Error:", error);
        res.status(500).json({
            success:false,
            error:"Failed to fetch term",
            details:error.message
        });
    }
};

module.exports=getTermById;
