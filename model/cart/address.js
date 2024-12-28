const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
 {
  userId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true,
  },
  name: { type: String, required: true },
  houseFlatNumber: { type: String, required: true },
  completeAddress: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String, required: false }, // Optional field
  city: { type: String },
  state: { type: String },
  country: { type: String },
  phoneNumber: { type: String },
 },
 { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
