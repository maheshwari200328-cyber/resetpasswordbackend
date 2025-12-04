const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password: { type: String, required: true },
    resetToken:String,
    tokenExpiry:Date
})
module.exports=mongoose.model('Users',userSchema)                               