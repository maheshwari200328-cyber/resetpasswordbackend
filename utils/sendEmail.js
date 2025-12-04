const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
  try {
    await resend.emails.send({
      from: "Password Reset <onboarding@resend.dev>",
      to,
      subject,
      html
    });
  } catch (error) {
    console.log("Email Error:", error);
  }
}

module.exports = sendEmail;
