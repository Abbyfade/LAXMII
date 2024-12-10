const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");



router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);
router.post("/login", authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post("/logout", authController.logout);
router.post("/get-access-token", authController.refreshToken),

module.exports = router;
