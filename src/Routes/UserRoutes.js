const express = require ("express");
const router = express.Router();

const {createUser , VerifUserOTP , LoginUser , requestPasswordReset , resetPassword , changePassword , checkUserAuthController , LogoutUser} = require('../User/UserController');
const { getUserOrders , getReadyOrders } = require("../Controller/OrderController");
const VerifyUser = require('../Middleware/VerifyUser')
const {getUserProfile , changeEmail , deleteAccount , resetPasswordEmail , sendResetOtp , verifyResetOtp , ResendOtp  } = require('../Controller/PublicController')



router.post('/User/createUser' , createUser)
router.post('/User/verifyOtp/:id' , VerifUserOTP)
router.post('/User/Login' , LoginUser)
router.get('/User/Orders' , VerifyUser , getUserOrders)
router.get('/orders/ready' , VerifyUser , getReadyOrders)
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:id", resetPassword);
router.post("/change-password",  VerifyUser ,changePassword);

router.post('/forgot-password/send-otp', sendResetOtp);
router.post('/forgot-password/verify-otp', verifyResetOtp );
router.post('/forgot-password/reset-password',resetPasswordEmail);
router.post('/forgot-password/resend-otp',ResendOtp);

router.get("/user/profile", VerifyUser, getUserProfile);
router.patch('/change-email' , VerifyUser , changeEmail);
router.patch('/delete-account', VerifyUser, deleteAccount);


router.get("/check-auth", VerifyUser ,  checkUserAuthController);
router.post("/user/logout", LogoutUser);




module.exports = router;