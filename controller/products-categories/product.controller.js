const Product = require("../../model/products/product.model");
const SparePart = require("../../model/products/sparePart");

// Get all products
exports.getAllProducts = async (req, res) => {
 try {
  const products = await Product.find()
   .populate("categoryId")
   .populate("subCategoryId");
  res.status(200).json(products);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

// Get product by ID
exports.getProductById = async (req, res) => {
 try {
  const product = await Product.findById(req.params.id)
   .populate("categoryId")
   .populate("subCategoryId");
  if (!product) {
   return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json(product);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

// Create a new product
exports.createProduct = async (req, res) => {
 try {
  // Check if a product with the same name already exists (case-insensitive)
  const existingProduct = await Product.findOne({
   productName: req.body.productName.toLowerCase(),
  });
  if (existingProduct) {
   return res
    .status(400)
    .json({ message: "Product with this name already exists" });
  }

  // Create and save the new product
  const product = new Product({
   ...req.body,
   productName: req.body.productName.toLowerCase(), // Ensure the name is saved in lowercase
  });
  // console.log("product:", product);
  const newProduct = await product.save();
  res.status(201).json(newProduct);
 } catch (error) {
  if (error.code === 11000) {
   // Duplicate key error code
   res.status(400).json({ message: "Product with this name already exists" });
  } else {
   res.status(400).json({ message: error.message });
  }
 }
};

// Update a product
exports.updateProduct = async (req, res) => {
 try {
  // Convert product name to lowercase
  if (req.body.productName) {
   req.body.productName = req.body.productName.toLowerCase();
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
   new: true,
   runValidators: true,
  });
  if (!product) {
   return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json(product);
 } catch (error) {
  if (error.code === 11000) {
   // Duplicate key error code
   res.status(400).json({ message: "Product with this name already exists" });
  } else {
   res.status(400).json({ message: error.message });
  }
 }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
 try {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
   return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ message: "Product deleted" });
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};
exports.getTrendingServices = async (req, res) => {
 try {
  // Fetch trending products
  const trendingProducts = await Product.find({
   $or: [{ isTrending: true }, { trendingScore: { $gt: 0 } }],
  }).select("productName productImage trendingScore dummyPriceActual");

  // Fetch trending spare parts
  const trendingSpareParts = await SparePart.find({
   $or: [{ isTrending: true }, { trendingScore: { $gt: 0 } }],
  }).select("spareName image trendingScore dummyPriceActual");

  // Combine both results
  const combinedTrendingServices = [...trendingProducts, ...trendingSpareParts];

  if (combinedTrendingServices.length === 0) {
   return res.status(404).json({ message: "No trending services found" });
  }

  res.status(200).json(combinedTrendingServices);
 } catch (error) {
  res.status(500).json({ error: "Server error", details: error.message });
 }
};
