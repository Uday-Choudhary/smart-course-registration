const prisma = require("../prisma");

// Get main dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        // Determine Active Term based on recent activity
        // 1. Check most recent registration
        const lastRegistration = await prisma.registration.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { section: true }
        });

        // 2. Check most recent waitlist
        const lastWaitlist = await prisma.waitlist.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { section: true }
        });

        let currentTermId = null;

        // Use the most recent activity
        if (lastRegistration && lastWaitlist) {
            currentTermId = lastRegistration.createdAt > lastWaitlist.createdAt
                ? lastRegistration.section.termId
                : lastWaitlist.section.termId;
        } else if (lastRegistration) {
            currentTermId = lastRegistration.section.termId;
        } else if (lastWaitlist) {
            currentTermId = lastWaitlist.section.termId;
        }

        let currentTerm;
        if (currentTermId) {
            currentTerm = await prisma.term.findUnique({
                where: { id: currentTermId }
            });
        }

        // Fallback to latest term if no activity found
        if (!currentTerm) {
            currentTerm = await prisma.term.findFirst({
                orderBy: { id: 'desc' }
            });
        }

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
        console.error("getDashboardStats Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch dashboard statistics",
            details: error.message
        });
    }
};

// Get enrollment trends (daily registrations for last 30 days)
exports.getEnrollmentTrends = async (req, res) => {
    try {
        const currentTerm = await prisma.term.findFirst({
            orderBy: { id: 'desc' }
        });

        if (!currentTerm) {
            return res.status(404).json({
                success: false,
                error: "No term found"
            });
        }

        // Get registrations from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const registrations = await prisma.registration.findMany({
            where: {
                section: { termId: currentTerm.id },
                createdAt: { gte: thirtyDaysAgo }
            },
            select: {
                createdAt: true
            }
        });

        // Group by date
        const trendMap = {};
        registrations.forEach(reg => {
            const date = reg.createdAt.toISOString().split('T')[0];
            trendMap[date] = (trendMap[date] || 0) + 1;
        });

        // Convert to array and sort
        const trends = Object.entries(trendMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json({
            success: true,
            data: trends
        });

    } catch (error) {
        console.error("getEnrollmentTrends Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch enrollment trends",
            details: error.message
        });
    }
};

// Get capacity analytics
exports.getCapacityAnalytics = async (req, res) => {
    try {
        const currentTerm = await prisma.term.findFirst({
            orderBy: { id: 'desc' }
        });

        if (!currentTerm) {
            return res.status(404).json({
                success: false,
                error: "No term found"
            });
        }

        const sections = await prisma.section.findMany({
            where: { termId: currentTerm.id },
            include: {
                _count: {
                    select: { registrations: true }
                }
            }
        });

        // Categorize sections by utilization
        const categories = {
            full: 0,      // 100%
            high: 0,      // 80-99%
            medium: 0,    // 50-79%
            low: 0        // <50%
        };

        sections.forEach(section => {
            const utilization = (section._count.registrations / section.capacity) * 100;

            if (utilization >= 100) {
                categories.full++;
            } else if (utilization >= 80) {
                categories.high++;
            } else if (utilization >= 50) {
                categories.medium++;
            } else {
                categories.low++;
            }
        });

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error("getCapacityAnalytics Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch capacity analytics",
            details: error.message
        });
    }
};

// Get calendar events (deadlines)
exports.getCalendarEvents = async (req, res) => {
    try {
        const currentTerm = await prisma.term.findFirst({
            orderBy: { id: 'desc' }
        });

        if (!currentTerm) {
            return res.status(404).json({
                success: false,
                error: "No term found"
            });
        }

        const deadlines = await prisma.deadline.findMany({
            where: {
                course: { termId: currentTerm.id }
            },
            include: {
                course: {
                    select: { code: true, title: true }
                }
            }
        });

        // Convert deadlines to calendar events
        const events = [];

        deadlines.forEach(deadline => {
            // Registration Open
            events.push({
                date: deadline.registrationOpen,
                type: 'registration_open',
                title: `Registration Opens: ${deadline.course.code}`,
                courseCode: deadline.course.code,
                courseTitle: deadline.course.title,
                color: 'blue'
            });

            // Registration Close
            events.push({
                date: deadline.registrationClose,
                type: 'registration_close',
                title: `Registration Closes: ${deadline.course.code}`,
                courseCode: deadline.course.code,
                courseTitle: deadline.course.title,
                color: 'blue'
            });

            // Add/Drop Start
            events.push({
                date: deadline.addDropStart,
                type: 'add_drop_start',
                title: `Add/Drop Starts: ${deadline.course.code}`,
                courseCode: deadline.course.code,
                courseTitle: deadline.course.title,
                color: 'orange'
            });

            // Add/Drop End
            events.push({
                date: deadline.addDropEnd,
                type: 'add_drop_end',
                title: `Add/Drop Ends: ${deadline.course.code}`,
                courseCode: deadline.course.code,
                courseTitle: deadline.course.title,
                color: 'orange'
            });

            // Waitlist Close
            events.push({
                date: deadline.waitlistClose,
                type: 'waitlist_close',
                title: `Waitlist Closes: ${deadline.course.code}`,
                courseCode: deadline.course.code,
                courseTitle: deadline.course.title,
                color: 'red'
            });
        });

        // Sort by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json({
            success: true,
            data: events
        });

    } catch (error) {
        console.error("getCalendarEvents Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch calendar events",
            details: error.message
        });
    }
};
