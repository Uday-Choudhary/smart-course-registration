const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all schedules
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await prisma.sectionSchedule.findMany({
            include: {
                section: {
                    include: {
                        course: true,
                    },
                },
                room: true,
                faculty: true,
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
    const { sectionId, roomId, dayOfWeek, startTime, endTime, facultyId } = req.body;
    try {
        const newSchedule = await prisma.sectionSchedule.create({
            data: {
                sectionId: parseInt(sectionId),
                roomId: parseInt(roomId),
                dayOfWeek,
                startTime: new Date(`1970-01-01T${startTime}Z`),
                endTime: new Date(`1970-01-01T${endTime}Z`),
                facultyId,
            },
            include: {
                section: {
                    include: {
                        course: true,
                    },
                },
                room: true,
                faculty: true,
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
    const { sectionId, roomId, dayOfWeek, startTime, endTime, facultyId } = req.body;
    try {
        const updatedSchedule = await prisma.sectionSchedule.update({
            where: { id: parseInt(id) },
            data: {
                sectionId: parseInt(sectionId),
                roomId: parseInt(roomId),
                dayOfWeek,
                startTime: new Date(`1970-01-01T${startTime}Z`),
                endTime: new Date(`1970-01-01T${endTime}Z`),
                facultyId,
            },
            include: {
                section: {
                    include: {
                        course: true,
                    },
                },
                room: true,
                faculty: true,
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
