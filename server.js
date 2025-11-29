const express = require('express')
const cors=require('cors')
const mongoose=require('mongoose')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
// app.get('/test',(req,res)=>{
//     res.send('api working')
// });
app.get("/", (req, res) => {
  res.send("Backend is working!");
});
app.use('/api', require('./route/userRoutes'));

// app.post('/api/resetpassword/test',(req,res)=>{
//     res.json({message:"Routes Works"})
// })
mongoose.connect(process.env.URL)
.then(()=>console.log("Mongodb connected"))
.catch((err)=>console.log(err))
//app.use('/api',require('./route/userRoutes'))

const PORT=process.env.PORT||5000
app.listen(PORT,()=>console.log('server running on the port 5000'));