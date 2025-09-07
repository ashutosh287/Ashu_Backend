// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Shop" },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // or whatever your user model name is
        required: true,
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
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
    status: { type: String, default: "Pending" },
    totalAmount: { type: Number },
    placedAt: { type: Date, default: Date.now },
    pickupCode: {
        type: String,
        required: true,
    }

});


module.exports = mongoose.model("Rorder", orderSchema);
