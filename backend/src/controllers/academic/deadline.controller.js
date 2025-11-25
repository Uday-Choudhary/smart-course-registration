const prisma = require("../../prisma");

// Get all deadlines
const getAllDeadlines = async (req, res) => {
    try {
        const deadlines = await prisma.deadline.findMany({
            include: {
                course: {
                    include: {
                        term: true
                    }
                }
            },
            orderBy: {
                registrationClose: 'asc'
            }
        });
        res.json(deadlines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new deadline
const createDeadline = async (req, res) => {
    try {
        const { courseId, registrationOpen, addDropStart, addDropEnd, registrationClose, waitlistClose } = req.body;

        // Check if deadline already exists for this course
        const existingDeadline = await prisma.deadline.findUnique({
            where: {
                courseId: parseInt(courseId)
            }
        });

        if (existingDeadline) {
            return res.status(400).json({ error: "Deadlines already exist for this course. Please edit the existing one." });
        }

        const newDeadline = await prisma.deadline.create({
            data: {
                courseId: parseInt(courseId),
                registrationOpen: new Date(registrationOpen),
                addDropStart: new Date(addDropStart),
                addDropEnd: new Date(addDropEnd),
                registrationClose: new Date(registrationClose),
                waitlistClose: new Date(waitlistClose)
            },
            include: {
                course: {
                    include: {
                        term: true
                    }
                }
            }
        });
        res.status(201).json(newDeadline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a deadline
const updateDeadline = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseId, registrationOpen, addDropStart, addDropEnd, registrationClose, waitlistClose } = req.body;

        const updatedDeadline = await prisma.deadline.update({
            where: { id: parseInt(id) },
            data: {
                courseId: parseInt(courseId),
                registrationOpen: new Date(registrationOpen),
                addDropStart: new Date(addDropStart),
                addDropEnd: new Date(addDropEnd),
                registrationClose: new Date(registrationClose),
                waitlistClose: new Date(waitlistClose)
            },
            include: {
                course: {
                    include: {
                        term: true
                    }
                }
            }
        });
        res.json(updatedDeadline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a deadline
const deleteDeadline = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.deadline.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllDeadlines,
    createDeadline,
    updateDeadline,
    deleteDeadline
};
