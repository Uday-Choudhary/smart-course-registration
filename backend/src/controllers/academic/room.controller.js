const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createRoom = async (req, res) => {
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
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        roomCode: 'asc',
      },
      include: {
        schedules: {
          include: {
            sectionCourse: {
              include: {
                section: {
                  include: {
                    term: true,
                  },
                },
                course: true,
                faculty: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error("getAllRooms Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch rooms",
      details: error.message
    });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id: parseInt(id) },
      include: {
        schedules: {
          include: {
            sectionCourse: {
              include: {
                section: {
                  include: {
                    term: true,
                  },
                },
                course: true,
                faculty: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("getRoomById Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch room",
      details: error.message
    });
  }
};

// updateID
exports.updateRoom = async (req, res) => {
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
};

exports.deleteRoom = async (req, res) => {
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
};

