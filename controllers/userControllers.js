const express = require('express')
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer')




exports.register = async (req, res) => {
    try {
        const{password}=req.body;
        if(!password){
            return res.status(400).json({message:"password is requires"})
        }
        const hashed = await bcrypt.hash(password.trim(), 10);
        const user = new User({ ...req.body, password: hashed })

        await user.save();
        res.json({ message: 'Register Succussfully!' });
    }
    catch (error) {
        res.status(500).json({ err: error.message })

    }
}
exports.login = async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email })
    if (!user) 
        return res.status(404).json({ message: 'user not found' })
    console.log("Email:", req.body.email);
console.log("Password from request:", req.body.password);
console.log("Password from DB:", user ? user.password : "No user found");

    const valid = await bcrypt.compare(req.body.password.trim(), user.password)
    console.log("password valid:",valid)
    if (!valid) 
        return res.status(401).json({ message: 'Invalid Password' })
    
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT);
   return  res.status(200).json({ message: "Login Successfully", token })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:"somthing went wrong"})
    }

    

}
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        const token = crypto.randomBytes(8).toString("hex");
        user.resetToken = token
        user.tokenExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        //reset link
        const link = `${process.env.CLIENT_URL}/resetpassword/${token}`
        //send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls:{
                rejectUnauthorized:false
            }
        })
        //send link
        await transporter.sendMail({
            to: user.email,
            subject: "password Reset",
            html: `<p>Click here to reset your password:</p><a href="${link}">${link}</a>`
        })

   return      res.json({ message: "Reset Link send your email successfully! " })
    }
    catch (error) {
        console.error(error)
      return  res.status(500).json({ error: error.message })

    }
}

//reset password
exports.resetPassword=async(req,res)=>{
    try{
        const{token}=req.params;
        const{password}=req.body;
        if(!password){
                        return res.status(400).json({message:"Password is required"})
        }
        const user=await User.findOne({
            resetToken:token,
            tokenExpiry:{$gt:Date.now()}
        });
      
             if (!user) 
                return res.status(400).json({ message: 'invalid or expired token' })
        //update password
        const hashed=await bcrypt.hash(password,10);
        user.password=hashed;
        user.resetToken=undefined;
        user.tokenExpiry=undefined;
        await user.save();
        res.json({message:"Password updated Successfully!!!!"})
    }
    catch(error){
        console.error(error)
        res.status(500).json({error:"Somthing went Wrong"})
    }
}

