const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.verifyOtp = async (name, email, randomOtp) => {
  try {
    const data = await resend.emails.send({
      from: "Packzo.in <no-reply@packzo.in>",  // jo Resend me verified hai wahi use kar
      to: email,
      subject: "Your OTP Code",
      html: `<p>Hi ${name},</p><p>Your OTP is <b>${randomOtp}</b></p>`,
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
