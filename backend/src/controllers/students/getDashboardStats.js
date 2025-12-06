const prisma = require("../../prisma");

const getDashboardStats=async (req,res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error:"not authenticated" });

    console.log("=== DASHBOARD STATS DEBUG ===");
    console.log("User ID:",userId);
    const registrations = await prisma.registration.findMany({
      where: { studentId: userId },include: {
        section: {
          include: {
            term:true,sectionCourses: {
              include: {
                course:true,schedules: {
                  include: { room:true }
                }
              }
            }
          }
        }
      }
    });

    console.log("Total registrations found:",registrations.length);
    console.log("Registrations:",registrations.map(r => ({
      id: r.id,termId: r.section.termId,term: `${r.section.term.year} ${r.section.term.semester}`,course: r.section.sectionCourses[0]?.course.code
    })));
    const notifications = await prisma.notification.findMany({
      where: { userId },take: 5,orderBy: { createdAt: 'desc' }
    });
    let activeTermId = null;

    if (registrations.length > 0) {
      const latestReg = registrations.reduce((prev,current) => {
        return (prev.section.termId > current.section.termId) ? prev : current;
      });
      activeTermId = latestReg.section.termId;
      console.log("Active term ID (from registrations):",activeTermId);
    } else {
      const systemLatestTerm = await prisma.term.findFirst({
        orderBy: { id: 'desc' }
      });
      activeTermId = systemLatestTerm?.id;
      console.log("Active term ID (from system):",activeTermId);
    }
    const creditsEarned = registrations.reduce((sum,reg) => {
      const courseCredits = reg.section.sectionCourses[0]?.course.creditHours || 0;
      return sum + courseCredits;
    },0);

    console.log("Credits earned:",creditsEarned);
    const activeRegistrations = activeTermId
      ? registrations.filter(reg => reg.section.termId === activeTermId)
      : [];

    console.log("Active registrations count:",activeRegistrations.length);
    console.log("Active registrations:",activeRegistrations.map(r => ({
      course: r.section.sectionCourses[0]?.course.code,termId: r.section.termId
    })));
    const enrolledCoursesCount = registrations.length;
    const today = new Date().toLocaleDateString('en-US',{ weekday: 'long' }); // e.g.,"Monday"
    const upcomingClasses = [];

    console.log("Today is:",today);

    activeRegistrations.forEach(reg => {
      const section = reg.section;
      section.sectionCourses.forEach(sc => {
        sc.schedules.forEach(sched => {
          console.log(`Schedule: ${sched.dayOfWeek} vs ${today}`);
          if (sched.dayOfWeek.toLowerCase() === today.toLowerCase()) {
            upcomingClasses.push({
              id: sched.id,courseCode: sc.course.code,courseTitle: sc.course.title,startTime: sched.startTime,endTime: sched.endTime,room: sched.room?.roomCode || "TBA"
            });
          }
        });
      });
    });

    console.log("Upcoming classes:",upcomingClasses.length);
    upcomingClasses.sort((a,b) => new Date(a.startTime) - new Date(b.startTime));
    const recentActivity = notifications.map(notif => ({
      id: notif.id,message:notif.message,createdAt: notif.createdAt,read: notif.read
    }));

    const responseData = {
      success:true,data:{
        gpa: "N/A",// Placeholder as grades aren't implemented
        creditsEarned,enrolledCourses: enrolledCoursesCount,upcomingClasses,recentActivity
      }
    };

    console.log("Response data:",JSON.stringify(responseData,null,2));
    console.log("=== END DEBUG ===");

    res.json(responseData);

  } catch (error) {
    console.error("Error fetching dashboard stats:",error);
    res.status(500).json({ error:"Failed to fetch dashboard stats" });
  }
}

module.exports=getDashboardStats;
