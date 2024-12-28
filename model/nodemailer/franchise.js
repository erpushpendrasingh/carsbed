const mongoose = require("mongoose");

const franchiseSchema = new mongoose.Schema({
 name: {
  type: String,
 },
 email: {
  type: String,
 },
 whatsappNumber: {
  type: String,
 },
 state: {
  type: String,
 },
 city: {
  type: String,
 },
 budget: {
  type: String,
 },
 interest: {
  type: String,
 },
});

const FranchisesModel = mongoose.model("franchise", franchiseSchema);

module.exports = { FranchisesModel };
