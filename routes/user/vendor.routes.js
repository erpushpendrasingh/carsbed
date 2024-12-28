const express = require("express");
const {
 addMobileAndSendOtp,
 verifyOtpAndUpdateMobile,
 updateVendorDetails,
 loginVendor,
 getAllVendor,
 approveOrRejectVendor,
 updateVendorStatus,
 setBookingCaps,
} = require("../../controller/userControllers/vendor.controller");

const vendorRoutes = express.Router();

vendorRoutes.get("/", getAllVendor);
vendorRoutes.post("/request-otp", addMobileAndSendOtp);
vendorRoutes.post("/verify-otp", verifyOtpAndUpdateMobile);
vendorRoutes.patch("/updateVendorDetails", updateVendorDetails);
vendorRoutes.post("/login", loginVendor);
vendorRoutes.post("/approve-reject-vendor", approveOrRejectVendor);
vendorRoutes.post("/update-vendor-status", updateVendorStatus);
vendorRoutes.post("/set-booking-caps", setBookingCaps);

module.exports = vendorRoutes;

// const express = require('express');
// const { addMobileAndSendOtp, verifyOtpAndUpdateMobile, updateVendorDetails, loginVendor, getAllVendor } = require('../controller/vendor.controller');
// const router = express.Router();

// router.get('/', getAllVendor);
// router.post('/request-otp', addMobileAndSendOtp);
// router.post('/verify-otp', verifyOtpAndUpdateMobile);
// router.patch("/updateVendorDetails", updateVendorDetails); // Protected route for admin only
// router.post("/login", loginVendor);

// module.exports = router;
