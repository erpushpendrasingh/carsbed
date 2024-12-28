const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
 productId: {
  type: mongoose.Schema.Types.ObjectId,
  refPath: "type", // Dynamic reference based on type
 },
 subCategoryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "SubCategory",
  required: true,
 },
 type: {
  type: String,
  enum: ["Product", "SparePart"], // Must match one of these values
 },
 quantity: {
  type: Number,
  required: true,
  min: 1,
  default: 1,
 },
 price: {
  type: Number, // Store the price at the time of adding to the cart
  required: true,
 },
 totalPrice: {
  type: Number, // quantity * price
  default: 0,
 },
});

cartItemSchema.pre("save", function (next) {
 this.totalPrice = this.quantity * this.price;
 next();
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
