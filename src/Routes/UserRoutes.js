const express = require ("express");
const router = express.Router();

const {createUser , VerifUserOTP , LoginUser , requestPasswordReset , resetPassword , changePassword , checkUserAuthController , LogoutUser} = require('../User/UserController.js');
const { getUserOrders , getReadyOrders } = require("../Controller/OrderController.js");
const VerifyUser = require('../Middleware/VerifyUser.js')
const {getUserProfile , changeEmail , deleteAccount , resetPasswordEmail , sendResetOtp , verifyResetOtp , ResendOtp  } = require('../Controller/PublicController.js')



router.post('/createUser' , createUser)
router.post('/verifyOtp/:id' , VerifUserOTP)
router.post('/login' , LoginUser)
router.get('/Orders' , VerifyUser , getUserOrders)
router.get('/orders/ready' , VerifyUser , getReadyOrders)
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:id", resetPassword);
router.post("/change-password",  VerifyUser ,changePassword);

router.post('/forgot-password/send-otp', sendResetOtp);
router.post('/forgot-password/verify-otp', verifyResetOtp );
router.post('/forgot-password/reset-password',resetPasswordEmail);
router.post('/forgot-password/resend-otp',ResendOtp);

router.get("/profile", VerifyUser, getUserProfile);
router.patch('/change-email' , VerifyUser , changeEmail);
router.patch('/delete-account', VerifyUser, deleteAccount);


router.get("/check-auth",   checkUserAuthController);
router.post("/logout", LogoutUser);




module.exports = router;