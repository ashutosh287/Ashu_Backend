const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendOtpEmail = async (name, email, otp) => {
  if (!email || !email.includes("@")) {
    console.error("❌ Invalid email provided:", email);
    throw new Error("Invalid email address.");
  }

  try {
    const data = await resend.emails.send({
      from: "Packzo.in <no-reply@packzo.in>", // ✅ Verified domain from Resend
      to: email,
      subject: "🔐 Password Reset OTP - Packzo.in",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; max-width:600px; margin:0 auto; border:1px solid #eaeaea; border-radius:8px; overflow:hidden;">
          
          <div style="background:#16253D; color:#fff; padding:16px; text-align:center;">
            <h2 style="margin:0;">Packzo.in</h2>
          </div>
          
          <div style="padding:20px;">
            <p>Hello <b>${name || "User"}</b>,</p>
            
            <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
            
            <div style="text-align:center; margin:20px 0;">
              <span style="display:inline-block; background:#f3f3f3; padding:15px 30px; font-size:24px; font-weight:bold; letter-spacing:5px; border-radius:6px; border:1px solid #ddd;">
                ${otp}
              </span>
            </div>
            
            <p style="font-size:14px; color:#555;">⚠️ This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone.</p>
            
            <p>If you did not request this, you can safely ignore this email.</p>
            
            <p>Thanks,<br/>Team <b>Packzo.in</b></p>
          </div>
          
          <div style="background:#f9f9f9; padding:12px; text-align:center; font-size:12px; color:#888;">
            © ${new Date().getFullYear()} Packzo.in. All rights reserved.
          </div>
        </div>
      `,
    });

    console.log("✅ OTP sent to:", email, "Message ID:", data.id);
    return data;
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw err;
  }
};
