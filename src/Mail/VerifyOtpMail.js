const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Nodemailer transporter with debug
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NodeMailerUser,
        pass: process.env.NodeMailerPass, // Gmail App Password
    },
    logger: true,
    debug: true,
});

// ✅ Send OTP function with retry
const verifyOtp = async (name, email, randomOtp) => {
    const emailTemplate = {
        from: `"Packzo" <${process.env.NodeMailerUser}>`,
        to: email,
        subject: "Email Verification OTP - Packzo",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16253D; padding: 30px; border-radius: 10px;">
            <h1 style="color: #FF4500; margin: 0; padding-bottom: 20px;">Packzo</h1>
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
              <h2 style="color: #16253D; margin-top: 0;">Verify Your Email</h2>
              <p style="color: #333333;">Hello ${name},</p>
              <p style="color: #333333;">
                Thank you for signing up with Packzo. To verify your email address, please use the following verification code:
              </p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #16253D;">
                  ${randomOtp}
                </span>
              </div>
              <p style="color: #333333; margin-bottom: 5px;"><strong>Important:</strong></p>
              <ul style="color: #333333;">
                <li>This verification code is valid for 5 minutes</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't create an account with Packzo, please ignore this email</li>
              </ul>
              <p style="color: #333333; margin-top: 20px;">
                Welcome aboard!<br/>Team Packzo
              </p>
            </div>
            <div style="text-align: center; padding-top: 20px; color: #ffffff; font-size: 12px;">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    console.log("🔹 Sending OTP to:", email, "OTP:", randomOtp);

    try {
        const info = await transporter.sendMail(emailTemplate);
        console.log(`✅ Email sent successfully. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error("❌ OTP send failed:", err.message);
        // Retry once after 2 seconds if fail
        console.log("🔹 Retrying OTP send in 2 seconds...");
        await new Promise(res => setTimeout(res, 2000));
        try {
            const retryInfo = await transporter.sendMail(emailTemplate);
            console.log(`✅ Retry success. Message ID: ${retryInfo.messageId}`);
            return { success: true, messageId: retryInfo.messageId };
        } catch (retryErr) {
            console.error("❌ Retry failed:", retryErr.message);
            throw new Error("Failed to send OTP after retry");
        }
    }
};

module.exports = { verifyOtp };
