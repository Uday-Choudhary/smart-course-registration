const prisma = require("../../prisma");

const getDashboardStats=async (req,res) => {
    try {
        const lastRegistration = await prisma.registration.findFirst({
            orderBy: { createdAt: 'desc' },include: { section:true }
        });
        const lastWaitlist = await prisma.waitlist.findFirst({
            orderBy: { createdAt: 'desc' },include: { section:true }
        });

        let currentTermId = null;
        if (lastRegistration && lastWaitlist) {
            currentTermId = lastRegistration.createdAt > lastWaitlist.createdAt
                ? lastRegistration.section.termId
                : lastWaitlist.section.termId;
        } else if (lastRegistration) {
            currentTermId = lastRegistration.section.termId;
        } else if (lastWaitlist) {
            currentTermId = lastWaitlist.section.termId;
        }

        let currentTerm;
        if (currentTermId) {
            currentTerm = await prisma.term.findUnique({
                where: { id: currentTermId }
            });
        }
        if (!currentTerm) {
            currentTerm = await prisma.term.findFirst({
                orderBy: { id: 'desc' }
            });
        }

        if (!currentTerm) {
            return res.status(404).json({
                success:false,error:"No term found"
            });
        }
        const [
            totalStudents,totalFaculty,totalCourses,totalSections,totalRegistrations,totalWaitlists,recentRegistrations,recentPromotions,oversubscribedSections,upcomingDeadlines
        ] = await Promise.all([
            prisma.user.count({
                where: { role: { name: "Student" } }
            }),prisma.user.count({
                where: { role: { name: "Faculty" } }
            }),prisma.course.count({
                where: { termId: currentTerm.id }
            }),prisma.section.count({
                where: { termId: currentTerm.id }
            }),prisma.registration.count({
                where: { section: { termId: currentTerm.id } }
            }),prisma.waitlist.count({
                where: { section: { termId: currentTerm.id } }
            }),prisma.registration.findMany({
                where: { section: { termId: currentTerm.id } },take: 10,orderBy: { createdAt: 'desc' },include: {
                    student: {
                        select: { id:true,full_name:true,email:true }
                    },section: {
                        include: {
                            sectionCourses: {
                                include: {
                                    course: {
                                        select: { code:true,title:true }
                                    }
                                }
                            }
                        }
                    }
                }
            }),prisma.notification.findMany({
                where: {
                    message:{ contains: "enrolled" },message:{ contains: "waitlist" }
                },take: 5,orderBy: { createdAt: 'desc' },include: {
                    user: {
                        select: { id:true,full_name:true }
                    }
                }
            }),prisma.section.findMany({
                where: {
                    termId: currentTerm.id,waitlists: { some: {} }
                },include: {
                    sectionCourses: {
                        include: {
                            course: {
                                select: { code:true,title:true }
                            }
                        }
                    },_count:{
                        select: {
                            waitlists:true,registrations:true
                        }
                    }
                },orderBy: {
                    waitlists: {
                        _count:'desc'
                    }
                },take: 10
            }),prisma.deadline.findMany({
                where: {
                    course: { termId: currentTerm.id },OR: [
                        { registrationClose: { gte: new Date() } },{ addDropEnd: { gte: new Date() } },{ waitlistClose: { gte: new Date() } }
                    ]
                },include: {
                    course: {
                        select: { code:true,title:true }
                    }
                },take: 5
            })
        ]);
        const sectionsWithCapacity = await prisma.section.findMany({
            where: { termId: currentTerm.id },include: {
                _count:{
                    select: { registrations:true }
                }
            }
        });

        const totalCapacity = sectionsWithCapacity.reduce((sum,s) => sum + s.capacity,0);
        const totalEnrolled = sectionsWithCapacity.reduce((sum,s) => sum + s._count.registrations,0);
        const capacityUtilization = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : 0;
        const formattedRegistrations = recentRegistrations.map(reg => ({
            id: reg.id,studentName: reg.student.full_name,studentEmail: reg.student.email,courseCode: reg.section.sectionCourses[0]?.course.code || 'N/A',courseTitle: reg.section.sectionCourses[0]?.course.title || 'N/A',sectionCode: reg.section.sectionCode,registeredAt: reg.createdAt
        }));
        const formattedOversubscribed = oversubscribedSections.map(section => ({
            id: section.id,sectionCode: section.sectionCode,courseCode: section.sectionCourses[0]?.course.code || 'N/A',courseTitle: section.sectionCourses[0]?.course.title || 'N/A',capacity: section.capacity,enrolled: section._count.registrations,waitlisted: section._count.waitlists
        }));

        res.json({
            success:true,data:{
                currentTerm: {
                    id: currentTerm.id,year: currentTerm.year,semester: currentTerm.semester
                },stats: {
                    totalStudents,totalFaculty,totalCourses,totalSections,totalRegistrations,totalWaitlists,capacityUtilization: parseFloat(capacityUtilization)
                },recentRegistrations: formattedRegistrations,recentPromotions,oversubscribedSections: formattedOversubscribed,upcomingDeadlines
            }
        });

    } catch (error) {
        console.error("getDashboardStats Error:",error);
        res.status(500).json({
            success:false,error:"Failed to fetch dashboard statistics",details:error.message
        });
    }
}

module.exports=getDashboardStats;
