const prisma = require("../../prisma");

const deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.sectionSchedule.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = deleteSchedule;
