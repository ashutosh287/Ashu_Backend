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

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
];
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('CORS: Origin not allowed'), false);
    },
    credentials: true,
  })
);

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, msg: 'API healthy' });
});

// ===== Routes =====
app.use('/api', routes);
app.use('/api/seller', sellerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/search', SearchRoutes);

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ===== Start Server =====
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
