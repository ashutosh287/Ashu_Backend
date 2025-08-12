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

// // ✅ Middlewares
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Proper CORS config
// app.use(cors({
//   origin: "https://ashu-fronted.vercel.app/", // 👈 apne frontend ka deployed domain daalo
//   credentials: true
// }));

// // ✅ Static uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ API Routes
// app.use('/', routes);
// app.use('/api/seller', sellerRoutes);
// app.use('/user', userRoutes);
// app.use('/search', SearchRoutes);



// // ✅ MongoDB connect
// mongoose.connect(process.env.MongoDBUrl)
//   .then(() => console.log('✅ MongoDB is connected'))
//   .catch((e) => console.log('❌ MongoDB connection error:', e));

// // ❌ Do not use app.listen() in Vercel
// module.exports = app;


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

// // ✅ Middlewares
// app.use(express.json());
// app.use(cookieParser());

// // ✅ CORS for local frontend
// app.use(cors({
//   origin: "http://localhost:5173", // Your local frontend
//   credentials: true
// }));

// // ✅ Static uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ API Routes
// app.use('/', routes);
// app.use('/api', sellerRoutes); 
// app.use('/User', userRoutes);
// app.use('/search', SearchRoutes);

// // ✅ MongoDB connect
// mongoose.connect(process.env.MongoDBUrl)
//   .then(() => console.log('✅ MongoDB is connected'))
//   .catch((e) => console.log('❌ MongoDB connection error:', e));

// // ✅ Start local server
// const PORT = process.env.PORT 
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });



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

// // ✅ Middlewares
// app.use(express.json());
// app.use(cookieParser());

// // ✅ CORS for both local & production
// app.use(cors({
//   origin: [
//     process.env.FRONTEND_URL || "http://localhost:5173",
//     "https://yourfrontend.vercel.app"
//   ],
//   credentials: true
// }));

// // ✅ Static uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ API Routes
// app.use('/', routes);
// app.use('/api', sellerRoutes);
// app.use('/User', userRoutes);
// app.use('/search', SearchRoutes);

// // ✅ MongoDB connect
// mongoose.connect(process.env.MongoDBUrl)
//   .then(() => console.log('✅ MongoDB is connected'))
//   .catch((e) => console.log('❌ MongoDB connection error:', e));

// module.exports = app;



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');

// Routes
const routes = require('./src/Routes/Routes');
const sellerRoutes = require('./src/Routes/SellerRoutes');
const userRoutes = require('./src/Routes/UserRoutes');
const SearchRoutes = require('./src/Routes/SearchRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS setup: allow your frontend(s)
const allowedOrigins = [
  'https://ashu-fronted.vercel.app/', // Production frontend URL (no trailing slash)
  'http://localhost:3000',            // Local frontend URL for development
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Static file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', routes);
app.use('/api/seller', sellerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/search', SearchRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ MongoDB is connected'))
  .catch((e) => console.log('❌ MongoDB connection error:', e));

// Listen on PORT from env or default 5005
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
