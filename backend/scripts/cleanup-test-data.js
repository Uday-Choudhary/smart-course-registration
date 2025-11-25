const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const prisma = require("../src/prisma");

async function main() {
    console.log("Cleaning up test data...");
    try {
        await prisma.registration.deleteMany({ where: { student: { email: { in: ["teststudent@example.com", "filler@example.com"] } } } });
        await prisma.waitlist.deleteMany({ where: { student: { email: { in: ["teststudent@example.com", "filler@example.com"] } } } });

        // Find course to delete related sections
        const course = await prisma.course.findUnique({ where: { code: "TEST101" } });
        if (course) {
            await prisma.sectionSchedule.deleteMany({ where: { sectionCourse: { courseId: course.id } } });
            await prisma.sectionCourse.deleteMany({ where: { courseId: course.id } });
            await prisma.course.delete({ where: { id: course.id } });
        }

        await prisma.section.deleteMany({ where: { term: { year: 2025, semester: "Fall" } } });
        await prisma.term.deleteMany({ where: { year: 2025, semester: "Fall" } });
        await prisma.user.deleteMany({ where: { email: { in: ["teststudent@example.com", "filler@example.com"] } } });
        await prisma.room.deleteMany({ where: { roomCode: "TEST-ROOM" } });

        console.log("Cleanup complete.");
    } catch (e) {
        console.error("Cleanup failed:", e);
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
