const UserModel = require('../userModel/userModel.js')
const bcrypt = require('bcrypt');
require('dotenv').config();
const { verifyOtp } = require('../Mail/VerifyOtpMail.js')
const jwt = require("jsonwebtoken")
const { sendOtpEmail } = require('../Mail/SendOtpEmail.js')


exports.createUser = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0)
      return res.status(400).send({ status: false, msg: "Request body is missing" });

    const { name, email, password } = data;
    if (!name || !email || !password)
      return res.status(400).send({ status: false, msg: "Missing required fields: name, email, or password" });

    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      const UserStatus = {
        isAccountActive: existingUser.isAccountActive,
        isVerify: existingUser.isVerify,
        isdelete: existingUser.isdelete
      };

      if (!UserStatus.isAccountActive)
        return res.status(400).send({ status: false, msg: "Your Account Is Blocked", data: UserStatus });

      if (UserStatus.isdelete) {
        // ✅ Reactivate deleted account with fresh data
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUser.name = name;
        existingUser.password = hashedPassword;
        existingUser.UserVerifyOtp = randomOtp;
        existingUser.isdelete = false;
        existingUser.isVerify = false;
        existingUser.archived = false;
        existingUser.archivedAt = null;

        await existingUser.save();

        try {
          await verifyOtp(name, email, randomOtp);
        } catch (err) {
          return res.status(500).send({ status: false, msg: "Failed to send OTP", error: err.message });
        }

        return res.status(201).send({
          status: true,
          msg: 'Account recreated successfully. OTP sent.',
          email: existingUser.email,
          id: existingUser._id
        });
      }

      if (UserStatus.isVerify)
        return res.status(400).send({ status: false, msg: "Your account is verified, please login", data: UserStatus });

      // Re-send OTP if already exists but not verified
      await UserModel.findByIdAndUpdate(existingUser._id, { UserVerifyOtp: randomOtp });
      await verifyOtp(name, email, randomOtp);
      return res.status(200).send({ status: true, msg: "OTP Sent Successfully", id: existingUser._id });
    }

    // ✅ Brand new user
    const bcryptPassword = await bcrypt.hash(password, 10);
    data.password = bcryptPassword;
    data.role = 'user';
    data.UserVerifyOtp = randomOtp;

    try {
      verifyOtp(name, email, randomOtp);
    } catch (err) {
      return res.status(500).send({ status: false, msg: "Failed to send OTP", error: err.message });
    }

    const newUser = await UserModel.create(data);
    return res.status(201).send({
      status: true,
      msg: 'Successfully Registered. OTP sent.',
      email: newUser.email,
      id: newUser._id
    });

  } catch (e) {
    return res.status(500).send({ status: false, msg: e.message });
  }
};




exports.VerifUserOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { id } = req.params;

    if (!otp) {
      return res.status(400).send({ status: false, msg: "Please Provide OTP" });
    }

    if (!id || id === "undefined") {
      return res.status(400).send({ status: false, msg: "Invalid User ID" });
    }

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).send({ status: false, msg: "User Not Found" });
    }

    if (!user.isAccountActive) {
      return res.status(403).send({ status: false, msg: "Your Account is Blocked" });
    }

    if (user.isdelete) {
      return res.status(403).send({ status: false, msg: "Your Account is Deleted" });
    }

    if (user.isVerify) {
      return res.status(400).send({ status: false, msg: "Your Account is Already Verified. Please Login." });
    }

    if (otp !== user.UserVerifyOtp) {
      return res.status(400).send({ status: false, msg: "Wrong OTP" });
    }

    await UserModel.findByIdAndUpdate(id, {
      $set: { isVerify: true, UserVerifyOtp: null }
    });

    return res.status(200).send({ status: true, msg: "User Verified Successfully" });

  } catch (err) {
    console.error("OTP Verify Error:", err.message);
    return res.status(500).send({ status: false, msg: "Server Error", error: err.message });
  }
};



const MAX_ATTEMPTS = 3;
const LOCK_TIME = 60 * 60 * 1000; // 1 hour

exports.LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user || user.isdelete) {
      return res.status(404).json({ msg: 'No account found' });
    }

    if (user.isLocked()) {
      return res.status(403).json({
        msg: `Too many failed attempts. Please try again after ${Math.ceil((user.lockUntil - Date.now()) / 60000)} minutes.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
        await user.save();
        return res.status(403).json({
          msg: 'Account locked due to multiple failed attempts. Try again in 1 hour.',
        });
      }

      await user.save();
      return res.status(400).json({ msg: 'Wrong Password' });
    }

    // ✅ Reset attempts
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_USER || 'your_jwt_secret_key',
      { expiresIn: '12h' }
    );

    // ✅ Set cookie
    // Backend login route
    res.cookie("token", token, {
      httpOnly: true,                        // JS cannot access cookie
      secure: true,                          // HTTPS only
      sameSite: "none",                       // Cross-site (iOS + Safari compatible)
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,          // 1 day
    });



    return res.status(200).json({
      msg: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};





// Step 1: Request password reset OTP
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: false, msg: "Email is required" });

    // ✅ Deleted account ko find hi mat karo
    const user = await UserModel.findOne({ email, isdelete: false });
    if (!user) return res.status(404).json({ status: false, msg: "User not found or deleted" });

    if (!user.isAccountActive) return res.status(400).json({ status: false, msg: "Account is blocked" });

    const resetOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await UserModel.findByIdAndUpdate(user._id, {
      $set: {
        resetOtp,
        resetOtpExpiry: expiry,
      },
    });

    console.log("🔐 OTP generated for:", email);

    await sendOtpEmail(user.name, email, resetOtp);

    res.status(200).json({ status: true, msg: "OTP sent to your email", id: user._id });
  } catch (err) {
    console.error("❌ Error in requestPasswordReset:", err);
    res.status(500).json({ status: false, msg: err.message });
  }
};



// Step 2: Reset password using OTP
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword)
      return res.status(400).json({ status: false, msg: "OTP and new password required" });

    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ status: false, msg: "User not found" });

    // ✅ Match field correctly
    if (user.resetOtp !== otp)
      return res.status(400).json({ status: false, msg: "Invalid OTP" });

    if (!user.resetOtpExpiry || new Date() > user.resetOtpExpiry)
      return res.status(400).json({ status: false, msg: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(id, {
      $set: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpiry: null,
      },
    });

    res.status(200).json({ status: true, msg: "Password reset successfully" });
  } catch (err) {
    console.error("❌ Error in resetPassword:", err);
    res.status(500).json({ status: false, msg: err.message });
  }
};


// Change Password — user provides current password & new password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Current and new passwords required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    console.log("🔑 Input password:", currentPassword);
    console.log("🔐 Stored hash:", user.password);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    console.log("✅ isMatch:", isMatch);

    user.password = hashed;
    await user.save();

    res.status(200).json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error("❌ Change password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};




// 🧠 Controller to check if user is logged in (for frontend logout double-check, etc.)
exports.checkUserAuthController = (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(200).json({ isLoggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    return res.status(200).json({
      isLoggedIn: true,
      userId: decoded.id,
    });
  } catch (err) {
    return res.status(200).json({ isLoggedIn: false });
  }
};



exports.LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,                 // since frontend HTTPS
      sameSite: "none",             // cross-site
      path: "/",                    // same path as login
    });


    return res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ msg: "Logout failed" });
  }
};
