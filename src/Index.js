// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();
// const cookieParser = require("cookie-parser");


// const routes = require('./Routes/Routes');
// const sellerRoutes = require('./Routes/SellerRoutes');
// const userRoutes = require('./Routes/UserRoutes');
// const SearchRoutes = require('./Routes/SearchRoutes');
// const app = express();

// // ✅ Middlewaresx
// app.use(express.json());
// app.use(cookieParser()); 
// app.use(cors());
// app.use(sellerRoutes);
// app.use(userRoutes);
// app.use(SearchRoutes);

// // ✅ Serve static files from "uploads" folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ Connect MongoDB
// mongoose.connect(process.env.MongoDBUrl)
//     .then(() => console.log('✅ MongoDB is connected'))
//     .catch((e) => console.log('❌ MongoDB connection error:', e));

// // ✅ Main routes
// app.use('/', routes);
// // ✅ Seller routes
// app.use('/api/seller', sellerRoutes);
// //✅  User Routes
// app.use('/user' , userRoutes);
// // ✅ Search routes
// app.use('/search', SearchRoutes);

// // ✅ Start server
// // const PORT = process.env.PORT || 5005;
// // app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));

// app.listen(5005, '0.0.0.0', () => {
//   console.log(`🚀 Server is running on http://0.0.0.0:5005`);
// });





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

// ✅ Proper CORS config with credentials
app.use(cors({
  origin: "http://0.0.0.0:5005", // ya tumhara frontend IP if you test on mobile or other device
  credentials: true
}));

// ✅ Routes
app.use(sellerRoutes);
app.use(userRoutes);
app.use(SearchRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', routes);
app.use('/api/seller', sellerRoutes);
app.use('/user', userRoutes);
app.use('/search', SearchRoutes);

// ✅ MongoDB + Server start after connection
mongoose.connect(process.env.MongoDBUrl)
  .then(() => {
    console.log('✅ MongoDB is connected');

    app.listen(5005, '0.0.0.0', () => {
      console.log(`🚀 Server is running on http://0.0.0.0:5005`);
    });
  })
  .catch((e) => {
    console.error('❌ MongoDB connection error:', e);
    process.exit(1); // Stop server if DB fails
  });


