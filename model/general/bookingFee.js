const mongoose = require("mongoose");

const bookingFeeSchema = new mongoose.Schema({
 amount: {
  type: Number,
  required: true,
 },
 updatedAt: {
  type: Date,
  default: Date.now,
 },
});

const BookingFee = mongoose.model("BookingFee", bookingFeeSchema);
module.exports = BookingFee;
