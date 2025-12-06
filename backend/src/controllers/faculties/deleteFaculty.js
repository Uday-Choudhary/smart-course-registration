const prisma = require("../../prisma");

const deleteFaculty=async (req,res) => {
  try {
    const {id}= req.params;

    await prisma.user.delete({
      where: { id },});

    res.json({ message:"Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:",error);
    res.status(500).json({ error:"Failed to delete faculty" });
  }
}

module.exports=deleteFaculty;
