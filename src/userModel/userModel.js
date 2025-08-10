// ✅ Mongoose User Model with loginAttempts and lockUntil
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  oldEmail: { type: String },
  password: { type: String, required: true, trim: true },

  resetOtp: { type: String, trim: true },
  resetOtpExpiry: { type: Date },
  verifyOtp: { type: String, trim: true },
  verifyOtpExpiry: { type: Date },
  UserVerifyOtp: { type: String, trim: true },

  role: { type: String, enum: ['user'], required: true, trim: true },
  isdelete: { type: Boolean, default: false },
  isVerify: { type: Boolean, default: false },
  isAccountActive: { type: Boolean, default: true },
  archived: { type: Boolean, default: false },
  archivedAt: { type: Date },

  // ✅ New fields
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
}, { timestamps: true });

// ✅ Method to check if account is locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model("User", userSchema);