const nodemailer = require('nodemailer');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false   // FIX SSL error
  }
});


async function sendTest() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "maheshwari200328@gmail.com",
      subject: "Nodemailer Test Email",
      text: "This is a test email from Node! If you receive this, your SMTP is correct.",
    });

    console.log("SUCCESS:", info);
  } catch (error) {
    console.log("ERROR:", error);
  }
}

sendTest();
