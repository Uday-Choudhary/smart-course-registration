const prisma = require("../../prisma");
const bcrypt = require("bcryptjs");

// getting all faculyt
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await prisma.user.findMany({
      where: { role: { name: "Faculty" } },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        subjects: true,
        sectionCoursesTaught: {
          select: {
            id: true,
            section: {
              select: {
                sectionCode: true,
                term: {
                  select: {
                    year: true,
                    semester: true,
                  },
                },
              },
            },
            course: {
              select: {
                code: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Parse subjects from JSON and format sections
    const formattedFaculty = faculty.map((f) => ({
      ...f,
      subjects: f.subjects ? (typeof f.subjects === 'string' ? JSON.parse(f.subjects) : f.subjects) : [],
      classes: f.sectionCoursesTaught.map((sc) =>
        `${sc.course.code} - ${sc.section.sectionCode} (${sc.section.term.semester} ${sc.section.term.year})`
      ),
    }));

    res.json(formattedFaculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ error: "Failed to fetch faculty data" });
  }
};

// creating new faculty admin adds
exports.createFaculty = async (req, res) => {
  try {
    const { full_name, email, phone, subjects, sex } = req.body;

    const role = await prisma.role.findUnique({
      where: { name: "Faculty" },
    });

    if (!role) return res.status(400).json({ error: "Faculty role not found" });

    const newFaculty = await prisma.user.create({
      data: {
        full_name,
        email,
        phone,
        sex,
        subjects: subjects ? JSON.stringify(subjects) : null, // store as JSON string
        roleId: role.id,
        password: await bcrypt.hash("default@123", 10), // temporary password hashed
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        subjects: true,
        sectionCoursesTaught: {
          select: {
            id: true,
            section: {
              select: {
                sectionCode: true,
                term: {
                  select: {
                    year: true,
                    semester: true,
                  },
                },
              },
            },
            course: {
              select: {
                code: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // formating the response to match getAllFaculty format 
    const formattedFaculty = {
      ...newFaculty,
      subjects: newFaculty.subjects ? (typeof newFaculty.subjects === 'string' ? JSON.parse(newFaculty.subjects) : newFaculty.subjects) : [],
      classes: newFaculty.sectionCoursesTaught.map((sc) =>
        `${sc.course.code} - ${sc.section.sectionCode} (${sc.section.term.semester} ${sc.section.term.year})`
      ),
    };

    res.status(201).json(formattedFaculty);
  } catch (error) {
    console.error("Error creating faculty:", error);
    res.status(500).json({ error: "Failed to create faculty" });
  }
};

// update facxulty 
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, subjects, email, sex } = req.body;

    const updatedFaculty = await prisma.user.update({
      where: { id },
      data: {
        full_name,
        email,
        phone,
        sex,
        subjects: subjects ? JSON.stringify(subjects) : null,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        subjects: true,
        sectionCoursesTaught: {
          select: {
            id: true,
            section: {
              select: {
                sectionCode: true,
                term: {
                  select: {
                    year: true,
                    semester: true,
                  },
                },
              },
            },
            course: {
              select: {
                code: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Format the response to match getAllFaculty format
    const formattedFaculty = {
      ...updatedFaculty,
      subjects: updatedFaculty.subjects ? (typeof updatedFaculty.subjects === 'string' ? JSON.parse(updatedFaculty.subjects) : updatedFaculty.subjects) : [],
      classes: updatedFaculty.sectionCoursesTaught.map((sc) =>
        `${sc.course.code} - ${sc.section.sectionCode} (${sc.section.term.semester} ${sc.section.term.year})`
      ),
    };

    res.json(formattedFaculty);
  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({ error: "Failed to update faculty" });
  }
};

//delete faculty 
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ error: "Failed to delete faculty" });
  }
};
