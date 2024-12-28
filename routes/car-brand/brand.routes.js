const express = require("express");
const {
 createBrandWithImage,
 getAllBrands,
 getBrandById,
 updateBrand,
 deleteBrand,
 bulkInsertBrands,
} = require("../../controller/brand-car/brand.controller");
const { uploadSingle, uploadBulk } = require("../../middleware/upload/upload");
// const { uploadSingle, uploadBulk } = require("../../middleware/upload");

const router = express.Router();

// CRUD Operations with single upload support
router.post("/", uploadSingle, createBrandWithImage); // Create single brand with image
router.get("/", getAllBrands); // Get all brands
router.get("/:id", getBrandById); // Get single brand by ID
router.patch("/:id", uploadSingle, updateBrand); // Update single brand by ID with image upload
router.delete("/:id", deleteBrand); // Delete single brand by ID

router.post("/bulk", uploadBulk, bulkInsertBrands); // Bulk insert brands from Excel

module.exports = router;
