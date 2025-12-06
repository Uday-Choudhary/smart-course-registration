const prisma = require("../../prisma");

const deleteDeadline = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await prisma.deadline.delete({
//             where: { id: parseInt(id) }
//         });
//         res.status(204).send();
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

module.exports = deleteDeadline;
