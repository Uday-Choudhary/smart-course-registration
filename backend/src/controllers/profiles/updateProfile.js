const prisma = require("../../prisma");

const updateProfile=async (req,res) => {
  try {
    const {name,phone,sex,address,birthday,bloodType,subjects,}= req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },data:{
        full_name: name,phone,sex,address,birthday,bloodType,subjects: subjects ? JSON.stringify(subjects) : null,},include: { role:true },});

    res.json({
      message:"Profile updated",user: {
        id: updated.id,name: updated.full_name,email: updated.email,role: updated.role.name,phone: updated.phone || "",sex: updated.sex || "",address: updated.address || "",birthday: updated.birthday || "",bloodType: updated.bloodType || "",subjects: updated.subjects ? JSON.parse(updated.subjects) : [],},});
  } catch (err) {
    console.error("update profile error:",err);
    res.status(500).json({ error:"Failed to update profile" });
  }
}

module.exports=updateProfile;
