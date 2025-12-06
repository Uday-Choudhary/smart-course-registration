const prisma = require("../../prisma");

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role.name,

        // Extra profile fields
        phone: user.phone || "",
        sex: user.sex || "",
        address: user.address || "",
        birthday: user.birthday || "",
        bloodType: user.bloodType || "",
        subjects: user.subjects ? JSON.parse(user.subjects) : [],
      },
    });
  } catch (err) {
    console.error("profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = getProfile;
