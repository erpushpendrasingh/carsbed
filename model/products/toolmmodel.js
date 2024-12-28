const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,  // To ensure no duplicate titles
  },
  logo: {
    type: String,
    required: true,  // This can be a URL to the logo image
  },
}, {
  timestamps: true,  // This adds `createdAt` and `updatedAt` timestamps
});

const Tool = mongoose.model("Tool", toolSchema);

module.exports = Tool;
