// models/variant.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const variantSchema = new Schema({
 car: {
  type: Schema.Types.ObjectId,
  ref: "Car",
  required: true,
 },
 fuelType: {
  type: String,
  enum: ["petrol", "diesel", "electric"],
  required: true,
 },
 transmissionType: {
  type: String,
  enum: ["manual", "automatic"],
  required: true,
 },
 price: {
  type: Number,
  required: true,
 },
});

module.exports = mongoose.model("Variant", variantSchema);
