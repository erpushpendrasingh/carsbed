const mongoose = require("mongoose");

const testimonialVideoSchema = new mongoose.Schema(
 {
  title: { type: String, required: true },

  description: { type: String },
  videoUrl: { type: String, required: true },
 },
 {
  timestamps: true,
 }
);

const TestimonialVideo = mongoose.model(
 "TestimonialVideo",
 testimonialVideoSchema
);
module.exports = TestimonialVideo;
