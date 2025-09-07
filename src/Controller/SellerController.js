const Seller = require('../Model/Seller.js');
const bcrypt = require('bcrypt');
const generateToken = require('../Utils/GenerateToken.js');
const Shop = require('../Model/Shop.js');
const mongoose = require('mongoose');
const { sendOtpEmailSeller } = require('../Mail/SellerVerifyOTP.js');

const slugify = (text) => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};




exports.createSeller = async (req, res) => {
  const { ownerName, shopName, email, phone, password } = req.body;

  try {
    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists with this email' });
    }

    // Check if shop is registered
    const shopByEmail = await Shop.findOne({ email });
    const shopByPhone = await Shop.findOne({ phone });

    if (shopByEmail && shopByEmail.phone !== phone) {
      return res.status(400).json({
        message: 'Please enter the correct mobile number used in your shop registration.',
      });
    }

    if (shopByPhone && shopByPhone.email !== email) {
      return res.status(400).json({
        message: 'Please enter the correct email used in your shop registration.',
      });
    }

    if (!shopByEmail && !shopByPhone) {
      return res.status(404).json({
        message: 'Please register your shop before signing up as a seller.',
      });
    }

    const matchedShop = shopByEmail || shopByPhone;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create slug
    const shopSlug = slugify(shopName, { lower: true });

    // Generate OTP and expiry
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Create new seller with OTP
    const newSeller = new Seller({
      ownerName,
      shopName,
      email,
      phone,
      password: hashedPassword,
      shopSlug,
      shopId: matchedShop._id,
      otp,
      otpExpiry,
      isVerified: false, // ✅ Add this field in model
    });

    await newSeller.save();

    // Send OTP email
    await sendOtpEmailSeller(ownerName, email, otp);

    res.status(201).json({
      message: 'Seller registered. Please verify your email using the OTP sent.',
      email,
    });
  } catch (err) {
    console.error('❌ Seller Signup Error:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};



// exports.verifySellerOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   const seller = await Seller.findOne({ email });
//   if (!seller) return res.status(400).json({ msg: "Seller not found." });

//   if (seller.isVerified) {
//     return res.status(400).json({ msg: "Seller already verified." });
//   }

//   if (seller.otp !== otp) {
//     return res.status(400).json({ msg: "Invalid OTP." });
//   }

//   if (Date.now() > seller.otpExpires) {
//     return res.status(400).json({ msg: "OTP expired." });
//   }

//   seller.isVerified = true;
//   seller.otp = null;
//   seller.otpExpires = null;
//   await seller.save();

//   res.status(200).json({ msg: "Seller verified successfully." });
// };



exports.loginSeller = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingSeller = await Seller.findOne({ email });
    if (!existingSeller) {
      return res.status(400).json({ message: 'No seller found with this email.' });
    }

    // ✅ Check if locked
    if (existingSeller.loginAttempts >= 3 && existingSeller.lockUntil && existingSeller.lockUntil > Date.now()) {
      const remaining = Math.ceil((existingSeller.lockUntil - Date.now()) / (60 * 1000));
      return res.status(403).json({ message: `Account locked. Try again in ${remaining} minutes.` });
    }

    const isMatch = await bcrypt.compare(password, existingSeller.password);

    if (!isMatch) {
      existingSeller.loginAttempts = (existingSeller.loginAttempts || 0) + 1;

      if (existingSeller.loginAttempts >= 3) {
        existingSeller.lockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      }

      await existingSeller.save();
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // ✅ Reset attempts after success
    existingSeller.loginAttempts = 0;
    existingSeller.lockUntil = null;
    await existingSeller.save();

    const token = generateToken(existingSeller._id);

    // ✅ Save token in HTTP-only cookie
    res.clearCookie("Sellertoken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });






    res.status(200).json({
      seller: {
        _id: existingSeller._id,
        ownerName: existingSeller.ownerName,
        shopName: existingSeller.shopName,
        email: existingSeller.email,
        phone: existingSeller.phone,
        shopSlug: existingSeller.shopSlug,
        shopId: existingSeller.shopId,
      },
      token // Optional: you can remove this if you only want cookie-based auth
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};



// Seller Dashboard Controller
exports.getDashboard = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).populate("shopId");

    if (!seller || !seller.shopId) {
      return res.status(404).json({ message: "Seller or Shop not found" });
    }

    res.status(200).json({
      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        shop: {
          _id: seller.shopId._id,
          shopName: seller.shopId.shopName,
          open: seller.shopId.open, // ✅ Important field
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard fetch failed", error: err.message });
  }
};




exports.addShop = async (req, res) => {
  try {
    const { email, phone } = req.body;
    console.log("🟢 Data received in backend:", req.body);


    // Check if a shop with the same email or phone already exists
    const existingShop = await Shop.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingShop) {
      return res.status(400).json({ message: "Your request is already submitted." });
    }

    const newShop = new Shop(req.body);
    await newShop.save();
    res.status(201).json(newShop);
  } catch (error) {
    console.error('❌ Error adding shop:', error);
    res.status(500).json({ message: 'Failed to add shop' });
  }
};


exports.updateShopStatus = async (req, res) => {
  try {
    const { open } = req.body;

    // ✅ Use the correct shopId coming from verifySeller
    const shopId = req.shopId;

    if (!shopId) {
      return res.status(400).json({ status: false, message: "❌ Shop ID missing in token." });
    }

    if (typeof open !== "boolean") {
      return res.status(400).json({ status: false, message: "❌ 'open' must be boolean." });
    }

    const updatedShop = await Shop.findByIdAndUpdate(shopId, { open }, { new: true });

    if (!updatedShop) {
      return res.status(404).json({ status: false, message: "❌ Shop not found." });
    }

    res.status(200).json({ status: true, message: "✅ Shop status updated", data: updatedShop });

  } catch (err) {
    console.error("❌ updateShopStatus error:", err.message);
    res.status(500).json({ status: false, message: "Internal Server Error", error: err.message });
  }
};


exports.getShopStatus = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    res.status(200).json(shop);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).select("ownerName shopName email phone");
    if (!seller) return res.status(404).json({ msg: "Seller not found" });

    res.json(seller);
  } catch (err) {
    console.error("❌ Error fetching seller:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.requestSellerOTP = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ msg: "Valid email required" });
  }

  const seller = await Seller.findOne({ email });
  if (!seller) return res.status(404).json({ msg: "Seller not found" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpiry = Date.now() + 5 * 60 * 1000;

  seller.otp = otp;
  seller.otpExpires = otpExpiry;
  await seller.save();

  await sendOtpEmailSeller(seller.ownerName, email, otp);

  res.status(200).json({ msg: "OTP sent to your email" });
};


exports.verifySellerOTP = async (req, res) => {
  const { email, otp } = req.body;

  const seller = await Seller.findOne({ email });
  if (!seller || seller.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  if (Date.now() > seller.otpExpiry) {
    return res.status(400).json({ msg: "OTP has expired" });
  }

  res.status(200).json({ msg: "OTP verified successfully" });
};


exports.resetSellerPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const seller = await Seller.findOne({ email });
  if (!seller || seller.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  if (Date.now() > seller.otpExpires) {
    return res.status(400).json({ msg: "OTP expired" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  seller.password = hashedPassword;
  seller.otp = null;
  seller.otpExpires = null;
  await seller.save();

  res.status(200).json({ msg: "Password reset successfully" });
};


exports.checkSellerToken = async (req, res) => {
  res.json({
    loggedIn: true,
    seller: req.seller
  });
};