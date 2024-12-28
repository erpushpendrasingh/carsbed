// models/AdminSettings.js

const mongoose = require("mongoose");

const AdminSettingsSchema = new mongoose.Schema({
 showCOD: {
  type: Boolean,
  default: true, // By default, COD is available
 },
});

module.exports = mongoose.model("AdminSettings", AdminSettingsSchema);
