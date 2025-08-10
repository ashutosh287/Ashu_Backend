const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendOtpEmailSeller = async (name, email, otp) => {
  if (!email || !email.includes("@")) {
    console.error("❌ Invalid email provided:", email);
    throw new Error("Invalid email address.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NodeMailerUser,
      pass: process.env.NodeMailerPass,
    },
  });

  const mailOptions = {
    from: `"mbnShop.in Support" <${process.env.NodeMailerUser}>`,
    to: email,
    subject: "mbnShop OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
        <h2 style="color: #6B21A8;">Hello ${name || "Seller"},</h2>
        <p style="font-size: 16px; color: #333;">
          Your OTP for verification is:
        </p>
        <div style="font-size: 24px; font-weight: bold; color: #6B21A8; margin: 10px 0;">${otp}</div>
        <p style="color: #555;">
          Please enter this code to complete your verification. This OTP is valid for <strong>5 minutes</strong>.
        </p>
        <hr style="margin: 20px 0;" />
        <p style="font-size: 13px; color: #888;">
          If you did not request this OTP, please ignore this email or contact our support team at <a href="mailto:support@mbnshop.in">support@mbnshop.in</a>.
        </p>
        <p style="font-size: 13px; color: #aaa;">
          – Team mbnShop.in
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to:", email);
    return info;
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err.message);
    throw err;
  }
};
