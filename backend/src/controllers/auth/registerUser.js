const prisma = require("../../prisma");

const registerUser=async (req,res) => {
  try {
    const {name,email,password,role}= req.body;

    const missingField = validateRequiredFields({ name,email,password,role });
    if (missingField) {
      return res.status(400).json({ error:"all fields are required" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error:"Need a special character,a number and a minimum of 8 characters" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error:"email format is wrong" });
    }
    const validRoles = ["Student","Faculty","Admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error:"invalid role" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error:"user already exists" });
    }

    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).json({ error:"role not found in db" });
    }

    const hashedPass = await bcrypt.hash(password,10);

    const newUser = await prisma.user.create({
      data:{
        full_name: name,email,password: hashedPass,roleId: roleRecord.id
      },include: {
        role:true
      }
    });

    return res.status(201).json({
      message:"user created",user: {
        id: newUser.id,name: newUser.full_name,email: newUser.email,role: newUser.role.name
      },});
  } catch (err) {
    console.error("register error:",err);
    return res.status(500).json({ error:"something went wrong" });
  }
}

module.exports=registerUser;
