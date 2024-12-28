// controllers/variantController.js
const Variant = require("./models.variant");

// Get all variants
const getAllVariants = async (req, res, next) => {
 try {
  const variants = await Variant.find();
  res.json(variants);
 } catch (err) {
  next(err);
 }
};

const getVariantById = async (req, res, next) => {
 const { id } = req.params;

 try {
  const variant = await Variant.findById(id);
  if (!variant) {
   return res.status(404).json({ message: "Variant not found" });
  }
  res.json(variant);
 } catch (err) {
  next(err);
 }
};

const createVariant = async (req, res, next) => {
 const { car, fuelType, transmissionType, price } = req.body;

 try {
  const newVariant = new Variant({ car, fuelType, transmissionType, price });
  const savedVariant = await newVariant.save();
  res.status(201).json(savedVariant);
 } catch (err) {
  next(err);
 }
};

const updateVariantById = async (req, res, next) => {
 const { id } = req.params;
 const { car, fuelType, transmissionType, price } = req.body;

 try {
  const variant = await Variant.findByIdAndUpdate(
   id,
   { car, fuelType, transmissionType, price },
   { new: true }
  );
  if (!variant) {
   return res.status(404).json({ message: "Variant not found" });
  }
  res.json(variant);
 } catch (err) {
  next(err);
 }
};

const deleteVariantById = async (req, res, next) => {
 const { id } = req.params;

 try {
  const deletedVariant = await Variant.findByIdAndDelete(id);
  if (!deletedVariant) {
   return res.status(404).json({ message: "Variant not found" });
  }
  res.json({ message: "Variant deleted successfully" });
 } catch (err) {
  next(err);
 }
};

module.exports = {
 getAllVariants,
 getVariantById,
 createVariant,
 updateVariantById,
 deleteVariantById,
};
