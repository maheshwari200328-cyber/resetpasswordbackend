const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
  try {
    const response = await resend.emails.send({
      from: "maheshwari200328@gmail.com", // VERIFIED in resend.com
      to: to,
      subject: subject,
      html: html,
    });

    console.log("EMAIL SENT:", response);
  } catch (error) {
    console.log("EMAIL ERROR:", error);
  }
}

module.exports = sendEmail;
