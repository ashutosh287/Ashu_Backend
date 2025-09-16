const Order = require('../Model/Order.js');
const Product = require('../Model/Product.js');
const Rorder = require('../Model/Rorder.js')
const mongoose = require('mongoose');



exports.placeOrder = async (req, res) => {
  try {
    const {
      shopId,
      buyerName,
      address,
      phone,
      items,
      preferredDeliveryTime,
      paymentMethod,
      orderNotes,
      totalAmount
    } = req.body;

    // ✅ Use req.userId directly, set by verifyUser middleware
    const newOrder = new Order({
      userId: req.userId, // ✅ FIXED LINE
      shopId,
      buyerName,
      address,
      phone,
      items,
      preferredDeliveryTime,
      paymentMethod,
      orderNotes,
      totalAmount,
      status: "Pending"
    });

    await newOrder.save();

    res.status(201).json({
      message: '✅ Order placed successfully',
      order: newOrder
    });
  } catch (err) {
    console.error('❌ Place order failed:', err);
    res.status(500).json({ message: 'Failed to place order.' });
  }
};



// exports.updateOrderStatus = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const { status } = req.body;

//         const updated = await Order.findByIdAndUpdate(
//             orderId,
//             { status },
//             { new: true }
//         );

//         res.json(updated);
//     } catch (err) {
//         res.status(500).json({ message: 'Failed to update status' });
//     }
// };


exports.addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const product = new Product({
      sellerId: req.seller._id,
      name,
      description,
      price,
      image: imagePath,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Add product failed' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { shopId } = req.seller; // ✅ Assuming seller has shopId
    const orders = await Order.find({ shopId }).sort({ placedAt: -1 }); // placedAt is better than 'date'
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// exports.getMyReadyOrders = async (req, res) => {
//   try {
//     const {
//       fullName,
//       phone,
//       paymentMethod,
//       orderNotes,
//       orderType,
//       items
//     } = req.body;

//     const { shopId } = req.seller; // ✅ middleware se seller ka shopId mil raha hai

//     // ✅ Total amount calculate karo
//     const totalAmount = items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );

//     // ✅ Naya order create karo
//     const newOrder = new Rorder({
//       fullName,
//       phone,
//       paymentMethod,
//       orderNotes,
//       orderType,
//       items,
//       totalAmount,
//       shopId,
//     });

//     await newOrder.save();

//     res.status(201).json({ message: "Order placed successfully", order: newOrder });
//   } catch (err) {
//     console.error("❌ Error placing order:", err);
//     res.status(500).json({ error: "Order placement failed" });
//   }
// };

exports.getMyReadyOrders = async (req, res) => {
  try {
    const { shopId } = req.seller; // ✅ this must be coming from token
    const orders = await Rorder.find({ shopId }).sort({ placedAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// controllers/order.js
exports.updateReadyOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, context } = req.body;

    let validStatuses;

    if (context === 'delivery') {
      validStatuses = ['Pending', 'Delivered', 'Cancelled'];
    } else if (context === 'ready') {
      validStatuses = ['Pending', 'Ready', 'Picked', 'Cancelled'];
    } else {
      return res.status(400).json({ message: 'Invalid context type' });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await Rorder.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updated
    });
  } catch (err) {
    console.error('❌ Failed to update order status:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};



exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only allow these statuses
    const validStatuses = ['Pending', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (err) {
    console.error('❌ Failed to update order status:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};







// exports.getUserOrders = async (req, res) => {
//   try {
//     console.log("👉 User ID for orders:", req.userId); // Check this
//     const orders = await Order.find({ userId: req.userId });
//     console.log("📦 Orders found:", orders.length);
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("❌ Error fetching user orders:", error);
//     res.status(500).json({ msg: "Failed to fetch orders" });
//   }
// };

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('shopId', 'shopName'); // ✅ Yeh line shop ka naam le aayegi

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ msg: "Failed to fetch orders" });
  }
};


exports.getReadyOrders = async (req, res) => {
  try {
    const orders = await Rorder.find({
      userId: req.userId,
      orderType: { $in: ["ready", "pack"] },
    }).populate("shopId", "shopName");

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching ready orders:", error);
    res.status(500).json({ msg: "Failed to fetch ready orders" });
  }
}




exports.getRevenueStats = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const shopId = req.shopId;

    console.log("✅ Seller ID:", sellerId);
    console.log("✅ Shop ID:", shopId);

    const timeFrames = {
      today: new Date(),
      week: new Date(new Date().setDate(new Date().getDate() - 6)),
      month: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    };

    const revenueData = await Rorder.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId),
          status: "Picked", // make sure this matches your DB
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$placedAt",
                timezone: "Asia/Kolkata" // ✅ Force IST timezone
              },
            },
          },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }, // ✅ number of orders that day
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    console.log("📊 Aggregated Revenue Data:", revenueData);

    const todayStr = new Date()
      .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    // ✅ "YYYY-MM-DD" in IST

    const todayRevenue = revenueData
      .filter((d) => d._id.day === todayStr)
      .reduce((acc, cur) => acc + cur.total, 0);

    const weekRevenue = revenueData
      .filter((d) => new Date(d._id.day) >= timeFrames.week)
      .reduce((acc, cur) => acc + cur.total, 0);

    const monthRevenue = revenueData
      .filter((d) => new Date(d._id.day) >= timeFrames.month)
      .reduce((acc, cur) => acc + cur.total, 0);

    res.json({
      success: true,
      today: todayRevenue,
      week: weekRevenue,
      month: monthRevenue,
      chartData: revenueData.map((d) => ({
        day: d._id.day,
        total: d.total,
        count: d.count,
      })),
    });
  } catch (err) {
    console.error("❌ Revenue error:", err);
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};



exports.getOrdersRevenueStats = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const shopId = req.shopId;

    console.log("✅ Seller ID:", sellerId);
    console.log("✅ Shop ID:", shopId);

    const timeFrames = {
      today: new Date(),
      week: new Date(new Date().setDate(new Date().getDate() - 6)),
      month: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    };

    const revenueData = await Order.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId),
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$placedAt",
                timezone: "Asia/Kolkata",
              },
            },
          },
          total: {
            $sum: {
              $toDouble: { $ifNull: ["$totalAmount", 0] }
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    console.log("📊 Aggregated Revenue Data:", revenueData);

    const todayStr = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const todayRevenue = revenueData
      .filter((d) => d._id.day === todayStr)
      .reduce((acc, cur) => acc + cur.total, 0);

    const weekRevenue = revenueData
      .filter((d) => new Date(d._id.day) >= timeFrames.week)
      .reduce((acc, cur) => acc + cur.total, 0);

    const monthRevenue = revenueData
      .filter((d) => new Date(d._id.day) >= timeFrames.month)
      .reduce((acc, cur) => acc + cur.total, 0);

    res.json({
      success: true,
      today: todayRevenue,
      week: weekRevenue,
      month: monthRevenue,
      chartData: revenueData.map((d) => ({
        day: d._id.day,
        total: d.total,
        count: d.count,
      })),
    });
  } catch (err) {
    console.error("❌ Revenue error:", err);
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};

