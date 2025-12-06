const prisma = require("../../prisma");
function getRandomColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0,6 - c.length) + c;
}

const getMyTimetable=async (req,res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error:"not authenticated" });
    const registrations = await prisma.registration.findMany({
      where: { studentId: userId },include: {
        section: {
          include: {
            sectionCourses: {
              include: {
                course:true,faculty: {
                  select: { full_name:true },},schedules: {
                  include: {
                    room:true,},},},},},},},});
    const timetable = [];

    registrations.forEach((reg) => {
      const section = reg.section;
      if (!section) return;

      section.sectionCourses.forEach((sc) => {
        const course = sc.course;
        const facultyName = sc.faculty?.full_name || "TBA";

        sc.schedules.forEach((sched) => {
          timetable.push({
            id: sched.id,courseCode: course.code,courseTitle: course.title,sectionCode: section.sectionCode,faculty: facultyName,day: sched.dayOfWeek,// e.g.,"Monday","MON"
            startTime: sched.startTime,// DateTime object
            endTime: sched.endTime,// DateTime object
            room: sched.room?.roomCode || "TBA",color: getRandomColor(course.code),// Optional: helper for UI color
          });
        });
      });
    });

    res.json(timetable);
  } catch (error) {
    console.error("Error fetching timetable:",error);
    res.status(500).json({ error:"Failed to fetch timetable" });
  }
}

module.exports=getMyTimetable;
