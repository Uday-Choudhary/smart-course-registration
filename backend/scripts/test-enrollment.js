const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const prisma = require("../src/prisma");

async function main() {
    console.log("Starting Enrollment Test...");

    // 1. Setup Data
    console.log("Setting up test data...");

    // Create Term
    const term = await prisma.term.create({
        data: { year: 2025, semester: "Fall" }
    });

    // Create Course
    const course = await prisma.course.create({
        data: {
            code: "TEST101",
            title: "Test Course",
            creditHours: 3,
            termId: term.id
        }
    });

    // Create Room
    const room = await prisma.room.create({
        data: { roomCode: "TEST-ROOM" }
    });

    // Create Sections
    // Section A: Mon 10:00 - 11:00
    const sectionA = await prisma.section.create({
        data: { sectionCode: "A", capacity: 5, termId: term.id }
    });
    await prisma.sectionCourse.create({
        data: {
            sectionId: sectionA.id,
            courseId: course.id,
            schedules: {
                create: {
                    dayOfWeek: "Monday",
                    startTime: new Date("2025-01-01T10:00:00Z"),
                    endTime: new Date("2025-01-01T11:00:00Z"),
                    roomId: room.id
                }
            }
        }
    });

    // Section B: Mon 10:00 - 11:00 (Clash with A)
    const sectionB = await prisma.section.create({
        data: { sectionCode: "B", capacity: 5, termId: term.id }
    });
    await prisma.sectionCourse.create({
        data: {
            sectionId: sectionB.id,
            courseId: course.id,
            schedules: {
                create: {
                    dayOfWeek: "Monday",
                    startTime: new Date("2025-01-01T10:00:00Z"),
                    endTime: new Date("2025-01-01T11:00:00Z"),
                    roomId: room.id
                }
            }
        }
    });

    // Section C: Mon 12:00 - 13:00 (No Clash), Capacity 1
    const sectionC = await prisma.section.create({
        data: { sectionCode: "C", capacity: 1, termId: term.id }
    });
    await prisma.sectionCourse.create({
        data: {
            sectionId: sectionC.id,
            courseId: course.id,
            schedules: {
                create: {
                    dayOfWeek: "Monday",
                    startTime: new Date("2025-01-01T12:00:00Z"),
                    endTime: new Date("2025-01-01T13:00:00Z"),
                    roomId: room.id
                }
            }
        }
    });

    // Create Student
    const student = await prisma.user.create({
        data: {
            email: "teststudent@example.com",
            full_name: "Test Student",
            password: "password",
            roleId: 1 // Assuming 1 is student or valid role
        }
    });

    // Create Filler Student
    const filler = await prisma.user.create({
        data: {
            email: "filler@example.com",
            full_name: "Filler Student",
            password: "password",
            roleId: 1
        }
    });

    console.log("Data setup complete.");

    // 2. Test Scenarios

    // Scenario 1: Enroll in Section A (Success)
    console.log("\n--- Scenario 1: Enroll in Section A (Expect Success) ---");
    try {
        // Mocking request logic by calling DB directly or using fetch if server running.
        // Since we want to test the controller logic, we should probably hit the API.
        // But for simplicity in this script, let's use fetch against localhost:4000

        const res = await fetch("http://localhost:4000/api/enroll/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: student.id, sectionId: sectionA.id })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) { console.error(e); }

    // Scenario 2: Enroll in Section B (Clash with A)
    console.log("\n--- Scenario 2: Enroll in Section B (Expect 409 Clash) ---");
    try {
        const res = await fetch("http://localhost:4000/api/enroll/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: student.id, sectionId: sectionB.id })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) { console.error(e); }

    // Scenario 3: Waitlist Section C (Full)
    console.log("\n--- Scenario 3: Waitlist Section C (Expect 200 Waitlist) ---");
    // First fill Section C
    await prisma.registration.create({ data: { studentId: filler.id, sectionId: sectionC.id } });

    try {
        const res = await fetch("http://localhost:4000/api/enroll/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: student.id, sectionId: sectionC.id })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) { console.error(e); }

    // Cleanup
    console.log("\nCleaning up...");
    await prisma.registration.deleteMany({ where: { studentId: { in: [student.id, filler.id] } } });
    await prisma.waitlist.deleteMany({ where: { studentId: student.id } });
    await prisma.sectionSchedule.deleteMany({ where: { sectionCourse: { courseId: course.id } } });
    await prisma.sectionCourse.deleteMany({ where: { courseId: course.id } });
    await prisma.section.deleteMany({ where: { termId: term.id } });
    await prisma.course.delete({ where: { id: course.id } });
    await prisma.term.delete({ where: { id: term.id } });
    await prisma.user.deleteMany({ where: { email: { in: ["teststudent@example.com", "filler@example.com"] } } });
    await prisma.room.delete({ where: { id: room.id } });

    console.log("Done.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
