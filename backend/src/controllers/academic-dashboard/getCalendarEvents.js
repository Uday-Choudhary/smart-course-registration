const prisma = require("../../prisma");

const getCalendarEvents = async (req, res) => {
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


module.exports = getCalendarEvents;
