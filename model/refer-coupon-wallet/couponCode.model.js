const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema(
 {
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  description: { type: String, required: true, maxlength: 150 },
  subCategory: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "SubCategory",
   required: true,
  },
  type: { type: String, required: true, enum: ["discount", "cashback"] },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
 },
 { timestamps: true }
);

const CouponCode = mongoose.model("CouponCode", couponCodeSchema);
module.exports = CouponCode;
