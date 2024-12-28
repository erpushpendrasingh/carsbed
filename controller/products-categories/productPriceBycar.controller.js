const Product = require("../../model/products/product.model");
const CarPrice = require("../../model/products/productPriceBycar.model");

// Create or update car prices for a product
exports.createCarPrice = async (req, res) => {
 try {
  const { carIds, productId, prices } = req.body;

  const pricePromises = carIds.map((carId) => {
   const { variant, transmission, mrp, givenPrice } = prices.find(
    (price) => price.carId === carId
   );
   return CarPrice.findOneAndUpdate(
    { carId, productId, variant, transmission },
    { mrp, givenPrice },
    { upsert: true, new: true }
   );
  });

  const results = await Promise.all(pricePromises);
  res.status(201).json({ success: true, data: results });
 } catch (error) {
  console.error("Error setting prices for cars:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to set prices for cars" });
 }
};
exports.getAllCarPrices = async (req, res) => {
 try {
  const carPrices = await CarPrice.find()
   .populate({
    path: "productId",
    select: "productName subCategoryId", // Include subCategoryId
    populate: { path: "subCategoryId", select: "subCategoryName" }, // Populate subCategoryId
   })
   .populate({ path: "carId", select: "title" });

  console.log("carPrices:", carPrices);
  res.status(200).json(carPrices);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

// exports.getAllCarPrices = async (req, res) => {
//  try {
//   const carPrices = await CarPrice.find()
//    .populate({ path: "productId", select: "productName" })
//    .populate({ path: "carId", select: "title" });
//   console.log("carPrices:", carPrices);
//   res.status(200).json(carPrices);
//  } catch (err) {
//   res.status(500).json({ error: err.message });
//  }
// };

// Get products by car ID

exports.getProductsByCarId = async (req, res) => {
 try {
  const carId = req.params.id;

  const carPrices = await CarPrice.find({ carId }).populate("productId carId");

  if (!carPrices.length) {
   return res.status(404).json({ message: "No products found for this car." });
  }

  res.json(carPrices);
 } catch (error) {
  console.error("Error fetching products by car ID:", error);
  res.status(500).json({ message: "Internal server error." });
 }
};

// Get car price by ID
exports.getCarPriceById = async (req, res) => {
 try {
  const carPrice = await CarPrice.findById(req.params.id).populate(
   "productId carId"
  );

  if (!carPrice) {
   return res.status(404).json({ message: "Car price not found." });
  }

  res.json(carPrice);
 } catch (error) {
  console.error("Error fetching car price by ID:", error);
  res.status(500).json({ message: "Internal server error." });
 }
};

// Update car price
exports.updateCarPrice = async (req, res) => {
 try {
  const { productId, carId, variant, transmission, mrp, givenPrice } = req.body;

  const updatedCarPrice = await CarPrice.findByIdAndUpdate(
   req.params.id,
   {
    productId,
    carId,
    variant,
    transmission,
    mrp,
    givenPrice,
   },
   { new: true }
  ).populate("productId carId");

  if (!updatedCarPrice) {
   return res.status(404).json({ message: "Car price not found." });
  }

  res.json(updatedCarPrice);
 } catch (error) {
  console.error("Error updating car price:", error);
  res.status(500).json({ message: "Internal server error." });
 }
};

// Delete car price
exports.deleteCarPrice = async (req, res) => {
 try {
  const deletedCarPrice = await CarPrice.findByIdAndDelete(req.params.id);

  if (!deletedCarPrice) {
   return res.status(404).json({ message: "Car price not found." });
  }

  res.json({ message: "Car price deleted successfully." });
 } catch (error) {
  console.error("Error deleting car price:", error);
  res.status(500).json({ message: "Internal server error." });
 }
};

exports.getProductsBySubCategory = async (req, res) => {
 try {
  const { subCategoryId } = req.params;
  const { carId } = req.query; // Assuming carId is passed as a query parameter
  console.log("carId:", carId);
  // Fetch products by subCategory ID
  const products = await Product.find({ subCategoryId })
   //  .populate("categoryId")
   .populate("subCategoryId");

  if (!products.length) {
   return res
    .status(404)
    .json({ message: "No products found for this subCategory." });
  }

  // Fetch car prices for the given carId
  const carPrices = await CarPrice.find({ carId });

  const productsWithPrices = products.map((product) => {
   const carPrice = carPrices.find(
    (price) => price.productId.toString() === product._id.toString()
   );

   // If a car-specific price exists, use it; otherwise, use the default product price
   return {
    ...product.toObject(),
    price: carPrice ? carPrice.givenPrice : product.dummyPriceActual,
    mrp: carPrice ? carPrice.mrp : product.dummyPriceMrp,
   };
  });

  res.status(200).json(productsWithPrices);
 } catch (error) {
  console.error("Error fetching products by subCategory:", error);
  res.status(500).json({ message: "Internal server error." });
 }
};
