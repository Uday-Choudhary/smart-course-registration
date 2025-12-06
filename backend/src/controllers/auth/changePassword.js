const prisma = require("../../prisma");

// const changePassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     const userId = req.user.id; // from verifyToken middleware

//     if (!oldPassword || !newPassword) {
//       return res.status(400).json({ error: "Both old and new passwords are required" });
//     }

//     if (!validatePassword(newPassword)) {
//       return res.status(400).json({ error: "" });
//     }
      
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Incorrect old password" });
//     }

//     const hashedPass = await bcrypt.hash(newPassword, 10);
//     await prisma.user.update({
//       where: { id: userId },
//       data: { password: hashedPass },
//     });

//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Change password error:", error);
//     res.status(500).json({ error: "Failed to update password" });
//   }
// }

// module.exports = changePassword;
