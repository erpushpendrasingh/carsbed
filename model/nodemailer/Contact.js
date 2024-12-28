const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
 name: {
  type: String,
 },
 email: {
  type: String,
 },
 mobile: {
  type: String,
 },
 description: {
  type: String,
 },
});

const ContactsModel = mongoose.model("contactus", contactSchema);

module.exports = { ContactsModel };
