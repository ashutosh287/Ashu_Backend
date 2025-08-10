// utils/generateToken.js
const jwt = require("jsonwebtoken");
require('dotenv').config();

const generateToken = (seller) => {
  return jwt.sign(
    { _id: seller._id }, // ✅ THIS MUST BE _id
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
