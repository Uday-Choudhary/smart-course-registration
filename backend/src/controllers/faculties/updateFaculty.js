const prisma = require("../../prisma");

const updateFaculty=async (req,res) => {
  try {
    const {id}= req.params;
    const {full_name,phone,subjects,email,sex}= req.body;

    const updatedFaculty = await prisma.user.update({
      where: { id },data:{
        full_name,email,phone,sex,subjects: subjects ? JSON.stringify(subjects) : null,},select: {
        id:true,full_name:true,email:true,phone:true,sex:true,subjects:true,sectionCoursesTaught: {
          select: {
            id:true,section: {
              select: {
                sectionCode:true,term: {
                  select: {
                    year:true,semester:true,},},},},course: {
              select: {
                code:true,title:true,},},},},},});
    const formattedFaculty = {
      ...updatedFaculty,subjects: updatedFaculty.subjects ? (typeof updatedFaculty.subjects === 'string' ? JSON.parse(updatedFaculty.subjects) : updatedFaculty.subjects) : [],classes: updatedFaculty.sectionCoursesTaught.map((sc) =>
        `${sc.course.code} - ${sc.section.sectionCode} (${sc.section.term.semester} ${sc.section.term.year})`
      ),};

    res.json(formattedFaculty);
  } catch (error) {
    console.error("Error updating faculty:",error);
    res.status(500).json({ error:"Failed to update faculty" });
  }
}

module.exports=updateFaculty;
