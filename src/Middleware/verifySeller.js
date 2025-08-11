// const jwt = require('jsonwebtoken');
// const Seller = require('../Model/Seller');

// const verifySeller = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Token missing or invalid' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const seller = await Seller.findById(decoded._id);
//     if (!seller) {
//       return res.status(404).json({ message: 'Seller not found' });
//     }

//     req.seller = seller;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Unauthorized access', error: err.message });
//   }
// };

// module.exports = verifySeller;


const jwt = require('jsonwebtoken');
const Seller = require('../Model/Seller');
require('dotenv').config();


const VerifySeller = async (req, res, next) => {
  try {
    // 🔹 Get token from cookies instead of headers
    const SellerToken = req.cookies?.Sellertoken;


    if (!SellerToken) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // 🔹 Verify token
    const decoded = jwt.verify(SellerToken, process.env.JWT_SECRET);

    if (!decoded._id) {
      return res.status(401).json({ message: 'Invalid token payload (_id missing)' });
    }

    // 🔹 Find seller
    const seller = await Seller.findById(decoded._id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // 🔹 Attach seller info to request
    req.seller = seller;
    req.sellerId = seller._id;
    req.shopId = seller.shopId;


    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};


module.exports = VerifySeller;
