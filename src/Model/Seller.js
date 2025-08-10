// models/Seller.js
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    // ownerName: { type: String, required: true },
    // shopName: { type: String, required: true },
    // email: { type: String, required: true, unique: true },
    // phone: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    // shopSlug: { type: String, unique: true },
    // shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },

    // // ✅ Forgot password
    // resetPasswordToken: { type: String },
    // resetPasswordExpires: { type: Date },

    // // ✅ OTP Verification
    // otp: { type: String },
    // otpExpires: { type: Date },
    // isVerified: { type: Boolean, default: false },



  ownerName: { type: String, required: true },
  shopName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shopSlug: { type: String, unique: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },

  // 🔐 Security
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },

  // 🔁 Recovery & OTP
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
