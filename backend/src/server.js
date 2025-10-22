const express=require('express')
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app=express()

app.use(cors());
app.use(helmet());
app.use(express.json())

app.get('/',(req,res)=>{
    res.status.apply(200).json({mes:"api is running"})
})
// test route to check roles
app.get("/roles", async (req, res) => {
  const roles = await prisma.role.findMany();
  res.json(roles);
});

const PORT=process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`backend running on port ${PORT}`))
