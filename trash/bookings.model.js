const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
 customer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
 },
 vendor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Vendor",
  required: true,
 },
 service: {
  type: String,
  required: true,
 },
 preferredDate: {
  type: Date,
  required: true,
 },
 timeSlot: {
  type: String,
  required: true,
 },
 status: {
  type: String,
  enum: [
   "pending",
   "accepted",
   "rescheduled",
   "declined",
   "in progress",
   "completed",
  ],
  default: "pending",
 },
 additionalDetails: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
