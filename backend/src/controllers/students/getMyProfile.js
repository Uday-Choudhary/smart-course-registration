const prisma = require("../../prisma");

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "not authenticated" });

    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        sex: true,
        address: true,
        birthday: true,
        bloodType: true,
        role: { select: { name: true } },
      },
    });

    if (!me) return res.status(404).json({ error: "profile not found" });

    res.json(me);
  } catch (error) {
    console.error("Error fetching my profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

module.exports = getMyProfile;
