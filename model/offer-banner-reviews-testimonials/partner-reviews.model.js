const mongoose = require("mongoose");

const partnerReviewSchema = new mongoose.Schema({
 name: { type: String, required: true },
 rating: { type: Number, required: true },
 review: { type: String, required: true },
 description: { type: String, required: true },
 images: [{ type: String }],
});

const PartnerReview = mongoose.model("PartnerReview", partnerReviewSchema);
module.exports = PartnerReview;
