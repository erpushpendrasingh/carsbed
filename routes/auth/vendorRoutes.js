const express = require("express");
const {
 authenticate,
 authorizeRoles,
} = require("../../middleware/auth.middleware");
const {
 uploadVendorDocument,
 approveOrRejectVendor,
} = require("../../controller/auth/vendorController");

const vendorRouter = express.Router();

// Vendor document upload
vendorRouter.post(
 "/upload-document",
 authenticate,
 authorizeRoles("vendor"),
 uploadVendorDocument
);

// Admin approving or rejecting a vendor
vendorRouter.post(
 "/approve-reject",
 authenticate,
 authorizeRoles("admin"),
 approveOrRejectVendor
);

module.exports = vendorRouter;
