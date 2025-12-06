const prisma = require("../../prisma");

const getProgramById=async (req,res) => {
  try {
    const {id}= req.params;
    if (!validateId(id)) {
      return res.status(400).json({ success:false,error:"Invalid program ID" });
    }
    const program = await prisma.program.findUnique({
      where: { id: parseInt(id) },include: {
        department:true,},});
    if (!program) {
      return res.status(404).json({
        success:false,error:"Program not found",});
    }
    res.status(200).json({
      success:true,data:program,});
  } catch (error) {
    console.error("getProgramById Error:",error);
    res.status(500).json({
      success:false,error:"Failed to fetch program",details:error.message
    });
  }
}

module.exports=getProgramById;
