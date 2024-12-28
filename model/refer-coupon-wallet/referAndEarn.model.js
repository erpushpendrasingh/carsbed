const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
 {
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  referredBy: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true,
  },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
 },
 { timestamps: true }
);

const Referral = mongoose.model("Referral", referralSchema);
module.exports = Referral;
