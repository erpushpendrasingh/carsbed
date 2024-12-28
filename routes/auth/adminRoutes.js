const express = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const {
 addCarToUser,
 approveVendor,
 setVendorLimitations,
 deleteCarFromUser,
 getAllCars,
} = require("../../controller/auth/adminController");
const { authorizeRoles } = require("../../middleware/auth.middleware");

const adminRouter = express.Router();

// Route accessible by both user and admin
adminRouter.post("/add-car", authenticate, addCarToUser);

// Admin-specific routes
adminRouter.post(
 "/delete-car",
 authenticate,
 authorizeRoles("admin"),
 deleteCarFromUser
);
adminRouter.post(
 "/set-vendor-limitations",
 authenticate,
 authorizeRoles("admin"),
 setVendorLimitations
);
adminRouter.post(
 "/approve-vendor",
 authenticate,
 authorizeRoles("admin"),
 approveVendor
);

// Route to get all cars for a user
adminRouter.get("/get-cars", authenticate, getAllCars);

module.exports = adminRouter;
