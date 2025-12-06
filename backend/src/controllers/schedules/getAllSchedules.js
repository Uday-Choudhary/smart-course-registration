const prisma = require("../../prisma");

const getAllSchedules=async (req,res) => {
    try {
        const schedules = await prisma.sectionSchedule.findMany({
            include: {
                sectionCourse: {
                    include: {
                        section:true,course:true,faculty:true,},},room:true,faculty: {
                    select: {
                        id:true,full_name:true,}
                }
            },});
        console.log("Schedules from DB:",schedules);
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error:error.message });
    }
}

module.exports=getAllSchedules;
