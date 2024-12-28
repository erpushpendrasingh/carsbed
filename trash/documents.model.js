const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
 fileName: {
  type: String,
  required: true,
 },
 fileType: {
  type: String,
  required: true,
 },
 fileSize: {
  type: Number,
  required: true,
 },
 uploadDate: {
  type: Date,
  default: Date.now,
 },
 vendorId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Vendor",
  required: true,
 },
 documentType: {
  type: String,
  required: true,
 },
});

module.exports = mongoose.model("Document", documentSchema);
