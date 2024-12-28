const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
 mobile: { type: Number, required: true, unique: true },
 verify: { type: Boolean, default: false },
 selectedBrand: {
  type: Schema.Types.ObjectId,
  ref: "Brand",
 },
 cars: [
  {
   type: Schema.Types.ObjectId,
   ref: "Car",
  },
 ],
 currentCar: {
  type: Schema.Types.ObjectId,
  ref: "Car",
 },
 transmissionType: {
  type: String,
 },
 fuelType: {
  type: String,
 },
 otp: { type: Number },
 otpExpiresAt: { type: Date },
 walletBalance: { type: Number, default: 0 },
 name: String,
 referral_code: String,
 house_no: String,
 address1: String,
 address2: String,
 pincode: String,
 landmark: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
