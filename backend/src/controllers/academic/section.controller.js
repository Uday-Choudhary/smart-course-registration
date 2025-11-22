const prisma = require("../../prisma");

// Create a new section (Batch)
exports.createSection = async (req, res) => {
  try {
    const { sectionCode, capacity, termId } = req.body;

    const term = await prisma.term.findUnique({
      where: { id: parseInt(termId) },
    });

    if (!term) {
      return res.status(404).json({
        success: false,
        error: "Term not found",
      });
    }

    const section = await prisma.section.create({
      data: {
        sectionCode: sectionCode.trim(),
        capacity: parseInt(capacity),
        termId: parseInt(termId),
      },
      include: {
        term: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Section (Batch) created successfully",
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

// Add a course to a section
exports.addCourseToSection = async (req, res) => {
  try {
    const { sectionId, courseId, facultyId } = req.body;

    const section = await prisma.section.findUnique({
      where: { id: parseInt(sectionId) },
    });

    if (!section) {
      return res.status(404).json({ success: false, error: "Section not found" });
    }

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    let faculty = null;
    if (facultyId) {
      const facultyRole = await prisma.role.findUnique({ where: { name: "Faculty" } });
      faculty = await prisma.user.findFirst({
        where: { id: facultyId, roleId: facultyRole.id },
      });
      if (!faculty) {
        return res.status(404).json({ success: false, error: "Faculty not found" });
      }
    }

    const sectionCourse = await prisma.sectionCourse.create({
      data: {
        sectionId: parseInt(sectionId),
        courseId: parseInt(courseId),
        facultyId: facultyId || null,
      },
      include: {
        course: true,
        faculty: {
          select: { id: true, full_name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Course added to section successfully",
      data: sectionCourse,
    });

  } catch (error) {
    console.error("addCourseToSection Error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, error: "Course already added to this section" });
    }
    res.status(500).json({
      success: false,
      error: "Failed to add course to section",
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
        { sectionCode: 'asc' },
      ],
      include: {
        term: true,
        sectionCourses: {
          include: {
            course: true,
            faculty: {
              select: { id: true, full_name: true, email: true },
            },
            schedules: {
              include: { room: true }
            }
          }
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
        term: true,
        sectionCourses: {
          include: {
            course: true,
            faculty: {
              select: { id: true, full_name: true, email: true },
            },
            schedules: {
              include: { room: true }
            }
          }
        },
        registrations: {
          include: {
            student: {
              select: { id: true, full_name: true, email: true },
            },
          },
        },
        waitlists: {
          include: {
            student: {
              select: { id: true, full_name: true, email: true },
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
    const { sectionCode, capacity, termId } = req.body;

    const updateData = {};
    if (sectionCode !== undefined) updateData.sectionCode = sectionCode.trim();
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (termId !== undefined) {
      const term = await prisma.term.findUnique({ where: { id: parseInt(termId) } });
      if (!term) return res.status(404).json({ success: false, error: "Term not found" });
      updateData.termId = parseInt(termId);
    }

    const section = await prisma.section.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        term: true,
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
      return res.status(404).json({ success: false, error: "Section not found" });
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

    if (registrations) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete section: Registrations are associated with this section.",
      });
    }

    // Delete associated SectionCourses and Schedules first
    // Note: Prisma cascade delete might handle this if configured, but let's be safe or rely on schema.
    // Since we didn't set Cascade in schema explicitly for relations, we might need to delete children manually or rely on DB constraints.
    // For now, let's assume we need to delete children.

    const sectionCourses = await prisma.sectionCourse.findMany({ where: { sectionId: parseInt(id) } });
    for (const sc of sectionCourses) {
      await prisma.sectionSchedule.deleteMany({ where: { sectionCourseId: sc.id } });
    }
    await prisma.sectionCourse.deleteMany({ where: { sectionId: parseInt(id) } });

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
      return res.status(404).json({ success: false, error: "Section not found" });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete section",
      details: error.message
    });
  }
};
