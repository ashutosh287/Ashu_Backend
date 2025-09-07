const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.verifyOtp = async (name, email, randomOtp) => {
    try {
        const data = await resend.emails.send({
            from: "Packzo.in <no-reply@packzo.in>", // ✅ apna verified domain wala sender
            to: email,
            subject: "🔐 Your Packzo OTP Code",
            html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6; max-width:600px; margin:0 auto; border:1px solid #eaeaea; border-radius:8px; overflow:hidden;">
      
      <div style="background:#4CAF50; color:#fff; padding:16px; text-align:center;">
        <h2 style="margin:0;">Packzo.in</h2>
      </div>
      
      <div style="padding:20px;">
        <p>Hi <b>${name}</b>,</p>
        
        <p>We received a request to verify your email address for your <b>Packzo</b> account.</p>
        
        <p style="font-size:16px;">Please use the following OTP to complete your verification:</p>
        
        <div style="text-align:center; margin:20px 0;">
          <span style="display:inline-block; background:#f3f3f3; padding:15px 30px; font-size:24px; font-weight:bold; letter-spacing:5px; border-radius:6px; border:1px solid #ddd;">
            ${randomOtp}
          </span>
        </div>
        
        <p style="font-size:14px; color:#555;">⚠️ This OTP will expire in <b>10 minutes</b>. Please do not share it with anyone.</p>
        
        <p>If you did not request this, you can safely ignore this email.</p>
        
        <p>Thanks,<br/>Team <b>Packzo.in</b></p>
      </div>
      
      <div style="background:#f9f9f9; padding:12px; text-align:center; font-size:12px; color:#888;">
        © ${new Date().getFullYear()} Packzo.in. All rights reserved.
      </div>
    </div>
  `,
        });


        console.log("✅ OTP sent successfully:", data);
        return data;
    } catch (error) {
        console.error("❌ OTP Send Error:", error.message || error);
        if (error.response) {
            console.error("📩 Resend API response:", error.response);
        }
        throw error;
    }
};
