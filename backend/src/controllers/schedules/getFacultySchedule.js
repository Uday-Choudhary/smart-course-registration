const prisma = require("../../prisma");

const getFacultySchedule=async (req,res) => {
    try {
        const facultyId = req.user.id;
        const schedules = await prisma.sectionSchedule.findMany({
            where: {
                facultyId: facultyId
            },include: {
                sectionCourse: {
                    include: {
                        section:true,course:true,},},room:true,},});
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error:error.message });
    }
}

module.exports=getFacultySchedule;
