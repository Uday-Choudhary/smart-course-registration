const prisma = require("../../prisma");

const getAllFaculty=async (req,res) => {
  try {
    const faculty = await prisma.user.findMany({
      where: { role: { name: "Faculty" } },select: {
        id:true,full_name:true,email:true,phone:true,sex:true,subjects:true,sectionCoursesTaught: {
          select: {
            id:true,section: {
              select: {
                sectionCode:true,term: {
                  select: {
                    year:true,semester:true,},},},},course: {
              select: {
                code:true,title:true,},},},},},});
    const formattedFaculty = faculty.map((f) => ({
      ...f,subjects: f.subjects ? (typeof f.subjects === 'string' ? JSON.parse(f.subjects) : f.subjects) : [],classes: f.sectionCoursesTaught.map((sc) =>
        `${sc.course.code} - ${sc.section.sectionCode} (${sc.section.term.semester} ${sc.section.term.year})`
      ),}));

    res.json(formattedFaculty);
  } catch (error) {
    console.error("Error fetching faculty:",error);
    res.status(500).json({ error:"Failed to fetch faculty data" });
  }
}

module.exports=getAllFaculty;
