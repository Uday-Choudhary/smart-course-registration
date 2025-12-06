const prisma = require("../../prisma");

const getAdminDashboardStats = async (req, res) => {
    try {
        // Get current term (most recent)
        const currentTerm = await prisma.term.findFirst({
            orderBy: { id: 'desc' }
        });

        if (!currentTerm) {
            return res.status(404).json({
                success: false,
                error: "No term found"
            });
        }

        // Parallel queries for better performance
        const [
            totalStudents,
            totalFaculty,
            totalCourses,
            totalSections,
            totalRegistrations,
            totalWaitlists,
            recentRegistrations,
            recentPromotions,
            oversubscribedSections,
            upcomingDeadlines
        ] = await Promise.all([
            // Total students
            prisma.user.count({
                where: { role: { name: "Student" } }
            }),

            // Total faculty
            prisma.user.count({
                where: { role: { name: "Faculty" } }
            }),

            // Total courses in current term
            prisma.course.count({
                where: { termId: currentTerm.id }
            }),

            // Total sections in current term
            prisma.section.count({
                where: { termId: currentTerm.id }
            }),

            // Total registrations in current term
            prisma.registration.count({
                where: { section: { termId: currentTerm.id } }
            }),

            // Total waitlist entries in current term
            prisma.waitlist.count({
                where: { section: { termId: currentTerm.id } }
            }),

            // Recent registrations (last 10)
            prisma.registration.findMany({
                where: { section: { termId: currentTerm.id } },
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    student: {
                        select: { id: true, full_name: true, email: true }
                    },
                    section: {
                        include: {
                            sectionCourses: {
                                include: {
                                    course: {
                                        select: { code: true, title: true }
                                    }
                                }
                            }
                        }
                    }
                }
            }),

            // Recent promotions from notifications
            prisma.notification.findMany({
                where: {
                    message: { contains: "enrolled" },
                    message: { contains: "waitlist" }
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, full_name: true }
                    }
                }
            }),

            // Oversubscribed sections (sections with waitlists)
            prisma.section.findMany({
                where: {
                    termId: currentTerm.id,
                    waitlists: { some: {} }
                },
                include: {
                    sectionCourses: {
                        include: {
                            course: {
                                select: { code: true, title: true }
                            }
                        }
                    },
                    _count: {
                        select: {
                            waitlists: true,
                            registrations: true
                        }
                    }
                },
                orderBy: {
                    waitlists: {
                        _count: 'desc'
                    }
                },
                take: 10
            }),

            // Upcoming deadlines (next 30 days)
            prisma.deadline.findMany({
                where: {
                    course: { termId: currentTerm.id },
                    OR: [
                        { registrationClose: { gte: new Date() } },
                        { addDropEnd: { gte: new Date() } },
                        { waitlistClose: { gte: new Date() } }
                    ]
                },
                include: {
                    course: {
                        select: { code: true, title: true }
                    }
                },
                take: 5
            })
        ]);

        // Calculate capacity utilization
        const sectionsWithCapacity = await prisma.section.findMany({
            where: { termId: currentTerm.id },
            include: {
                _count: {
                    select: { registrations: true }
                }
            }
        });

        const totalCapacity = sectionsWithCapacity.reduce((sum, s) => sum + s.capacity, 0);
        const totalEnrolled = sectionsWithCapacity.reduce((sum, s) => sum + s._count.registrations, 0);
        const capacityUtilization = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : 0;

        // Format recent registrations
        const formattedRegistrations = recentRegistrations.map(reg => ({
            id: reg.id,
            studentName: reg.student.full_name,
            studentEmail: reg.student.email,
            courseCode: reg.section.sectionCourses[0]?.course.code || 'N/A',
            courseTitle: reg.section.sectionCourses[0]?.course.title || 'N/A',
            sectionCode: reg.section.sectionCode,
            registeredAt: reg.createdAt
        }));

        // Format oversubscribed sections
        const formattedOversubscribed = oversubscribedSections.map(section => ({
            id: section.id,
            sectionCode: section.sectionCode,
            courseCode: section.sectionCourses[0]?.course.code || 'N/A',
            courseTitle: section.sectionCourses[0]?.course.title || 'N/A',
            capacity: section.capacity,
            enrolled: section._count.registrations,
            waitlisted: section._count.waitlists
        }));

        res.json({
            success: true,
            data: {
                currentTerm: {
                    id: currentTerm.id,
                    year: currentTerm.year,
                    semester: currentTerm.semester
                },
                stats: {
                    totalStudents,
                    totalFaculty,
                    totalCourses,
                    totalSections,
                    totalRegistrations,
                    totalWaitlists,
                    capacityUtilization: parseFloat(capacityUtilization)
                },
                recentRegistrations: formattedRegistrations,
                recentPromotions,
                oversubscribedSections: formattedOversubscribed,
                upcomingDeadlines
            }
        });

    } catch (error) {
        console.error("getAdminDashboardStats Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch dashboard statistics",
            details: error.message
        });
    }
};

// Get enrollment trends (daily registrations for last 30 days)

module.exports = getAdminDashboardStats;
