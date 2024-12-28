const mongoose = require("mongoose");

// Define the schema for booking
const bookingSchema = new mongoose.Schema({
 service: { type: String, required: true },
 carModel: { type: String, required: true },
 price: { type: Number, required: true },
 name: { type: String, required: true },
 mobile: { type: String, required: true },
 email: { type: String, required: true },
 address: { type: String, required: true },
 city: { type: String, required: true },
 date: { type: Date, required: true },
 time: { type: String, required: true },
 totalAmount: { type: Number, required: true },
 remainingAmount: { type: Number, default: 0 },
 paymentStatus: { type: String, default: "Pending" }, // Payment status
 createdAt: { type: Date, default: Date.now },
});

// Create Booking model
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
