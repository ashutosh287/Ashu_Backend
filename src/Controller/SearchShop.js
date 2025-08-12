const Shop = require("../Model/Shop.js");
const Product = require('../Model/Product.js')
const mongoose = require("mongoose");

exports.searchShops = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";

    if (!search) {
      return res.status(200).json({ shops: [] });
    }

    const regex = new RegExp(search, "i");

    const shops = await Shop.find({
      shopName: { $regex: regex },
      isApproved: true // 🔁 comment out for testing
    }).select("_id shopName ownerName");

    return res.status(200).json({ shops });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};



exports.getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { query } = req.query; // search text

    if (!shopId || !query)
      return res.status(400).json({ status: false, msg: "Missing shopId or query" });

    const matchedProducts = await Product.find({
      shopId,
      isPublished: true,
      name: { $regex: query, $options: "i" }, // case-insensitive match
    });

    res.json({ status: true, products: matchedProducts });
  } catch (err) {
    res.status(500).json({ status: false, msg: "Server Error" });
  }
};
