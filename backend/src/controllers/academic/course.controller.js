const prisma = require("../../prisma");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { code, title, creditHours, description, termId } = req.body;

    if (!termId) {
      return res.status(400).json({
        success: false,
        error: "Term ID is required",
      });
    }

    const course = await prisma.course.create({
      data: {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        creditHours: parseInt(creditHours),
        description: description ? description.trim() : null,
        termId: parseInt(termId),
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("createCourse Error:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: "Course with this code already exists"
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create course",
      details: error.message
    });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        code: 'asc',
      },
      include: {
        term: {
          select: {
            id: true,
            year: true,
            semester: true,
          },
        },
        sectionCourses: {
          include: {
            section: true,
            faculty: {
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

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("getAllCourses Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch courses",
      details: error.message
    });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        sectionCourses: {
          include: {
            section: true,
            faculty: {
              select: {
                id: true,
                full_name: true,
                email: true,
              },
            },
            schedules: {
              include: {
                room: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("getCourseById Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch course",
      details: error.message
    });
  }
};

// Update course by ID
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, title, creditHours, description, termId } = req.body;

    const updateData = {};
    if (code !== undefined) updateData.code = code.trim().toUpperCase();
    if (title !== undefined) updateData.title = title.trim();
    if (creditHours !== undefined) updateData.creditHours = parseInt(creditHours);
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (termId !== undefined) updateData.termId = parseInt(termId);

    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("updateCourse Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: "Course with this code already exists",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update course",
      details: error.message
    });
  }
};

// Delete course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course has sections (via SectionCourse)
    const sectionCourses = await prisma.sectionCourse.findFirst({
      where: { courseId: parseInt(id) },
    });

    if (sectionCourses) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete course: Sections are associated with this course. Please remove course from sections first.",
      });
    }

    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("deleteCourse Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete course",
      details: error.message
    });
  }
};
