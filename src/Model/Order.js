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
  totalAmount: String,
  status: {
    type: String,
    default: 'Pending',
  },
  placedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('orders', orderSchema  );
