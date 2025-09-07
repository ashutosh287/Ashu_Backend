
const Cart = require('../Model/Cart.js');
const mongoose = require('mongoose');
const Order = require('../Model/Order.js');
const Rorder = require('../Model/Rorder.js');
const Product = require('../Model/Product.js');

exports.addToCart = async (req, res) => {
  try {
    const { productId, shopId, name, image, price, quantity } = req.body;

    if (!productId || !shopId || !name) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const newItem = new Cart({
      productId,
      shopId,
      name,
      image,
      price,
      quantity: quantity || 1
    });

    await newItem.save();
    res.status(201).json({ message: 'Added to cart', cart: newItem });
  } catch (err) {
    console.error('❌ Error in addToCart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCartByShop = async (req, res) => {
  const { shopId } = req.params;

  if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
    return res.status(400).json({ message: 'Invalid or missing shopId' });
  }

  try {
    const cart = await Cart.find({ shopId });

    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.productId);

        const isOutOfStock = !product || product.inStock === false; // ✅ Boolean check
        const isUnpublished = !product || product.isPublished === false;

        return {
          ...item.toObject(),
          isOutOfStock,
          isUnpublished,
        };
      })
    );

    res.status(200).json(updatedCart);
  } catch (err) {
    console.error('❌ Error fetching cart:', err);
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};


exports.increaseCartQty = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Cart.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity += 1;
    await item.save();
    res.json({ message: "Quantity increased" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.decreaseCartQty = async (req, res) => {
  const { id } = req.params;
  const { removeDirectly } = req.query; // e.g. /decrease/:id?removeDirectly=true

  try {
    const item = await Cart.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // ✅ If user wants to directly remove the item
    if (removeDirectly === 'true') {
      await Cart.findByIdAndDelete(id);
      return res.json({ message: "Item removed from cart" });
    }

    // ✅ Decrease logic
    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
      res.json({ message: "Quantity decreased" });
    } else {
      await Cart.findByIdAndDelete(id);
      res.json({ message: "Item removed from cart" });
    }

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





exports.ROrder = async (req, res) => {
  try {
    const {
      shopId,
      fullName,
      phone,
      preferredPackedTime,
      paymentMethod,
      orderNotes,
      orderType,
      totalAmount,
      items,
    } = req.body;


    const userId = req.userId;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in",
      });
    }

    // 🔄 Validate item stocks before placing the order
    for (const item of items) {
      const product = await Product.findById(item.productId);

      // check karo product exist karta hai ya nahi
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `${item.name} not found`,
        });
      }

      // bas true/false check karo
      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is out of stock`,
        });
      }
    }

    // 🔐 Generate Pickup Code (e.g., "M372")
    const pickupCode = (() => {
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const digits = Math.floor(100 + Math.random() * 900);
      return letter + digits;
    })();

    // ✅ Create new order
    const newOrder = new Rorder({
      shopId,
      userId,
      fullName,
      phone,
      preferredPackedTime,
      paymentMethod,
      orderNotes,
      orderType,
      totalAmount,
      items,
      pickupCode,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      pickupCode,
    });

  } catch (error) {
    console.error("❌ Order placement failed:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


