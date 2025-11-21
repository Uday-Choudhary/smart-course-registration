const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// newterm 
exports.createTerm = async (req, res) => {
  try {
    const { year, semester } = req.body;
    const term = await prisma.term.create({
      data: {
        year: parseInt(year),
        semester: semester.trim(),
      },
    });
    res.status(201).json({
      success: true,
      message: "Term created successfully",
      data: term,
    });
  } catch (error) {
    console.error("createTerm Error:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: "Term with this year and semester combination may already exist"
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create term",
      details: error.message
    });
  }
};
//get allterms
exports.getAllTerms = async (req, res) => {
  try {
    const terms = await prisma.term.findMany({
      orderBy: [
        { year: 'desc' },
        { semester: 'asc' },
      ],
      include: {
        courses: {
          select: {
            id: true,
            code: true,
            title: true,
            creditHours: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      count: terms.length,
      data: terms,
    });
  } catch (error) {
    console.error("getAllTerms Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch terms",
      details: error.message
    });
  }
};

//get term byID
exports.getTermById = async (req, res) => {
  try {
    const { id } = req.params;
    const term = await prisma.term.findUnique({
      where: { id: parseInt(id) },
      include: {
        courses: {
          select: {
            id: true,
            code: true,
            title: true,
            creditHours: true,
          },
        },
        sections: {
          include: {
            sectionCourses: {
              include: {
                course: {
                  select: {
                    id: true,
                    code: true,
                    title: true,
                  },
                },
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
        },
      },
    });
    if (!term) {
      return res.status(404).json({
        success: false,
        error: "Term not found",
      });
    }
    res.status(200).json({
      success: true,
      data: term,
    });
  } catch (error) {
    console.error("getTermById Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch term",
      details: error.message
    });
  }
};

//update term byid 
exports.updateTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, semester } = req.body;
    const updateData = {};
    if (year !== undefined) updateData.year = parseInt(year);
    if (semester !== undefined) updateData.semester = semester.trim();

    const term = await prisma.term.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.status(200).json({
      success: true,
      message: "Term updated successfully",
      data: term,
    });
  } catch (error) {
    console.error("updateTerm Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Term not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update term",
      details: error.message
    });
  }
};

// delete term byID
exports.deleteTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const sections = await prisma.section.findFirst({
      where: { termId: parseInt(id) },
    });
    if (sections) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete term: Sections are associated with this term. Please delete sections first.",
      });
    }
    await prisma.term.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      success: true,
      message: "Term deleted successfully",
    });
  } catch (error) {
    console.error("deleteTerm Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Term not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete term",
      details: error.message
    });
  }
};

