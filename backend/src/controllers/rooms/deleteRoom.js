const prisma = require("../../prisma");

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const schedules = await prisma.sectionSchedule.findFirst({
      where: { roomId: parseInt(id) },
    });
    if (schedules) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete room: Schedules are associated with this room. Please delete schedules first.",
      });
    }
    await prisma.room.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("deleteRoom Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Room not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete room",
      details: error.message
    });
  }
}

module.exports = deleteRoom;
