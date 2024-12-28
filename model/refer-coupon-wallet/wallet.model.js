const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
 amount: Number,
 date: { type: Date, default: Date.now },
 description: String,
});

const walletSchema = new mongoose.Schema({
 userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
 },
 balance: {
  type: Number,
  default: 0,
 },
 transactions: [transactionSchema],
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
