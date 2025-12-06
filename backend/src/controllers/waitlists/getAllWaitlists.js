const prisma = require("../../prisma");

const getAllWaitlists = async (req, res) => {
    try {
        // Get current term
        const currentTerm = await prisma.term.findFirst({
            orderBy: { id: 'desc' }
        });

        if (!currentTerm) {
            return res.status(404).json({
                success: false,
                error: "No term found"
            });
        }

        // Fetch all waitlists for current term
        const waitlists = await prisma.waitlist.findMany({
            where: {
                section: { termId: currentTerm.id }
            },
            include: {
                student: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true
                    }
                },
                section: {
                    include: {
                        sectionCourses: {
                            include: {
                                course: {
                                    select: {
                                        code: true,
                                        title: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Calculate positions for each waitlist entry
        const formattedWaitlists = await Promise.all(
            waitlists.map(async (waitlist) => {
                // Calculate position by counting earlier entries in same section
                const position = await prisma.waitlist.count({
                    where: {
                        sectionId: waitlist.sectionId,
                        createdAt: { lte: waitlist.createdAt }
                    }
                });

                return {
                    id: waitlist.id,
                    studentId: waitlist.student.id,
                    studentName: waitlist.student.full_name,
                    studentEmail: waitlist.student.email,
                    courseCode: waitlist.section.sectionCourses[0]?.course.code || 'N/A',
                    courseTitle: waitlist.section.sectionCourses[0]?.course.title || 'N/A',
                    sectionCode: waitlist.section.sectionCode,
                    sectionId: waitlist.sectionId,
                    position,
                    joinedAt: waitlist.createdAt,
                    status: 'Active' // Can be enhanced to check if deadline passed
                };
            })
        );

        res.json({
            success: true,
            count: formattedWaitlists.length,
            data: formattedWaitlists
        });

    } catch (error) {
        console.error("getAllWaitlists Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch all waitlists",
            details: error.message
        });
    }
}

module.exports = getAllWaitlists;
