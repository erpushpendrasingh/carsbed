const reviewSchema = new Schema({
 userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
 productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
 rating: { type: Number, required: true, min: 1, max: 5 },
 reviewText: { type: String, required: true },
 timestamp: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
