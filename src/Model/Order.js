const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // ✅ Required so it's always saved
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  buyerName: String,
  address: String,
  area: String,
  phone: String,
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  preferredDeliveryTime: String,
  paymentMethod: String,
  orderNotes: String,
  productsTotal: { type: Number, required: true },       // seller ka revenue
  deliveryCharge: { type: Number, required: true },       // admin ke liye visible
  totalAmount: { type: Number, required: true },
  deliverycode: { type: Number, required: true, default: () => Math.floor(1000 + Math.random() * 9000), }, // random 4-digit code
  status: {
    type: String,
    default: 'Pending',
  },
  placedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('orders', orderSchema);
