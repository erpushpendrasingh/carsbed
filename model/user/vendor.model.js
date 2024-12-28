const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const vendorSchema = new mongoose.Schema({
 name: String,
 email: {
  type: String,
  unique: true,
 },
 password: String,
 mobile: {
  type: String,
  unique: true,
 },
 verify: {
  type: Boolean,
  default: false,
 },
 vendor: {
  type: Boolean,
  default: false,
 },
 status: {
  type: String,
  enum: [
   "pending",
   "accept",
   "assigned",
   "complete",
   "delist",
   "hold",
   "block",
  ],
  default: "pending",
 },
 role: {
  type: String,
  enum: ["user", "admin", "vendor"],
  default: "user",
 },
 documentStatus: {
  type: String,
  enum: ["n/a", "submitted", "approved", "rejected"],
  default: "n/a",
 },
 rejectionReason: {
  type: String,
  default: "",
 },
 dailyBookingCap: {
  type: Number,
  default: 0,
 },
 monthlyBookingCap: {
  type: Number,
  default: 0,
 },
 aadhaar: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Document",
 },
 panCard: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Document",
 },
 gstCertificate: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Document",
 },
 storePhoto: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Document",
 },
 city: {
  type: String,
  required: true,
 },
 isOnline: {
  type: Boolean,
  default: true,
 },

 // Add these fields for password reset functionality
 resetPasswordToken: String,
 resetPasswordExpires: Date,
});
vendorSchema.pre("save", async function (next) {
 // Only hash the password if it has been modified or is new
 if (!this.isModified("password")) {
  return next();
 }

 // Hash the password
 const salt = await bcrypt.genSalt(10);
 this.password = await bcrypt.hash(this.password, salt);

 // Proceed to the next middleware
 next();
});

// Hash password before saving
// vendorSchema.pre("save", async function (next) {
//  if (!this.isModified("password")) return next();
//  const salt = await bcrypt.genSalt(10);
//  this.password = await bcrypt.hash(this.password, salt);
//  next();
// });

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
