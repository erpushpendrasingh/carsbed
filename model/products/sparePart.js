// models/sparePart.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const highlightSchema = new Schema({
  text: { type: String, required: true },
  icon: { type: String, required: true },
});

const sparePartSchema = new Schema(
  {
    spareName: { type: String, required: true },
    image: { type: String }, // URL of the image
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    SubCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    }, // Reference to SubCategory
    highlights: [highlightSchema],
    // Array of highlight objects
    isTrending: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const SparePart = mongoose.model("SparePart", sparePartSchema);

module.exports = SparePart;
