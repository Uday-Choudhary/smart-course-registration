const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new section
exports.createSection = async (req, res) => {
  try {
    const { sectionCode, capacity, courseId, termId, facultyId } = req.body;

    // Verify that course and term exist
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    const term = await prisma.term.findUnique({
      where: { id: parseInt(termId) },
    });

    if (!term) {
      return res.status(404).json({
        success: false,
        error: "Term not found",
      });
    }

    // If facultyId is provided, verify faculty exists
    if (facultyId) {
      const facultyRole = await prisma.role.findUnique({
        where: { name: "Faculty" },
      });
      if (!facultyRole) {
        return res.status(500).json({
          success: false,
          error: "Faculty role not found. Please check your database seed.",
        });
      }
      const faculty = await prisma.user.findFirst({
        where: { id: facultyId, roleId: facultyRole.id },
      });

      if (!faculty) {
        return res.status(404).json({
          success: false,
          error: "Faculty not found",
        });
      }
    }

    const section = await prisma.section.create({
      data: {
        sectionCode: sectionCode.trim(),
        capacity: parseInt(capacity),
        courseId: parseInt(courseId),
        termId: parseInt(termId),
        facultyId: facultyId || null,
      },
      include: {
        course: true,
        term: true,
        faculty: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  } catch (error) {
    console.error("createSection Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create section",
      details: error.message
    });
  }
};

// Get all sections
exports.getAllSections = async (req, res) => {
  try {
    const sections = await prisma.section.findMany({
      orderBy: [
        { termId: 'desc' },
        { courseId: 'asc' },
        { sectionCode: 'asc' },
      ],
      include: {
        course: true,
        term: true,
        faculty: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        schedule: {
          include: {
            room: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections,
    });
  } catch (error) {
    console.error("getAllSections Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch sections",
      details: error.message
    });
  }
};

// Get section by ID
exports.getSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await prisma.section.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: true,
        term: true,
        faculty: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        schedule: {
          include: {
            room: true,
          },
        },
        registrations: {
          include: {
            student: {
              select: {
                id: true,
                full_name: true,
                email: true,
              },
            },
          },
        },
        waitlists: {
          include: {
            student: {
              select: {
                id: true,
                full_name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        error: "Section not found",
      });
    }

    res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("getSectionById Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch section",
      details: error.message
    });
  }
};

// Update section by ID
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionCode, capacity, courseId, termId, facultyId } = req.body;

    // Check if section exists
    const existingSection = await prisma.section.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSection) {
      return res.status(404).json({
        success: false,
        error: "Section not found",
      });
    }

    const updateData = {};
    if (sectionCode !== undefined) updateData.sectionCode = sectionCode.trim();
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (courseId !== undefined) {
      const course = await prisma.course.findUnique({
        where: { id: parseInt(courseId) },
      });
      if (!course) {
        return res.status(404).json({
          success: false,
          error: "Course not found",
        });
      }
      updateData.courseId = parseInt(courseId);
    }
    if (termId !== undefined) {
      const term = await prisma.term.findUnique({
        where: { id: parseInt(termId) },
      });
      if (!term) {
        return res.status(404).json({
          success: false,
          error: "Term not found",
        });
      }
      updateData.termId = parseInt(termId);
    }
    if (facultyId !== undefined) {
      if (facultyId === null || facultyId === '') {
        updateData.facultyId = null;
      } else {
        console.log("facultyId:", facultyId); // Logging facultyId
        const facultyRole = await prisma.role.findUnique({
          where: { name: "Faculty" },
        });
        console.log("facultyRole:", facultyRole); // Logging facultyRole
        if (!facultyRole) {
          return res.status(500).json({
            success: false,
            error: "Faculty role not found. Please check your database seed.",
          });
        }
        const faculty = await prisma.user.findFirst({
          where: { id: facultyId, roleId: facultyRole.id },
        });
        if (!faculty) {
          return res.status(404).json({
            success: false,
            error: "Faculty not found",
          });
        }
        updateData.facultyId = facultyId;
      }
    }

    const section = await prisma.section.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        course: true,
        term: true,
        faculty: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("updateSection Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Section not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update section",
      details: error.message
    });
  }
};

// Delete section by ID
exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if section has registrations or waitlists
    const registrations = await prisma.registration.findFirst({
      where: { sectionId: parseInt(id) },
    });

    const waitlists = await prisma.waitlist.findFirst({
      where: { sectionId: parseInt(id) },
    });

    if (registrations || waitlists) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete section: Registrations or waitlists are associated with this section. Please remove them first.",
      });
    }

    // Delete associated schedules first
    await prisma.sectionSchedule.deleteMany({
      where: { sectionId: parseInt(id) },
    });

    await prisma.section.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("deleteSection Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Section not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete section",
      details: error.message
    });
  }
};
