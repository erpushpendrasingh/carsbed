const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema(
 {
  title: {
   type: String,
   required: true,
  },
  logo: {
   type: String,
   required: true,
  },
 },
 {
  timestamps: true,
 }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
