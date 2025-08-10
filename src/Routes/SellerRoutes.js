const express = require('express');
const router = express.Router();
const upload = require('../Middleware/Upload');
const VerifySeller = require('../Middleware/verifySeller')

const SellerCtrl = require('../Controller/SellerController');
const ProductCtrl = require('../Controller/PublicController');
const OrderCtrl = require('../Controller/OrderController');
const sellerProductCtrl = require('../Controller/sellerProductController');

router.post('/api/signup', SellerCtrl.createSeller);
router.post('/api/login', SellerCtrl.loginSeller);
router.get('/api/dashboard', VerifySeller, SellerCtrl.getDashboard);
router.post('/api/logout', VerifySeller, ProductCtrl.logout);
router.put('/api/profile', VerifySeller, sellerProductCtrl.updateProfile);
router.get("/api/shop-products/:sellerId", VerifySeller, sellerProductCtrl.getMyProducts);

router.post('/api/add-shop', upload.single('shopImage'), SellerCtrl.addShop);

router.post('/api/product', VerifySeller, upload.single('image'), sellerProductCtrl.addProduct);
router.get('/api/products', VerifySeller, sellerProductCtrl.getMyProducts);
router.put('/api/product/:id', VerifySeller, upload.single("image"), sellerProductCtrl.updateProduct);
router.delete('/api/product/:id', VerifySeller, sellerProductCtrl.deleteProduct);
router.patch('/api/product/:id/toggle-publish', VerifySeller, sellerProductCtrl.togglePublish);

router.get('/api/orders', VerifySeller, OrderCtrl.getMyOrders);
router.get('/api/readyOrder/:id', VerifySeller, OrderCtrl.getMyReadyOrders);
router.put('/api/readyOrder/:id', VerifySeller, OrderCtrl.updateReadyOrderStatus);
router.put('/api/order-status/:id', VerifySeller, OrderCtrl.updateOrderStatus);

router.patch('/shops/status', VerifySeller , SellerCtrl.updateShopStatus);
router.put('/api/product/stock/:id', VerifySeller, sellerProductCtrl.updateStock);

router.get("/Seller/profile", VerifySeller, SellerCtrl.getSellerProfile);

router.get('/api/public-products', sellerProductCtrl.getPublicProducts);

router.get('/seller/revenue', VerifySeller, OrderCtrl.getRevenueStats);

router.post("/seller/request-otp", SellerCtrl.requestSellerOTP);
router.post("/seller/verify-otp", SellerCtrl.verifySellerOTP);
router.post("/seller/reset-password", SellerCtrl.resetSellerPassword);
router.get("/check-seller-token", VerifySeller, SellerCtrl.checkSellerToken);



// router.post('/api/orders', OrderCtrl.placeOrder);

module.exports = router;
