const prisma = require("../../prisma");

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomCode } = req.body;
    const updateData = {};
    if (roomCode !== undefined) updateData.roomCode = roomCode.trim();
    const room = await prisma.room.update({
      where: {
        id: parseInt(id)
      },
      data: updateData,
    });
    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    console.error("updateRoom Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Room not found",
      });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: "Room with this code already exists",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update room",
      details: error.message
    });
  }
}

module.exports = updateRoom;
