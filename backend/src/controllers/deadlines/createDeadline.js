// const prisma = require("../../prisma");

// const createDeadline = async (req, res) => {
//     try {
//         const { courseId, registrationOpen, registrationClose, addDropStart, addDropEnd, waitlistClose } = req.body;
//         const deadline = await prisma.deadline.create({
//             data: { courseId: parseInt(courseId), registrationOpen: new Date(registrationOpen), registrationClose: new Date(registrationClose), addDropStart: new Date(addDropStart), addDropEnd: new Date(addDropEnd), waitlistClose: new Date(waitlistClose) }, include: { course: true }
//         });
//         res.status(201).json({ success: true, message: "Deadline created successfully", data: deadline });
//     } catch (error) {
//         console.error("createDeadline Error:", error);
//         res.status(500).json({ success: false, error: "Failed to create deadline", details: error.message });
//     }
// }

// module.exports = createDeadline;
