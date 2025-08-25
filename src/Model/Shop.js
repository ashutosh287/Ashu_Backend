
const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
  shopName: { type: String, trim: true, unique: true },
  ownerName: { type: String, trim: true },
  phone: { type: String, unique: true, trim: true },
  email: { type: String, unique: true, trim: true },
  address: { type: String, trim: true },
  landmark: { type: String, trim: true },
  pincode: { type: String, trim: true },
  openingTime: { type: String, trim: true },
  closingTime: { type: String, trim: true },
  productTypes: { type: [String], trim: true },
  shopImage: { type: String, trim: true },
  shopkeeperImage: {
    type: String,
    required: true,
  },
  open: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },

  shopCategory: { type: String, enum: ['food', 'grocery', 'other'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
