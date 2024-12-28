const mongoose = require("mongoose");

const termsConditionsSchema = new mongoose.Schema({
 title: { type: String, required: true },
 description: { type: String, required: true },
});

const TermsConditions = mongoose.model(
 "TermsConditions",
 termsConditionsSchema
);
module.exports = TermsConditions;
