// models/faqModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const faqSchema = new Schema({
 question: { type: String, required: true },
 answer: { type: String, required: true },
 category: { type: String }, // Optional, for categorizing FAQs
 createdAt: { type: Date, default: Date.now },
});

const FAQ = mongoose.model("FAQ", faqSchema);
module.exports = FAQ;
