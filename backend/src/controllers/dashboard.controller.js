const prisma = require("../prisma");

exports.getDashboardStats = async (req, res) => {
    try {
        // Count users by role
        const studentCount = await prisma.user.count({
            where: {
                role: {
                    name: "Student",
                },
            },
        });

        const facultyCount = await prisma.user.count({
            where: {
                role: {
                    name: "Faculty",
                },
            },
        });

        const courseCount = await prisma.course.count();
        const sectionCount = await prisma.section.count();
        const roomCount = await prisma.room.count();

        res.json({
            student: studentCount,
            faculty: facultyCount,
            course: courseCount,
            section: sectionCount,
            room: roomCount,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
};

