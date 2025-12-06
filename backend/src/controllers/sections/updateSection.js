const prisma = require("../../prisma");

const updateSection=async (req,res) => {
    try {
        const {id}= req.params;
        const {sectionCode,capacity,termId}= req.body;

        const updateData = {};
        if (sectionCode !== undefined) updateData.sectionCode = sectionCode.trim();
        if (capacity !== undefined) updateData.capacity = parseInt(capacity);
        if (termId !== undefined) {
            const term = await prisma.term.findUnique({ where: { id: parseInt(termId) } });
            if (!term) return res.status(404).json({ success:false,error:"Term not found" });
            updateData.termId = parseInt(termId);
        }

        const section = await prisma.section.update({
            where: { id: parseInt(id) },data:updateData,include: {
                term:true,},});

        res.status(200).json({
            success:true,message:"Section updated successfully",data:section,});
    } catch (error) {
        console.error("updateSection Error:",error);
        if (error.code==='P2025') {
            return res.status(404).json({ success:false,error:"Section not found" });
        }
        res.status(500).json({
            success:false,error:"Failed to update section",details:error.message
        });
    }
};

module.exports=updateSection;
