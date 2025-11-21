const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all schedules
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await prisma.sectionSchedule.findMany({
            include: {
                sectionCourse: {
                    include: {
                        section: true,
                        course: true,
                        faculty: true,
                    },
                },
                room: true,
            },
        });
        console.log("Schedules from DB:", schedules);
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new schedule
const createSchedule = async (req, res) => {
    const { sectionId, courseId, roomId, dayOfWeek, startTime, endTime } = req.body;
    try {
        // Find the SectionCourse
        const sectionCourse = await prisma.sectionCourse.findUnique({
            where: {
                sectionId_courseId: {
                    sectionId: parseInt(sectionId),
                    courseId: parseInt(courseId),
                },
            },
        });

        if (!sectionCourse) {
            return res.status(404).json({ error: "Course not found in this section (Batch). Please add the course to the section first." });
        }

        const newSchedule = await prisma.sectionSchedule.create({
            data: {
                sectionCourseId: sectionCourse.id,
                roomId: parseInt(roomId),
                dayOfWeek,
                startTime: new Date(`1970-01-01T${startTime}Z`),
                endTime: new Date(`1970-01-01T${endTime}Z`),
            },
            include: {
                sectionCourse: {
                    include: {
                        section: true,
                        course: true,
                        faculty: true,
                    },
                },
                room: true,
            },
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a schedule
const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { sectionId, courseId, roomId, dayOfWeek, startTime, endTime } = req.body;
    try {
        const updateData = {
            roomId: parseInt(roomId),
            dayOfWeek,
            startTime: new Date(`1970-01-01T${startTime}Z`),
            endTime: new Date(`1970-01-01T${endTime}Z`),
        };

        if (sectionId && courseId) {
            const sectionCourse = await prisma.sectionCourse.findUnique({
                where: {
                    sectionId_courseId: {
                        sectionId: parseInt(sectionId),
                        courseId: parseInt(courseId),
                    },
                },
            });

            if (!sectionCourse) {
                return res.status(404).json({ error: "Course not found in this section (Batch)." });
            }
            updateData.sectionCourseId = sectionCourse.id;
        }

        const updatedSchedule = await prisma.sectionSchedule.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                sectionCourse: {
                    include: {
                        section: true,
                        course: true,
                        faculty: true,
                    },
                },
                room: true,
            },
        });
        res.json(updatedSchedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.sectionSchedule.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
};
