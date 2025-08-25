const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NodeMailerUser,
    pass: process.env.NodeMailerPass,
  },
});

exports.verifyOtp = async (name, email, randomOtp) => {
  const emailTemplate = {
    from: `"Packzo" <${process.env.NodeMailerUser}>`, // ✅ FIXED
    to: email,
    subject: "Email Verification OTP - Packzo",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #16253D; padding: 30px; border-radius: 10px;">
          <h1 style="color: #FF4500; margin: 0; padding-bottom: 20px;">Packzo</h1>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <h2 style="color: #16253D; margin-top: 0;">Verify Your Email</h2>
            <p style="color: #333333;">Hello ${name},</p>
            <p style="color: #333333;">Your OTP is:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #16253D;">${randomOtp}</span>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(emailTemplate);
    console.log(`✅ Email sent successfully. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw new Error("Failed to send OTP email");
  }
};
