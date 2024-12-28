const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = new Schema(
 {
  state: { type: String, required: true },
  city: { type: String, required: true }, // Change "cities" to "city"
  pincodes: [{ type: String, required: true }],
  image: { type: String }, // Add image field to store S3 URL
  isServiced: { type: Boolean, default: true },
  votes: { type: Number, default: 0 }, // Add votes field
 },
 {
  timestamps: true,
 }
);

const City = mongoose.model("City", citySchema);

module.exports = City;
