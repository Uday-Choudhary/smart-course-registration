const prisma = require("../../prisma");

const dropCourse = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const studentId = req.user?.id; // From auth middleware

    if (!studentId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 1. Verify the registration belongs to the student
    const registration = await prisma.registration.findUnique({
      where: { id: parseInt(registrationId) },
      include: {
        section: {
          include: {
            sectionCourses: {
              include: { course: true }
            }
          }
        }
      }
    });

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    if (registration.studentId !== studentId) {
      return res.status(403).json({ error: "Unauthorized to drop this course" });
    }

    // 2. Perform drop and waitlist promotion in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete the registration
      await tx.registration.delete({
        where: { id: parseInt(registrationId) }
      });

      // Find the next student on the waitlist (oldest entry = first in line)
      const nextInLine = await tx.waitlist.findFirst({
        where: { sectionId: registration.sectionId },
        orderBy: { createdAt: 'asc' },
        include: {
          student: {
            select: { full_name: true, email: true }
          }
        }
      });

      console.log(`[DropCourse] Dropped registration ${registrationId}. Checking waitlist for section ${registration.sectionId}...`);

      let promotedStudent = null;

      if (nextInLine) {
        console.log(`[DropCourse] Found waitlisted student: ${nextInLine.studentId} (${nextInLine.student.full_name})`);

        // Promote the waitlisted student to enrollment
        const newEnrollment = await tx.registration.create({
          data: {
            studentId: nextInLine.studentId,
            sectionId: nextInLine.sectionId
          }
        });
        console.log(`[DropCourse] Created registration for promoted student: ${newEnrollment.id}`);

        // Remove from waitlist
        await tx.waitlist.delete({
          where: { id: nextInLine.id }
        });
        console.log(`[DropCourse] Removed waitlist entry: ${nextInLine.id}`);

        // Create notification for promoted student
        const courseInfo = registration.section.sectionCourses[0]?.course;
        await tx.notification.create({
          data: {
            userId: nextInLine.studentId,
            message: `You've been enrolled in ${courseInfo?.code || 'course'} - ${registration.section.sectionCode} from the waitlist!`
          }
        });

        promotedStudent = {
          id: nextInLine.studentId,
          name: nextInLine.student.full_name,
          email: nextInLine.student.email
        };
      } else {
        console.log(`[DropCourse] No students on waitlist for section ${registration.sectionId}`);
      }

      return { promotedStudent };
    });

    res.json({
      success: true,
      message: "Course dropped successfully",
      promotedStudent: result.promotedStudent
    });

  } catch (error) {
    console.error("dropCourse Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = dropCourse;
