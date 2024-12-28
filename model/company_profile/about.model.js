// models/About.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aboutSchema = new Schema(
 {
  visionAndMission: { type: String, required: true },
  story: { type: String, required: true },
  services: { type: String, required: true },
  socialProof: { type: String, required: true },
  image: { type: String }, // URL of the image
 },
 {
  timestamps: true,
 }
);

const About = mongoose.model("About", aboutSchema);

module.exports = About;
