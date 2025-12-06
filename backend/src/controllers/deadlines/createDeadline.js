const prisma = require("../../prisma");

const createDeadline = async (req, res) => {
//     try {
//         const { courseId, registrationOpen, addDropStart, addDropEnd, registrationClose, waitlistClose } = req.body;

//         // Check if deadline already exists for this course
//         const existingDeadline = await prisma.deadline.findUnique({
//             where: {
//                 courseId: parseInt(courseId)
//             }
//         });

//         if (existingDeadline) {
//             return res.status(400).json({ error: "Deadlines already exist for this course. Please edit the existing one." });
//         }

//         const newDeadline = await prisma.deadline.create({
//             data: {
//                 courseId: parseInt(courseId),
//                 registrationOpen: new Date(registrationOpen),
//                 addDropStart: new Date(addDropStart),
//                 addDropEnd: new Date(addDropEnd),
//                 registrationClose: new Date(registrationClose),
//                 waitlistClose: new Date(waitlistClose)
//             },
//             include: {
//                 course: {
//                     include: {
//                         term: true
//                     }
//                 }
//             }
//         });
//         res.status(201).json(newDeadline);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

module.exports = createDeadline;
