const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
 authorName: { type: String, required: true },
 companyName: { type: String },
 testimonialText: { type: String, required: true },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = Testimonial;
