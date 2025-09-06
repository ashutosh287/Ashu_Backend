const nodemailer = require("nodemailer");
require('dotenv').config();


exports.sendOtpEmail = async (name, email, otp) => {
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
    from: `"Packzo.in" <${process.env.NodeMailerUser}>`,
    to: email, // ✅ This must be a valid email like 'test@gmail.com'
    subject: "Password Reset OTP",
    html: `<h3>Hello ${name || "User"},</h3>
      <p>Your password reset OTP is: <b>${otp}</b></p>
      <p>This OTP is valid for 5 minutes only.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent to:", email);
    return info;
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw err;
  }
};

