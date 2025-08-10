const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const cookieParser = require("cookie-parser");

const routes = require('./Routes/Routes');
const sellerRoutes = require('./Routes/SellerRoutes');
const userRoutes = require('./Routes/UserRoutes');
const SearchRoutes = require('./Routes/SearchRoutes');

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Proper CORS config
app.use(cors({
  origin: "https://ashu-fronted.vercel.app/", // 👈 apne frontend ka deployed domain daalo
  credentials: true
}));

// ✅ Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/', routes);
app.use('/api/seller', sellerRoutes);
app.use('/user', userRoutes);
app.use('/search', SearchRoutes);

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// ✅ MongoDB connect
mongoose.connect(process.env.MongoDBUrl)
  .then(() => console.log('✅ MongoDB is connected'))
  .catch((e) => console.log('❌ MongoDB connection error:', e));

// ❌ Do not use app.listen() in Vercel
module.exports = app;
