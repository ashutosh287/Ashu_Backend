// Controller/sellerProductController.js
const Seller = require('../Model/Seller.js');
const Product = require('../Model/Product.js');
const cloudinary = require('cloudinary').v2
require("dotenv").config();
const slugify = require("slugify");
const mongoose = require('mongoose');


exports.updateProfile = async (req, res) => {
  try {
    const { ownerName, shopName, phone } = req.body;
    const updated = await Seller.findByIdAndUpdate(
      req.seller._id,
      { ownerName, shopName, phone },
      { new: true }
    );
    res.json({ seller: updated });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("Sellertoken", {
    httpOnly: true,
    secure: false, // ✅ Localhost/IP testing me false rakho
    sameSite: "lax" // Local testing me lax better hai
  });

  res.status(200).json({ message: 'Logged out successfully' });
};



// controllers/sellerProductCtrl.js
exports.addProduct = async (req, res) => {
  try {
    const { name, description, mrp, price } = req.body;
    const imageUrl = req.file?.path;

    console.log("📦 Incoming req.sellerId:", req.sellerId); // MUST show something

    if (!req.sellerId) {
      return res.status(400).json({ msg: 'Missing sellerId in request' });
    }

    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ''); // 20250728232513
    const baseSlug = slugify(name, { lower: true, strict: true });
    const slug = `${baseSlug}-${timestamp}`;



    const newProduct = new Product({
      name,
      slug,
      description,
      mrp,
      price,
      image: imageUrl,
      sellerId: req.sellerId,
      shopId: req.shopId // ✅ USE EXACT FIELD NAME
    });

    await newProduct.save();
    res.status(201).json({ msg: 'Product added', product: newProduct });
  } catch (err) {
    console.error('🔥 Add Product Error:', err);
    res.status(500).json({ msg: err.message });
  }
};


exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.seller._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Fetch products failed' });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, mrp, price } = req.body;

    console.log("📦 Incoming req.sellerId:", req.sellerId); // Debugging
    console.log("📦 Incoming req.shopId:", req.shopId);

    if (!req.sellerId) {
      return res.status(400).json({ msg: "Missing sellerId in request" });
    }

    // Base update data
    const updateData = {
      name,
      description,
      mrp,
      price,
    };

    // ✅ If new image uploaded, update image path
    if (req.file) {
      updateData.image = req.file.path; // Same as addProduct
    }

    // ✅ Optional: Regenerate slug if name changes
    if (name) {
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
      const baseSlug = slugify(name, { lower: true, strict: true });
      updateData.slug = `${baseSlug}-${timestamp}`;
    }

    const updated = await Product.findOneAndUpdate(
      { _id: id, sellerId: req.sellerId }, // same as addProduct
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Product not found or unauthorized" });
    }

    res.json({ msg: "Product updated successfully", product: updated });

  } catch (err) {
    console.error("🔥 Update Product Error:", err);
    res.status(500).json({ msg: err.message || "Update failed" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findOneAndDelete({ _id: id, sellerId: req.seller._id });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

exports.togglePublish = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updated = await Product.findByIdAndUpdate(
      productId,
      { $set: { isPublished: !product.isPublished } },
      { new: true }
    );

    res.status(200).json({
      message: `Product ${updated.isPublished ? "published" : "unpublished"} successfully`,
      product: updated,
    });

  } catch (error) {
    console.error("❌ Error in togglePublish:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({ isPublished: true }).populate('sellerId', 'shopName ownerName');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch public products' });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { inStock } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { inStock },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Stock update failed' });
  }
};



