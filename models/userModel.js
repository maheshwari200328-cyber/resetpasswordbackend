const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    resetToken:String,
    tokenExpiry:Date
})
module.exports=mongoose.model('Users',userSchema)                               