const express = require('express');
const router = express.Router();
const upload = require('../Middleware/Upload.js');
const VerifySeller = require('../Middleware/verifySeller.js')

const SellerCtrl = require('../Controller/SellerController.js');
const ProductCtrl = require('../Controller/PublicController.js');
const OrderCtrl = require('../Controller/OrderController.js');
const sellerProductCtrl = require('../Controller/sellerProductController.js');

router.post('/signup', SellerCtrl.createSeller);
router.post('/login', SellerCtrl.loginSeller);
router.get('/dashboard', VerifySeller, SellerCtrl.getDashboard);
router.post('/logout', VerifySeller, ProductCtrl.logout);
router.put('/profile', VerifySeller, sellerProductCtrl.updateProfile);
router.get("/shop-products/:sellerId", VerifySeller, sellerProductCtrl.getMyProducts);

router.post('/add-shop', upload.single('shopImage'), SellerCtrl.addShop);

router.post('/product', VerifySeller, upload.single('image'), sellerProductCtrl.addProduct);
router.get('/products', VerifySeller, sellerProductCtrl.getMyProducts);
router.put('/product/:id', VerifySeller, upload.single("image"), sellerProductCtrl.updateProduct);
router.delete('/product/:id', VerifySeller, sellerProductCtrl.deleteProduct);
router.patch('/product/:id/toggle-publish', VerifySeller, sellerProductCtrl.togglePublish);

router.get('/orders/:id', VerifySeller, OrderCtrl.getMyOrders);
router.get('/readyOrder/:id', VerifySeller, OrderCtrl.getMyReadyOrders);
router.put('/readyOrder/:id', VerifySeller, OrderCtrl.updateReadyOrderStatus);
router.put('/order-status/:id', VerifySeller, OrderCtrl.updateOrderStatus);

router.patch('/shops/status', VerifySeller , SellerCtrl.updateShopStatus);
router.put('/product/stock/:id', VerifySeller, sellerProductCtrl.updateStock);

router.get("/Seller/profile", VerifySeller, SellerCtrl.getSellerProfile);

router.get('/public-products', sellerProductCtrl.getPublicProducts);

router.get('/revenue', VerifySeller, OrderCtrl.getRevenueStats);

router.post("/seller/request-otp", SellerCtrl.requestSellerOTP);
router.post("/seller/verify-otp", SellerCtrl.verifySellerOTP);
router.post("/seller/reset-password", SellerCtrl.resetSellerPassword);
router.get("/check-seller-token", VerifySeller, SellerCtrl.checkSellerToken);



// router.post('/orders', OrderCtrl.placeOrder);

module.exports = router;
   