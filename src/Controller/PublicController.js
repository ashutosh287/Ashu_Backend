const Product = require('../Model/Product.js');
const Order = require('../Model/Order.js');
const Shop = require('../Model/Shop.js');
const mongoose = require('mongoose');
const UserModel = require('../userModel/userModel.js');
const { sendOtpEmail } = require('../Mail/SendOtpEmail.js')
const bcrypt = require('bcrypt');


exports.getAllPublicProducts = async (req, res) => {
  const products = await Product.find({
    isPublished: true
  }).lean();
  res.json(products);
};

exports.placeOrder = async (req, res) => {
  const { productId, sellerId, buyerName, amount } = req.body;
  const order = new Order({ productId, sellerId, buyerName, amount });
  await order.save();
  res.status(201).json(order);
};

exports.getPublicShops = async (req, res) => {
  const shops = await Shop.find({ isApproved: true });
  res.json(shops);
};

exports.getProductsByShop = async (req, res) => {
  try {
    const shopId = req.params.id;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid shop ID" });
    }

    // ✅ Fetch only published products for this shop
    const products = await Product.find({ shopId, isPublished: true });

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products by shop:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    // ✅ Same name & options as login
    res.clearCookie("Sellertoken", {
      httpOnly: true,
      secure: true,      // HTTPS only
      sameSite: "none",  // Cross-domain ke liye required
      path: "/",         // Login jaisa hi
    });


    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error: error.message
    });
  }
};




exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // extracted from JWT in middleware

    const user = await UserModel.findById(userId).select("-password -__v"); // remove sensitive fields
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile", error: err.message });
  }
};

exports.changeEmail = async (req, res) => {
  try {
    const userId = req.userId; // 👈 from JWT middleware
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: "New email is required" });
    }

    const existing = await UserModel.findOne({ email: newEmail });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.oldEmail = user.email;
    user.email = newEmail;
    await user.save();

    res.status(200).json({ message: "Email updated successfully", email: user.email, oldEmail: user.oldEmail });
  } catch (error) {
    console.error("Error changing email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isdelete = true;
    await user.save();

    res.status(200).json({ message: "Account has been deleted. You can't login again." });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.resetPasswordEmail = async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  // 🔐 Clear OTP after successful reset
  user.resetOtp = null;
  user.resetOtpExpiry = null;
  await user.save();

  res.status(200).json({ msg: "Password reset successful" });
};

// 2. Verify OTP
exports.sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

  user.resetOtp = otp;
  user.resetOtpExpiry = expiry;
  await user.save();

  await sendOtpEmail(user.name, email, otp);

  res.status(200).json({ msg: "OTP sent to your email" });
};

// 3. Reset Password
exports.verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  if (!user.resetOtp || !user.resetOtpExpiry) {
    return res.status(400).json({ msg: "OTP not generated" });
  }

  if (user.resetOtp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  if (user.resetOtpExpiry < new Date()) {
    return res.status(400).json({ msg: "OTP expired" });
  }

  res.status(200).json({ msg: "OTP verified successfully" });
};

exports.ResendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

  user.UserVerifyOtp = otp;
  user.resetOtpExpiry = expiry;
  await user.save();

  await sendOtpEmail(user.name, email, otp);

  res.status(200).json({ msg: "OTP sent to your email" });
};
