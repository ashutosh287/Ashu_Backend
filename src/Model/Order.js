const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Shop" },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

  preferredPackedTime: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  orderNotes: { type: String },
  orderType: { type: String, enum: ["ready", "pack"], required: true },

  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],

  // ✅ New fields for totals
  productsTotal: { type: Number, required: true },   // sirf products ka total (seller revenue)
  deliveryCharge: { type: Number, required: true },  // delivery charges (sirf admin ke liye)
  totalAmount: { type: Number, required: true },      // productsTotal + deliveryCharge (customer payment)

  status: { type: String, default: "Pending" },
  placedAt: { type: Date, default: Date.now },

  pickupCode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("orders", orderSchema);
