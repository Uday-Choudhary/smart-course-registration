const prisma = require("../../prisma");

const updateStudent=async (req,res) => {
  try {
    const {id}= req.params;
    const {full_name,email,phone,sex,address,birthday,bloodType}= req.body;

    if (email && !validateEmail(email)) {
      return res.status(400).json({ error:"Invalid email format" });
    }

    const updatedStudent = await prisma.user.update({
      where: { id },data:{
        full_name,email,phone,sex,address,birthday,bloodType,},select: {
        id:true,full_name:true,email:true,phone:true,sex:true,address:true,birthday:true,bloodType:true,},});

    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:",error);
    res.status(500).json({ error:"Failed to update student" });
  }
}

module.exports=updateStudent;
