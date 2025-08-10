const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },

    mrp: {
      type: Number,
      required: true,
      min: [0, 'MRP must be a positive number'],

    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number'],
    },
    image: {
      type: String, // Will store Cloudinary URL or path
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    inStock: {
    type: Boolean,
    default: true, // true = available
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
