const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NodeMailerUser, // Your Gmail
    pass: process.env.NodeMailerPass, // App Password
  },
  tls: {
    rejectUnauthorized: false, // Prevent certificate issues
  },
});

// ✅ Verify transporter connection (optional, helps debugging)
transporter.verify(function (error, success) {
  if (error) {
    console.error("Nodemailer connection error:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

exports.verifyOtp = async (name, email, otp) => {
  const mailOptions = {
    from: `"iShop" <${process.env.NodeMailerUser}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Hello ${name},\n\nYour OTP for iShop registration is: ${otp}\n\nDo not share this OTP with anyone.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${info.response}`);
  } catch (err) {
    console.error(`Failed to send OTP to ${email}:`, err);
    // Throw the error so calling function can handle it
    throw err;
  }
};
