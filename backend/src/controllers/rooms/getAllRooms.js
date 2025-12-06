const prisma = require("../../prisma");

const getAllRooms=async (req,res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        roomCode: 'asc',},include: {
        schedules: {
          include: {
            sectionCourse: {
              include: {
                section: {
                  include: {
                    term:true,},},course:true,faculty:true,},},},},},});
    res.status(200).json({
      success:true,count:rooms.length,data:rooms,});
  } catch (error) {
    console.error("getAllRooms Error:",error);
    res.status(500).json({
      success:false,error:"Failed to fetch rooms",details:error.message
    });
  }
}

module.exports=getAllRooms;
