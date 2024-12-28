// controllers/sparePartController.js
// const SparePartPrice = require("../models/sparePartPrice");

const SparePart = require("../../model/products/sparePart");
const SparePartPrice = require("../../model/products/SparePartPrice");
exports.createSparePartPrice = async (req, res) => {
 try {
  const { carIds, sparePartId, prices } = req.body;

  // Assuming that carIds and prices arrays have a one-to-one correspondence
  if (carIds.length !== prices.length) {
   return res.status(400).json({
    success: false,
    error: "Mismatch between number of car IDs and prices provided",
   });
  }

  // Create or update prices for each car ID and its respective variant
  const pricePromises = carIds.map((carId, index) => {
   const { variant, transmission, mrp, price, discount } = prices[index];
   return SparePartPrice.findOneAndUpdate(
    { carId, sparePartId, variant, transmission },
    { mrp, price, discount },
    { upsert: true, new: true }
   );
  });

  // Await all of them
  const results = await Promise.all(pricePromises);
  res.status(201).json({ success: true, data: results });
 } catch (error) {
  console.error("Error setting prices for spare parts:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to set prices for spare parts" });
 }
};

// exports.createSparePartPrice = async (req, res) => {
//  try {
//   const { carIds, sparePartId, prices } = req.body;

//   // Create or update prices for each car ID and its respective variant
//   const pricePromises = carIds.map((carId) => {
//    return prices.map(({ variant, transmission, mrp, price, discount }) => {
//     return SparePartPrice.findOneAndUpdate(
//      { carId, sparePartId, variant, transmission },
//      { mrp, price, discount },
//      { upsert: true, new: true }
//     );
//    });
//   });

//   // Flatten the array of promises and await all of them
//   const results = await Promise.all(pricePromises.flat());
//   res.status(201).json({ success: true, data: results });
//  } catch (error) {
//   console.error("Error setting prices for spare parts:", error);
//   res
//    .status(500)
//    .json({ success: false, error: "Failed to set prices for spare parts" });
//  }
// };
// controllers/sparePartPriceController.js

exports.getSparePartPrices = async (req, res) => {
 try {
  const { sparePartId } = req.params;

  const prices = await SparePartPrice.find({ sparePartId }).populate("carId");

  res.status(200).json({ success: true, data: prices });
 } catch (error) {
  console.error("Error fetching spare part prices:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to fetch spare part prices" });
 }
};
// controllers/sparePartController.js

exports.getSparePartPricesAll = async (req, res) => {
 try {
  const sparePartPrices = await SparePartPrice.find()
   .populate({
    path: "carId", // Path to populate
    select: "_id title", // Select only the car ID and title
   }) // Populates the carId with carModelName from Car model
   .populate({
    path: "sparePartId",
    select: "spareName SubCategory", // Populates spareName and SubCategory from SparePart model
    populate: {
     path: "SubCategory",
     select: "_id subCategoryName", // Populates both _id and subCategoryName from SubCategory model
    },
   });

  res.status(200).json({ success: true, data: sparePartPrices });
 } catch (error) {
  console.error("Error fetching spare part prices:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to fetch spare part prices" });
 }
};
// exports.getSparePartPricesAll = async (req, res) => {
//  try {
//   // Populate the carId and sparePartId fields with relevant data from the Car and SparePart models
//   const prices = await SparePartPrice.find()
//  .populate({
//   path: "carId", // Path to populate
//   select: "_id title", // Select only the car ID and title
//  })
//    .populate({
//     path: "sparePartId", // Path to populate
//     select: "_id spareName", // Select only the spare part ID and name
//    });

//   console.log("prices:", prices);

//   res.status(200).json({ success: true, data: prices });
//  } catch (error) {
//   console.error("Error fetching spare part prices:", error);
//   res
//    .status(500)
//    .json({ success: false, error: "Failed to fetch spare part prices" });
//  }
// };

// exports.getSparePartPricesAll = async (req, res) => {
//  try {
//   const prices = await SparePartPrice.find();
//   console.log("prices:", prices);
//   res.status(200).json({ success: true, data: prices });
//  } catch (error) {
//   console.error("Error fetching spare part prices:", error);
//   res
//    .status(500)
//    .json({ success: false, error: "Failed to fetch spare part prices" });
//  }
// };

// controllers/sparePartPriceController.js

exports.updateSparePartPrice = async (req, res) => {
 try {
  const { priceId } = req.params;
  const { mrp, price } = req.body;

  const updatedPrice = await SparePartPrice.findByIdAndUpdate(
   priceId,
   { mrp, price },
   { new: true }
  );

  if (!updatedPrice) {
   return res.status(404).json({ success: false, error: "Price not found" });
  }

  res.status(200).json({ success: true, data: updatedPrice });
 } catch (error) {
  console.error("Error updating spare part price:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to update spare part price" });
 }
};
// controllers/sparePartPriceController.js

exports.deleteSparePartPrice = async (req, res) => {
 try {
  const { priceId } = req.params;

  const deletedPrice = await SparePartPrice.findByIdAndDelete(priceId);

  if (!deletedPrice) {
   return res.status(404).json({ success: false, error: "Price not found" });
  }

  res.status(200).json({ success: true, data: deletedPrice });
 } catch (error) {
  console.error("Error deleting spare part price:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to delete spare part price" });
 }
};
exports.getSpareProductsByCarId = async (req, res) => {
  try {
    // const { carId } = req.query;
    const { carId } = req.params;

    // Fetch all spare parts
    const spareParts = await SparePart.find().populate("SubCategory");

    if (!spareParts.length) {
      return res.status(404).json({ message: "No spare parts found." });
    }

    // Fetch car-specific prices for the given carId
    const carPrices = await SparePartPrice.find({ carId });

    const sparePartsWithPrices = spareParts.map((sparePart) => {
      const carPrice = carPrices.find(
        (price) => price.sparePartId.toString() === sparePart._id.toString()
      );

      // If a car-specific price exists, use it; otherwise, use the default spare part price
      return {
        ...sparePart.toObject(),
        price: carPrice ? carPrice.price : sparePart.price,
        mrp: carPrice ? carPrice.mrp : sparePart.mrp,
        discount: carPrice ? carPrice.discount : 0,
      };
    });

    res.status(200).json(sparePartsWithPrices);
  } catch (error) {
    console.error("Error fetching spare parts by carId:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// exports.getSpareProductsByCarId = async (req, res) => {
//  try {
//   const { subCategoryId } = req.params;
//   const { carId } = req.query;

//   // Fetch spare parts by subCategory ID
//   const spareParts = await SparePart.find({
//    SubCategory: subCategoryId,
//   }).populate("SubCategory");

//   if (!spareParts.length) {
//    return res
//     .status(404)
//     .json({ message: "No spare parts found for this subCategory." });
//   }

//   // Fetch car-specific prices for the given carId
//   const carPrices = await SparePartPrice.find({ carId });

//   const sparePartsWithPrices = spareParts.map((sparePart) => {
//    const carPrice = carPrices.find(
//     (price) => price.sparePartId.toString() === sparePart._id.toString()
//    );

//    // If a car-specific price exists, use it; otherwise, use the default spare part price
//    return {
//     ...sparePart.toObject(),
//     price: carPrice ? carPrice.price : sparePart.price,
//     mrp: carPrice ? carPrice.mrp : sparePart.mrp,
//     discount: carPrice ? carPrice.discount : 0,
//    };
//   });

//   res.status(200).json(sparePartsWithPrices);
//  } catch (error) {
//   console.error("Error fetching spare parts by subCategory:", error);
//   res.status(500).json({ message: "Internal server error." });
//  }
// };
