const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
 categoryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true,
 },
 subCategoryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "SubCategory",
  required: true,
 },
 productName: {
  type: String,
  required: true,
  unique: true,
  lowercase: true, // Convert to lowercase before saving
 },
 productImage: { type: String, required: true },
 productBannerImages: [{ type: String }], // Changed to an array
 highlights: [
  {
   text: String,
   icon: String,
  },
 ],
 tags: [
  {
   name: String,
   value: String,
  },
 ],
 offerTag: [
  {
   name: String,
   value: String,
  },
 ],
 //  discountPercent: String,
 includedService: [
  {
   name: String,
   services: [
    {
     title: String,
     image: String,
    },
   ],
  },
 ],
 isTrending: { type: Boolean, default: false },
 additionalServices: [String],
 stepsAfterBooking: [String],
 ratings: { type: String },
 dummyPriceMrp: { type: String },
 dummyPriceActual: { type: String },
 maxQuantity: { type: Number, default: 1 },
});

productSchema.index({ productName: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
