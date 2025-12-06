const prisma = require("../../prisma");

const getRoomById=async (req,res) => {
  try {
    const {id}= req.params;
    const room = await prisma.room.findUnique({
      where: { id: parseInt(id) },include: {
        schedules: {
          include: {
            sectionCourse: {
              include: {
                section: {
                  include: {
                    term:true,},},course:true,faculty: {
                  select: {
                    id:true,full_name:true,email:true,},},},},},},},});

    if (!room) {
      return res.status(404).json({
        success:false,error:"Room not found",});
    }

    res.status(200).json({
      success:true,data:room,});
  } catch (error) {
    console.error("getRoomById Error:",error);
    res.status(500).json({
      success:false,error:"Failed to fetch room",details:error.message
    });
  }
}

module.exports=getRoomById;
