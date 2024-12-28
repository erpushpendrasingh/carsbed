const express = require("express");
const {
 sendOtp,
 verifyOtp,
 loginVendorWithEmail,
 loginAdmin,
} = require("../../controller/auth/authController");

const authRouter = express.Router();

// Common routes for users and vendors to send OTP and verify OTP
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);

// Vendor-specific route for email/password login
authRouter.post("/vendor/login", loginVendorWithEmail);

// Admin-specific route for email/password login
authRouter.post("/admin/login", loginAdmin);

module.exports = authRouter;
