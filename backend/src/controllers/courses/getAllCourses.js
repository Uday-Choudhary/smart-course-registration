const prisma = require("../../prisma");

// access Authenticated
const getAllCourses=async(req, res) => {
    try {
        const courses=await prisma.course.findMany({
            orderBy: {
                code: 'asc',
            },
            include: {
                term: {
                    select: {
                        id: true,
                        year: true,
                        semester: true,
                    },
                },
                faculties: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                    },
                },
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
                    },
                },
            },
        });

        res.status(200).json({
            success:true,
            count:courses.length,
            data:courses,
        });
    } catch (error) {
        console.error("getAllCourses Error:",error);
        res.status(500).json({
            success:false,
            error: "Failed to fetch courses",
            details: error.message
        });
    }
};

module.exports=getAllCourses;
