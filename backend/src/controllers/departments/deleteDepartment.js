const prisma = require("../../prisma");

const deleteDepartment=async (req,res) => {
  try {
    const {id}= req.params;
    if (!validateId(id)) {
      return res.status(400).json({ success:false,error:"Invalid department ID" });
    }
    const programs = await prisma.program.findFirst({
      where: { departmentId: parseInt(id) },});
    if (programs) {
      return res.status(400).json({
        success:false,error:"Cannot delete department: Programs are associated with this department. Please delete programs first.",});
    }
    await prisma.department.delete({
      where: { id: parseInt(id) },});
    res.status(200).json({
      success:true,message:"Department deleted successfully",});
  } catch (error) {
    console.error("deleteDepartment Error:",error);
    if (error.code==='P2025') {
      return res.status(404).json({
        success:false,error:"Department not found",});
    }
    res.status(500).json({
      success:false,error:"Failed to delete department",details:error.message
    });
  }
}

module.exports=deleteDepartment;
