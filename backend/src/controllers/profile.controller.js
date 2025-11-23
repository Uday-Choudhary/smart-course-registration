const prisma = require("../prisma");

/**
 * GET /api/profile
 * Return the authenticated user's full profile
 */
exports.getProfile = async (req, res) => {
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
};


/**
 * PUT /api/profile
 * Update authenticated user's profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      sex,
      address,
      birthday,
      bloodType,
      subjects,
    } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        full_name: name,
        phone,
        sex,
        address,
        birthday,
        bloodType,
        subjects: subjects ? JSON.stringify(subjects) : null,
      },
      include: { role: true },
    });

    res.json({
      message: "Profile updated",
      user: {
        id: updated.id,
        name: updated.full_name,
        email: updated.email,
        role: updated.role.name,

        phone: updated.phone || "",
        sex: updated.sex || "",
        address: updated.address || "",
        birthday: updated.birthday || "",
        bloodType: updated.bloodType || "",
        subjects: updated.subjects ? JSON.parse(updated.subjects) : [],
      },
    });
  } catch (err) {
    console.error("update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
