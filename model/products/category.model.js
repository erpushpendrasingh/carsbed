const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
 {
  tag: { type: String },
  variantType: { type: String, required: true },
  categoryName: { type: String, required: true },
  categoryImage: { type: String, required: true },
 },
 {
  timestamps: true,
 }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
