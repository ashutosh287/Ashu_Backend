const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.verifyOtp = async (name, email, randomOtp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Packzo.in <onboarding@resend.dev>", // ✅ sender domain verify karna hoga
      to: email,
      subject: "Email Verification OTP - Packzo.in",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16253D; padding: 30px; border-radius: 10px;">
            <h1 style="color: #FF4500; margin: 0; padding-bottom: 20px;">Packzo.in</h1>
            
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
              <h2 style="color: #16253D; margin-top: 0;">Verify Your Email</h2>
              <p style="color: #333333;">Hello ${name},</p>
              <p style="color: #333333;">Your OTP is:</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #16253D;">${randomOtp}</span>
              </div>
              <p style="color: #333333;">Valid for 5 minutes. Do not share with anyone.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      throw new Error(error.message);
    }

    console.log("✅ OTP email sent:", data.id);
    return { success: true, messageId: data.id };

  } catch (err) {
    console.error("❌ OTP Send Error:", err);
    throw new Error("Failed to send OTP email");
  }
};
