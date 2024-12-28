const mongoose = require("mongoose");
const { Schema } = mongoose;

const offerSchema = new Schema(
 {
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  discountPercent: { type: Number, required: true },
  subCategory: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "SubCategory",
   required: true,
  },
 },
 {
  timestamps: true,
 }
);

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
