// models/sparePartPrice.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sparePartPriceSchema = new Schema(
 {
  carId: { type: Schema.Types.ObjectId, ref: "Car", required: true }, // Reference to Car model
  sparePartId: {
   type: Schema.Types.ObjectId,
   ref: "SparePart",
   required: true,
  }, // Reference to SparePart model
  variant: { type: String, required: true },
  transmission: { type: String, required: true },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Optional: Discount percentage
 },
 {
  timestamps: true,
 }
);

const SparePartPrice = mongoose.model("SparePartPrice", sparePartPriceSchema);

module.exports = SparePartPrice;
