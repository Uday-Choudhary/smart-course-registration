const prisma = require("../../prisma");

const createSchedule=async (req,res) => {
    const {sectionId,courseId,roomId,dayOfWeek,startTime,endTime}= req.body;
    try {
        const sectionCourse = await prisma.sectionCourse.findUnique({
            where: {
                sectionId_courseId: {
                    sectionId: parseInt(sectionId),courseId: parseInt(courseId),},},});

        if (!sectionCourse) {
            return res.status(404).json({ error:"Course not found in this section (Batch). Please add the course to the section first." });
        }

        const newSchedule = await prisma.sectionSchedule.create({
            data:{
                sectionCourseId: sectionCourse.id,roomId: parseInt(roomId),dayOfWeek,startTime: new Date(`1970-01-01T${startTime}`),endTime: new Date(`1970-01-01T${endTime}`),facultyId: req.body.facultyId || null,},include: {
                sectionCourse: {
                    include: {
                        section:true,course:true,faculty:true,},},room:true,},});
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json({ error:error.message });
    }
}

module.exports=createSchedule;
