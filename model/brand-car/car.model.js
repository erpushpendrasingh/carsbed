const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema(
 {
  brand: {
   type: Schema.Types.ObjectId,
   ref: "Brand",
   required: true,
  },
  title: {
   type: String,
   required: true,
  },
  images: {
   type: String,
   required: true,
  },

  transmissionType: {
   type: String,
   enum: ["manual", "automatic"],
   required: true,
  },
  fuelType: {
   type: String,
   enum: ["petrol", "diesel", "cng", "electric"],
   required: true,
  },
 },
 {
  timestamps: true,
 }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
