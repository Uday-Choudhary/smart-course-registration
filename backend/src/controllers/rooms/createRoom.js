const prisma = require("../../prisma");

const createRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;
    const room = await prisma.room.create({
      data: {
        roomCode: roomCode.trim(),
      },
    });
    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    console.error("createRoom Error:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: "Room with this code already exists"
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create room",
      details: error.message
    });
  }
}

module.exports = createRoom;
