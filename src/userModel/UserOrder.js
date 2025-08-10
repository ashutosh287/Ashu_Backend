// Example Mongoose Order Model (with shopId as reference)
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop', // ✅ ref added to populate name
  },
  products: Array,
  status: {
    type: String,
    default: 'Pending', // or 'Placed', 'Cancelled', etc.
  },
  placedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserOrder', orderSchema);
