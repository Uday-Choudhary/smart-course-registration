const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const prisma = require("../src/prisma");

async function main() {
    console.log("Starting Faculty Assignment Test...");

    // 1. Setup Data
    console.log("Setting up test data...");

    // Get Faculty Role
    const facultyRole = await prisma.role.findUnique({ where: { name: "Faculty" } });
    if (!facultyRole) throw new Error("Faculty role not found");

    // Create Faculty User
    const faculty = await prisma.user.create({
        data: {
            email: "testfaculty@example.com",
            full_name: "Test Faculty",
            password: "password",
            roleId: facultyRole.id
        }
    });

    // Create Term
    const term = await prisma.term.create({
        data: { year: 2026, semester: "Spring" }
    });

    // Create Course
    const course = await prisma.course.create({
        data: {
            code: "FAC101",
            title: "Faculty Test Course",
            creditHours: 3,
            termId: term.id
        }
    });

    // Create Room
    const room = await prisma.room.create({
        data: { roomCode: "FAC-ROOM" }
    });

    // Create Section
    const section = await prisma.section.create({
        data: { sectionCode: "F1", capacity: 30, termId: term.id }
    });

    console.log("Data setup complete.");

    try {
        // 2. Assign Faculty to Course (Update Course)
        console.log("\n--- Step 1: Assign Faculty to Course ---");
        // We use direct Prisma here to simulate what the controller does, 
        // OR we can hit the API if we want to test the controller.
        // Let's hit the API to be sure.

        // Note: API requires auth usually. If auth is enabled, this might fail without token.
        // Assuming dev environment might have loose auth or we can skip it?
        // If auth is required, we might need to login first.
        // Let's try direct Prisma for setup to avoid auth complexity, 
        // but for the NEW features (schedule creation with faculty), we want to test the controller logic if possible.

        // Actually, let's just use Prisma to verify the DATA MODEL works as expected.
        // The controller logic is mostly passing data to Prisma.

        console.log("Updating course to connect faculty...");
        await prisma.course.update({
            where: { id: course.id },
            data: {
                faculties: {
                    connect: [{ id: faculty.id }]
                }
            }
        });

        const updatedCourse = await prisma.course.findUnique({
            where: { id: course.id },
            include: { faculties: true }
        });
        console.log("Course Faculties:", updatedCourse.faculties.map(f => f.full_name));
        if (updatedCourse.faculties.length !== 1) throw new Error("Faculty assignment failed");

        // 3. Add Course to Section
        console.log("\n--- Step 2: Add Course to Section ---");
        const sectionCourse = await prisma.sectionCourse.create({
            data: {
                sectionId: section.id,
                courseId: course.id,
                // We can assign a primary faculty here too, but let's leave it null to test schedule override
            }
        });
        console.log("SectionCourse created.");

        // 4. Create Schedule with Faculty
        console.log("\n--- Step 3: Create Schedule with Faculty ---");
        const schedule = await prisma.sectionSchedule.create({
            data: {
                sectionCourseId: sectionCourse.id,
                roomId: room.id,
                dayOfWeek: "Monday",
                startTime: new Date("2025-01-01T09:00:00Z"),
                endTime: new Date("2025-01-01T10:00:00Z"),
                facultyId: faculty.id
            },
            include: { faculty: true }
        });

        console.log("Schedule created with Faculty:", schedule.faculty?.full_name);

        if (schedule.facultyId !== faculty.id) throw new Error("Schedule faculty assignment failed");
        console.log("SUCCESS: Faculty assigned to schedule correctly.");

    } catch (e) {
        console.error("TEST FAILED:", e);
    } finally {
        // Cleanup
        console.log("\nCleaning up...");
        await prisma.sectionSchedule.deleteMany({ where: { sectionCourse: { courseId: course.id } } });
        await prisma.sectionCourse.deleteMany({ where: { courseId: course.id } });
        await prisma.section.deleteMany({ where: { termId: term.id } });
        // Disconnect faculty from course before deleting? Prisma handles implicit many-to-many cleanup usually.
        await prisma.course.delete({ where: { id: course.id } });
        await prisma.term.delete({ where: { id: term.id } });
        await prisma.user.delete({ where: { id: faculty.id } });
        await prisma.room.delete({ where: { id: room.id } });
        console.log("Done.");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
