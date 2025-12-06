const prisma = require("../../prisma");

// --- Helper Functions ---

// Convert a Date object to minutes from midnight for easy comparison
const getMinutes = (date) => {
    const d = new Date(date);
    return d.getUTCHours() * 60 + d.getUTCMinutes();
};

// Check if two schedules overlap
const doSchedulesClash = (scheduleA, scheduleB) => {
    if (scheduleA.dayOfWeek !== scheduleB.dayOfWeek) return false;

    const startA = getMinutes(scheduleA.startTime);
    const endA = getMinutes(scheduleA.endTime);
    const startB = getMinutes(scheduleB.startTime);
    const endB = getMinutes(scheduleB.endTime);

    // Overlap logic: (StartA < EndB) AND (EndA > StartB)
    return startA < endB && endA > startB;
};

// Format time to human-readable format (e.g., "10:00 AM")
const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Find any clashes between target schedules and existing registrations
const findTimeClashes = (targetSchedules, existingRegistrations) => {
    const clashes = [];

    for (const reg of existingRegistrations) {
        const existingSchedules = reg.section.sectionCourses.flatMap(sc => sc.schedules);

        for (const targetSch of targetSchedules) {
            for (const existingSch of existingSchedules) {
                if (doSchedulesClash(targetSch, existingSch)) {
                    const courseInfo = reg.section.sectionCourses[0]?.course;
                    clashes.push({
                        courseCode: courseInfo?.code || 'Unknown',
                        courseTitle: courseInfo?.title || 'Unknown Course',
                        day: targetSch.dayOfWeek,
                        time: `${formatTime(targetSch.startTime)} - ${formatTime(targetSch.endTime)}`
                    });
                }
            }
        }
    }
    return clashes;
};

// Find alternative sections that don't clash and have seats
const findValidAlternatives = async (targetSection, existingRegistrations) => {
    // Get all course IDs in this section (usually just one)
    const courseIds = targetSection.sectionCourses.map(sc => sc.courseId);

    // Find other sections for the same course(s) in the same term
    const candidates = await prisma.section.findMany({
        where: {
            termId: targetSection.termId,
            id: { not: targetSection.id }, // Exclude the one we are trying to join
            sectionCourses: { some: { courseId: { in: courseIds } } }
        },
        include: {
            sectionCourses: {
                include: {
                    schedules: {
                        include: {
                            room: true
                        }
                    },
                    faculty: true,
                    course: true
                }
            },
            registrations: true // Need this to check capacity
        }
    });

    console.log('Found candidates:', candidates.length);
    const validAlternatives = [];

    for (const candidate of candidates) {
        console.log(`Checking candidate section ${candidate.sectionCode}:`, {
            registrations: candidate.registrations.length,
            capacity: candidate.capacity,
            schedules: candidate.sectionCourses.flatMap(sc => sc.schedules).map(s => ({
                day: s.dayOfWeek,
                start: s.startTime,
                end: s.endTime
            }))
        });

        // 1. Skip if full
        if (candidate.registrations.length >= candidate.capacity) {
            console.log(`  -> Skipped: Section is full`);
            continue;
        }

        // 2. Check for clashes with existing registrations
        const candidateSchedules = candidate.sectionCourses.flatMap(sc => sc.schedules);
        const clashes = findTimeClashes(candidateSchedules, existingRegistrations);

        console.log(`  -> Clashes found: ${clashes.length}`);

        // 3. If no clashes, it's a valid alternative
        if (clashes.length === 0) {
            validAlternatives.push(candidate);
            console.log(`  -> Added as valid alternative`);
        }
    }

    console.log('Total valid alternatives:', validAlternatives.length);
    return validAlternatives;
};

module.exports = {
    getMinutes,
    doSchedulesClash,
    formatTime,
    findTimeClashes,
    findValidAlternatives
};
