//const express = require('express')
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
//const nodemailer = require('nodemailer')
const sendEmail = require("../utils/sendEmail");




exports.register = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.trim() === "") {
            return res.status(400).json({ message: "Password is required" });
        }

        const hashed = await bcrypt.hash(password.trim(), 10);
        const user = new User({ ...req.body, password: hashed });

        await user.save();
        res.json({ message: 'Register Successfully!' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ err: error.message });
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
    
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET
);
   return  res.status(200).json({ message: "Login Successfully", token })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:"somthing went wrong"})
    }

    

}



// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot route hit", email);

    const user = await User.findOne({ email: email.trim() });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Reset link
    const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${token}`;

    // Send email using Resend
    await sendEmail(
      user.email,
      "Password Reset",
      `<p>Hi ${user.name || "User"},</p>
       <p>You requested to reset your password. Click the link below:</p>
       <a href="${resetUrl}" target="_blank">${resetUrl}</a>
       <p>This link will expire in 10 minutes.</p>
        <p>If you didn’t request this, ignore this email.</p>`
    );

    res.json({ message: "Password reset email sent!" });

  } catch (error) {
    console.error("ForgotPassword Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("ResetPassword Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
