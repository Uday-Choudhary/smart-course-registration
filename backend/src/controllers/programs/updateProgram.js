const prisma = require("../../prisma");

const updateProgram=async (req,res) => {
  try {
    const {id}= req.params;
    if (!validateId(id)) {
      return res.status(400).json({ success:false,error:"Invalid program ID" });
    }
    const {name,departmentId}= req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (departmentId !== undefined) {
      if (!validateId(departmentId)) {
        return res.status(400).json({ success:false,error:"Invalid Department ID" });
      }
      const department = await prisma.department.findUnique({
        where: { id: parseInt(departmentId) },});
      if (!department) {
        return res.status(404).json({
          success:false,error:"Department not found",});
      }
      updateData.departmentId = parseInt(departmentId);
    }

    const program = await prisma.program.update({
      where: { id: parseInt(id) },data:updateData,include: {
        department:true,},});
    res.status(200).json({
      success:true,message:"Program updated successfully",data:program,});
  } catch (error) {
    console.error("updateProgram Error:",error);
    if (error.code==='P2025') {
      return res.status(404).json({
        success:false,error:"Program not found",});
    }
    if (error.code==='P2002') {
      return res.status(409).json({
        success:false,error:"Program with this name already exists",});
    }
    res.status(500).json({
      success:false,error:"Failed to update program",details:error.message
    });
  }
}

module.exports=updateProgram;
