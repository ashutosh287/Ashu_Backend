const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const routes = require('./src/Routes/Routes');
const sellerRoutes = require('./src/Routes/SellerRoutes');
const userRoutes = require('./src/Routes/UserRoutes');
const SearchRoutes = require('./src/Routes/SearchRoutes');

const app = express();

app.use(cors({
    origin: '*', // Deployment ke baad exact frontend URL de sakte ho
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api', routes);
app.use('/api/seller', sellerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/search', SearchRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
