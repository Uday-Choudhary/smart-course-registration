const prisma = require("../../prisma");

const getAllDeadlines = async (req, res) => {
//     try {
//         const deadlines = await prisma.deadline.findMany({
//             include: {
//                 course: {
//                     include: {
//                         term: true
//                     }
//                 }
//             },
//             orderBy: {
//                 registrationClose: 'asc'
//             }
//         });
//         res.json(deadlines);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

module.exports = getAllDeadlines;
