const prisma = require("../../prisma");

const createFaculty=async (req,res) => {
  try {
    const {full_name,email,phone,subjects,sex}= req.body;

    const role = await prisma.role.findUnique({
      where: { name: "Faculty" },});

    if (!role) return res.status(400).json({ error:"Faculty role not found" });

    const newFaculty = await prisma.user.create({
      data:{
        full_name,email,phone,sex,subjects: subjects ? JSON.stringify(subjects) : null,// store as JSON string
        roleId: role.id,password: await bcrypt.hash("default@123",10),// temporary password hashed
      },select: {
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
      ...newFaculty,subjects: newFaculty.subjects ? (typeof newFaculty.subjects === 'string' ? JSON.parse(newFaculty.subjects) : newFaculty.subjects) : [],classes: newFaculty.sectionCoursesTaught.map((sc) =>
        `${sc.course.code} - ${sc.section.sectionCode} (${sc.section.term.semester} ${sc.section.term.year})`
      ),};

    res.status(201).json(formattedFaculty);
  } catch (error) {
    console.error("Error creating faculty:",error);
    res.status(500).json({ error:"Failed to create faculty" });
  }
}

module.exports=createFaculty;
