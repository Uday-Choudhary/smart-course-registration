const prisma = require("../../prisma");

const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { sectionId, courseId, roomId, dayOfWeek, startTime, endTime } = req.body;
    try {
        const updateData = {
            roomId: parseInt(roomId),
            dayOfWeek,
            startTime: new Date(`1970-01-01T${startTime}`),
            endTime: new Date(`1970-01-01T${endTime}`),
            facultyId: req.body.facultyId || null,
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
}

module.exports = updateSchedule;
