const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema({
 title: { type: String, required: true },
 description: { type: String, required: true },
});

const PrivacyPolicy = mongoose.model("PrivacyPolicy", privacyPolicySchema);
module.exports = PrivacyPolicy;
