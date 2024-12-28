const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
 name: { type: String, required: true },
 rating: { type: Number, required: true },
 review: { type: String, required: true },
 description: { type: String, required: true },
 images: [{ type: String }],
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
