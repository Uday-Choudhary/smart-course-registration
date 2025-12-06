const prisma = require("../../prisma");

const getDashboardStats=async (req,res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error:"not authenticated" });

    console.log("=== FACULTY DASHBOARD STATS DEBUG ===");
    console.log("Faculty ID:",userId);
    console.log("Faculty Email:",req.user.email); // Log the email
    const sectionCourses = await prisma.sectionCourse.findMany({
      where: { facultyId: userId },include: {
        section: {
          include: {
            term:true,registrations: {
              include: {
                student: {
                  select: {
                    id:true,full_name:true,email:true
                  }
                }
              }
            }
          }
        },course:true,schedules: {
          include: {
            room:true
          }
        }
      }
    });

    console.log("Total section courses taught (DB fetch):",sectionCourses.length);
    if (sectionCourses.length > 0) {
      console.log("Sample Section Course:",JSON.stringify(sectionCourses[0],null,2));
    }
    const notifications = await prisma.notification.findMany({
      where: { userId },take: 5,orderBy: { createdAt: 'desc' }
    });
    let activeTermId = null;
    if (sectionCourses.length > 0) {
      const latestSectionCourse = sectionCourses.reduce((prev,current) => {
        return (prev.section.termId > current.section.termId) ? prev : current;
      });
      activeTermId = latestSectionCourse.section.termId;
    } else {
      const systemLatestTerm = await prisma.term.findFirst({
        orderBy: { id: 'desc' }
      });
      activeTermId = systemLatestTerm?.id;
    }

    console.log("Calculated Active term ID:",activeTermId);
    const activeSectionCourses = sectionCourses;
    /*
    const activeSectionCourses = activeTermId
      ? sectionCourses.filter(sc => sc.section.termId === activeTermId)
      : [];
    */

    console.log("Active section courses count:",activeSectionCourses.length);
    const totalSections = activeSectionCourses.length;
    const studentIds = new Set();
    activeSectionCourses.forEach(sc => {
      sc.section.registrations.forEach(reg => {
        studentIds.add(reg.studentId);
      });
    });
    const totalStudents = studentIds.size;
    const mySections = activeSectionCourses.map(sc => ({
      id: sc.id,courseCode: sc.course.code,courseTitle: sc.course.title,sectionCode: sc.section.sectionCode,enrolledCount: sc.section.registrations.length,capacity: sc.section.capacity
    }));
    const today = new Date().toLocaleDateString('en-US',{ weekday: 'long' });
    const upcomingClasses = [];

    activeSectionCourses.forEach(sc => {
      sc.schedules.forEach(sched => {
        if (sched.dayOfWeek.toLowerCase() === today.toLowerCase()) {
          upcomingClasses.push({
            id: sched.id,courseCode: sc.course.code,courseTitle: sc.course.title,sectionCode: sc.section.sectionCode,startTime: sched.startTime,endTime: sched.endTime,room: sched.room?.roomCode || "TBA",enrolledCount: sc.section.registrations.length
          });
        }
      });
    });
    upcomingClasses.sort((a,b) => new Date(a.startTime) - new Date(b.startTime));

    console.log("Upcoming classes today:",upcomingClasses.length);
    const recentActivity = notifications.map(notif => ({
      id: notif.id,message:notif.message,createdAt: notif.createdAt,read: notif.read
    }));
    const topSections = [...mySections]
      .sort((a,b) => b.enrolledCount - a.enrolledCount)
      .slice(0,5);

    const responseData = {
      success:true,data:{
        totalSections,totalStudents,upcomingClasses,mySections,topSections,recentActivity
      }
    };

    console.log("Response data:",JSON.stringify(responseData,null,2));
    console.log("=== END DEBUG ===");

    res.json(responseData);

  } catch (error) {
    console.error("Error fetching faculty dashboard stats:",error);
    res.status(500).json({ error:"Failed to fetch dashboard stats" });
  }
}

module.exports=getDashboardStats;
