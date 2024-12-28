// routes/variantRoutes.js
const express = require("express");
const {
 getAllVariants,
 getVariantById,
 createVariant,
 updateVariantById,
 deleteVariantById,
} = require("./variants");
const router = express.Router();

// GET all variants
router.get("/", getAllVariants);

// GET a single variant by ID
router.get("/:id", getVariantById);

// POST create a new variant
router.post("/", createVariant);

// PUT update a variant by ID
router.put("/:id", updateVariantById);

// DELETE delete a variant by ID
router.delete("/variants/:id", deleteVariantById);

module.exports = router;
