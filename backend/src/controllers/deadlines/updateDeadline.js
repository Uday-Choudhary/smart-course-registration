const prisma = require("../../prisma");

const updateDeadline = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { courseId, registrationOpen, addDropStart, addDropEnd, registrationClose, waitlistClose } = req.body;

//         const updatedDeadline = await prisma.deadline.update({
//             where: { id: parseInt(id) },
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
//         res.json(updatedDeadline);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

module.exports = updateDeadline;
