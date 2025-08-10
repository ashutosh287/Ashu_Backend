const jwt = require('jsonwebtoken');
require('dotenv').config();



// 🔒 Middleware to protect routes using token in cookies

const verifyUser = (req, res, next) => {
  const token = req.cookies?.token;
  console.log("token", token);

  if (!token) {
    console.log("verifyUser: verify false (token missing)");
    return res.status(401).json({ msg: "Unauthorized: User token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER); // User ke liye secret

    req.userId = decoded.id;
    console.log("userId:", req.userId);

    // console.log("verifyUser: verify true");
    next(); // ✅ Aage controller pe ja
  } catch (err) {
    console.error("❌ User Token verification failed:", err);
    console.log("verifyUser: verify false (invalid token)");
    return res.status(401).json({ msg: "Unauthorized: Invalid user token" });
  }
};

module.exports = verifyUser;






