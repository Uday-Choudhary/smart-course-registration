const prisma = require("../../prisma");

const getAllPrograms=async (req,res) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: [
        { departmentId: 'asc' },{ name: 'asc' },],include: {
        department:true,},});
    res.status(200).json({
      success:true,count:programs.length,data:programs,});
  } catch (error) {
    console.error("getAllPrograms Error:",error);
    res.status(500).json({
      success:false,error:"Failed to fetch programs",details:error.message
    });
  }
}

module.exports=getAllPrograms;
