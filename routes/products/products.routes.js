const express = require("express");
const {
 getAllProducts,
 getProductById,
 createProduct,
 updateProduct,
 deleteProduct,
 getTrendingServices,
} = require("../../controller/products-categories/product.controller");
const router = express.Router();

// Get all products
router.get("/", getAllProducts);
router.get("/trending", getTrendingServices);


// Get product by ID
router.get("/:id", getProductById);

// Create a new product
router.post("/", createProduct);

// Update a product
router.patch("/:id", updateProduct);

// Delete a product
router.delete("/:id", deleteProduct);


module.exports = router;
