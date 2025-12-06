const prisma = require("../../prisma");

const addCourseToSection=async (req,res) => {
    try {
        const {sectionId,courseId,facultyId}= req.body;

        const section = await prisma.section.findUnique({
            where: { id: parseInt(sectionId) },});

        if (!section) {
            return res.status(404).json({ success:false,error:"Section not found" });
        }

        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },});

        if (!course) {
            return res.status(404).json({ success:false,error:"Course not found" });
        }

        let faculty = null;
        if (facultyId) {
            const facultyRole = await prisma.role.findUnique({ where: { name: "Faculty" } });
            faculty = await prisma.user.findFirst({
                where: { id: facultyId,roleId: facultyRole.id },});
            if (!faculty) {
                return res.status(404).json({ success:false,error:"Faculty not found" });
            }
        }

        const sectionCourse = await prisma.sectionCourse.create({
            data:{
                sectionId: parseInt(sectionId),courseId: parseInt(courseId),facultyId: facultyId || null,},include: {
                course:true,faculty: {
                    select: { id:true,full_name:true,email:true },},},});

        res.status(201).json({
            success:true,message:"Course added to section successfully",data:sectionCourse,});

    } catch (error) {
        console.error("addCourseToSection Error:",error);
        if (error.code==='P2002') {
            return res.status(400).json({ success:false,error:"Course already added to this section" });
        }
        res.status(500).json({
            success:false,error:"Failed to add course to section",details:error.message
        });
    }
};

module.exports=addCourseToSection;
