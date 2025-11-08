const {PrismaClient}=require("@prisma/client");
const prisma=new PrismaClient();

// Create a new program
exports.createProgram=async (req, res) => {
  try {
    const {name,departmentId}=req.body;
    
    // Verify that department exists
    const department=await prisma.department.findUnique({
      where: { id: parseInt(departmentId) },
    });
    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    const program=await prisma.program.create({
      data: {
        name:name.trim(),
        departmentId:parseInt(departmentId),
      },
      include:{
        department:true,
      },
    });
    res.status(201).json({
      success:true,
      message:"Program created successfully",
      data:program,
    });
  } catch (error) {
    console.error("createProgram Error:",error);
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        success: false,
        error:"Program with this name already exists" 
      });
    }
    res.status(500).json({ 
      success:false,
      error:"Failed to create program",
      details:error.message 
    });
  }
};

// Get all programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs=await prisma.program.findMany({
      orderBy:[
        {departmentId:'asc' },
        {name:'asc' },
      ],
      include:{
        department:true,
      },
    });
    res.status(200).json({
      success:true,
      count:programs.length,
      data:programs,
    });
  } catch (error) {
    console.error("getAllPrograms Error:", error);
    res.status(500).json({ 
      success:false,
      error:"Failed to fetch programs",
      details:error.message 
    });
  }
};

// Get program by ID
exports.getProgramById = async (req, res) => {
  try {
    const {id}=req.params;
    const program=await prisma.program.findUnique({
      where:{ id: parseInt(id) },
      include:{
        department:true,
      },
    });
    if (!program) {
      return res.status(404).json({
        success:false,
        error:"Program not found",
      });
    }
    res.status(200).json({
      success:true,
      data:program,
    });
  } catch (error) {
    console.error("getProgramById Error:", error);
    res.status(500).json({ 
      success:false,
      error:"Failed to fetch program",
      details:error.message 
    });
  }
};

// Update program by ID
exports.updateProgram =async(req,res)=>{
  try{
    const {id}=req.params;
    const {name,departmentId}=req.body;
    const updateData={};
    if (name!==undefined) updateData.name=name.trim();
    if (departmentId!==undefined) {
      const department=await prisma.department.findUnique({
        where: { id: parseInt(departmentId) },
      });
      if (!department) {
        return res.status(404).json({
          success: false,
          error: "Department not found",
        });
      }
      updateData.departmentId=parseInt(departmentId);
    }

    const program=await prisma.program.update({
      where:{id:parseInt(id)},
      data:updateData,
      include:{
        department:true,
      },
    });
    res.status(200).json({
      success:true,
      message:"Program updated successfully",
      data:program,
    });
  } catch (error) {
    console.error("updateProgram Error:", error);
    if (error.code==='P2025') {
      return res.status(404).json({
        success:false,
        error:"Program not found",
      });
    }
    if (error.code==='P2002') {
      return res.status(409).json({
        success:false,
        error:"Program with this name already exists",
      });
    }
    res.status(500).json({ 
      success:false,
      error:"Failed to update program",
      details:error.message 
    });
  }
};

// Delete program by ID
exports.deleteProgram =async(req,res)=>{
  try {
    const {id}=req.params;
    await prisma.program.delete({
      where:{id:parseInt(id)},
    });
    res.status(200).json({
      success:true,
      message:"Program deleted successfully",
    });
  } catch (error) {
    console.error("deleteProgram Error:", error);
    if (error.code==='P2025') {
      return res.status(404).json({
        success:false,
        error:"Program not found",
      });
    }
    res.status(500).json({ 
      success:false,
      error:"Failed to delete program",
      details:error.message 
    });
  }
};
