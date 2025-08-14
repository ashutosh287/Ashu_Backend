const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Routes
const routes = require('./src/Routes/Routes');
const sellerRoutes = require('./src/Routes/SellerRoutes');
const userRoutes = require('./src/Routes/UserRoutes');
const SearchRoutes = require('./src/Routes/SearchRoutes');

const app = express();

// Core middlewares
app.use(express.json());
app.use(cookieParser());

// CORS (no trailing slash!)
const allowedOrigins = [
  'http://localhost:5173',
];
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl/postman etc
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('CORS: Origin not allowed'), false);
    },
    credentials: true,
  })
);

// Static (⚠️ Vercel FS is ephemeral; use S3/Cloudinary in production)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, msg: 'API healthy' });
});

// Mount your routes (keep /api prefix)
app.use('/api', routes);
app.use('/api/seller', sellerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/search', SearchRoutes);

// Mongo connect (top-level; ok for serverless cold starts)
if (!global._mongooseConnected) {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      global._mongooseConnected = true;
      console.log('✅ MongoDB connected');
    })
    .catch((e) => console.error('❌ MongoDB error:', e));
}

// IMPORTANT: Export the Express app (NO app.listen here)
module.exports = app;
