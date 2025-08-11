// const express = require('express');
// const router = express.Router();
// const { createSeller , loginSeller , getDashboard} = require('../Controller/SellerController')
// const verifySeller = require('../Middleware/verifySeller');

// const {
//   addProduct, getMyProducts, updateProduct, deleteProduct,
//   updateProfile, logout , togglePublish ,getPublicProducts 
// } = require('../Controller/sellerProductController');

// const { getMyOrders , placeOrder , updateOrderStatus } = require('../Controller/OrderController');

// router.post('/product', verifySeller, addProduct);
// router.get('/products', verifySeller, getMyProducts);
// router.put('/product/:id', verifySeller, updateProduct);
// router.delete('/product/:id', verifySeller, deleteProduct);
// router.patch('/product/:id/toggle-publish', verifySeller, togglePublish);
// router.get('/public-products', getPublicProducts); // Public products for buyers

// router.get('/orders', verifySeller, getMyOrders);


// router.post('/orders', placeOrder);

// router.put('/order-status/:orderId', verifySeller, updateOrderStatus);

// router.put('/profile', verifySeller, updateProfile);
// router.post('/logout', verifySeller, logout);



// router.post('/signup', createSeller);
// router.post('/login', loginSeller);
// router.get('/dashboard', verifySeller, getDashboard);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const upload = require('../Middleware/Upload');
// const  verifySeller  = require('../Middleware/verifySeller');
// const {
//   addProduct,
//   getMyOrders,
//   updateOrderStatus
// } = require('../Controller/OrderController');

// const {addShop} = require('../Controller/SellerController')


// const { getAllPublicProducts, placeOrder, getPublicShops, getProductsByShop } = require('../Controller/PublicController');

// router.get('/public-products', getAllPublicProducts);
// router.post('/orders', placeOrder);
// router.get('/public-shops', getPublicShops);
// router.get('/shop-products/:id', getProductsByShop);

// router.post('/product', verifySeller, upload.single('image'), addProduct);
// router.get('/orderss', verifySeller, getMyOrders);
// router.put('/order/:id/status', verifySeller, updateOrderStatus);


// router.post('/add-shop', upload.single('shopImage'), addShop);
// module.exports = router;


const express = require('express');
const router = express.Router();
const PublicCtrl = require('../Controller/PublicController');
const OrderCtrl = require('../Controller/OrderController');
const cartController = require('../Controller/CartController')
const VerifyUser = require('../Middleware/VerifyUser')
const FooterCtrl = require('../Controller/FooterController');

router.get('/public-products', PublicCtrl.getAllPublicProducts);
router.get('/public-shops', PublicCtrl.getPublicShops);
router.get('/shop-products/:id', PublicCtrl.getProductsByShop);

router.post('/orders', VerifyUser , OrderCtrl.placeOrder);
router.post('/Rorder' , VerifyUser , cartController.ROrder);
router.post('/ContactUs', FooterCtrl.contactUsController);
 


router.post('/cart', cartController.addToCart);
router.get('/cart/:shopId' , cartController.getCartByShop)
router.put("/cart/increase/:id", cartController.increaseCartQty);
router.put("/cart/decrease/:id",  cartController.decreaseCartQty);

// router.get('/cart/:shopId', cartController.getCart);
// router.delete('/cart/:shopId', cartController.clearCart);
// router.post('/cart/placeorder', cartController.placeOrder);
 
module.exports = router;