// controllers/sparePartController.js
const SparePart = require("../../model/products/sparePart");

// controllers/sparePartController.js

exports.createSparePart = async (req, res) => {
 const { spareName, price, mrp, image, subCategoryId, highlights } = req.body;

 try {
  // Check if a spare part with the same name already exists
  const existingSparePart = await SparePart.findOne({ spareName });

  if (existingSparePart) {
   return res.status(400).json({ error: "Spare part already exists" });
  }

  const newSparePart = new SparePart({
   spareName,
   price,
   mrp,
   image,
   SubCategory: subCategoryId,
   highlights,
  });

  await newSparePart.save();
  res.status(201).json(newSparePart);
 } catch (err) {
  console.error("Error creating spare part:", err);
  res.status(500).json({ error: err.message });
 }
};

exports.updateSparePart = async (req, res) => {
 const { id } = req.params;
 const { spareName, price, mrp, image, subCategoryId, highlights } = req.body;

 try {
  const updateData = {
   spareName,
   price,
   mrp,
   image,
   subCategoryId,
   highlights,
  };

  const updatedSparePart = await SparePart.findByIdAndUpdate(id, updateData, {
   new: true,
  });

  res.status(200).json(updatedSparePart);
 } catch (err) {
  console.error("Error updating spare part:", err);
  res.status(500).json({ error: err.message });
 }
};

exports.deleteSparePart = async (req, res) => {
 try {
  const { id } = req.params;
  await SparePart.findByIdAndDelete(id);
  res.status(200).json({ message: "Spare part deleted successfully" });
 } catch (err) {
  console.error("Error deleting spare part:", err);
  res.status(500).json({ error: err.message });
 }
};

exports.getSpareParts = async (req, res) => {
 try {
  const spareParts = await SparePart.find().sort({
   createdAt: -1,
   spareName: 1,
  });
  res.status(200).json(spareParts);
 } catch (err) {
  console.error("Error fetching spare parts:", err);
  res.status(500).json({ error: err.message });
 }
};

exports.getSparePartById = async (req, res) => {
 try {
  const { id } = req.params;
  const sparePart = await SparePart.findById(id);
  if (!sparePart) {
   return res.status(404).json({ message: "Spare part not found" });
  }
  res.status(200).json(sparePart);
 } catch (err) {
  console.error("Error fetching spare part:", err);
  res.status(500).json({ error: err.message });
 }
};
