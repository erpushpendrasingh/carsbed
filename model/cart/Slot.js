const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
 time: {
  type: String,
  required: true,
  // enum: ["8:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
 },
 date: {
  type: String,
  // required: true,
 },
 city: {
  type: String,
  // required: true,
 },
 discount: {
  type: Number,
  default: 0, // Discount percentage for booking this slot
 },
 maxBookings: {
  type: Number,
  // required: true,
 },
 currentBookings: {
  type: Number,
  default: 0,
 },
});

slotSchema.methods.isAvailable = function () {
 return this.currentBookings < this.maxBookings;
};

const Slot = mongoose.model("Slot", slotSchema);

module.exports = Slot;
