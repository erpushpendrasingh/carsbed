const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
 Service: {
  type: String,
 },
 carModel: {
  type: String,
 },
 Price: {
  type: String,
 },
 name: {
  type: String,
 },
 mobile: {
  type: String,
 },

 email: {
  type: String,
 },
 address: {
  type: String,
 },
 city: {
  type: String,
 },
 date: {
  type: Date,
 },
 time: {
  type: String,
 },
});

const BookingModel = mongoose.model("booking", bookingSchema);

module.exports = { BookingModel };
