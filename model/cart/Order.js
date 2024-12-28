const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
 userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
 },
 razorpayOrderId: {
  type: String,
  required: true,
 },
 address: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Address",
  required: true,
 },
 amount: {
  type: Number,
  required: true,
 },
 currency: {
  type: String,
  default: "INR",
 },
 receipt: {
  type: String,
  required: true,
 },
 paymentMethod: {
  type: String,
  required: true,
 },
 orderStatus: {
  type: String,
  default: "Pending",
  required: true,
 },
 paymentStatus: {
  type: String,
  default: "Pending",
  required: true,
 },
 finalPrice: {
  type: Number,
  required: true,
 },
 totalPrice: {
  type: Number,
  required: true,
 },
 discounts: {
  coupon: { type: Number, default: 0 },
  referral: { type: Number, default: 0 },
  slot: { type: Number, default: 0 },
  walletUsed: { type: Number, default: 0 },
  totalDiscount: { type: Number, default: 0 },
 },
 slot: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Slot",
 },
 slotDate: {
  type: String,
 },
 slotTime: {
  type: String,
 },
 balanceDue: {
  type: String,
 },
 bookingFee: {
  type: String,
 },
 codAmount: {
  type: String,
 },
 carId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Car",
 },
 cartItems: [
  {
   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
   subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
   type: { type: String, enum: ["Product", "SparePart"] },
   quantity: { type: Number, required: true },
   price: { type: Number, required: true },
   totalPrice: { type: Number, required: true },
  },
 ], // Embed cart items directly in the order
 createdAt: {
  type: Date,
  default: Date.now,
 },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//  userId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User",
//   required: true,
//  },
//  cartId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Cart",
//   required: true,
//  },
//  razorpayOrderId: {
//   type: String,
//   required: true,
//  },
//  address: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Address",
//   required: true, //  address is always associated with an order
//  },
//  amount: {
//   type: Number,
//   required: true,
//  },
//  currency: {
//   type: String,
//   default: "INR",
//  },
//  receipt: {
//   type: String,
//   required: true,
//  },
//  paymentMethod: {
//   type: String,
//   required: true,
//  },
//  orderStatus: {
//   type: String,
//   default: "Pending",
//   required: true,
//  },
//  paymentStatus: {
//   type: String,
//   default: "Pending",
//   required: true,
//  },
//  finalPrice: {
//   type: Number,
//   required: true,
//  },
//  totalPrice: {
//   type: Number,
//   required: true,
//  },
//  discounts: {
//   coupon: { type: Number, default: 0 },
//   referral: { type: Number, default: 0 },
//   slot: { type: Number, default: 0 },
//   walletUsed: { type: Number, default: 0 },
//   totalDiscount: { type: Number, default: 0 },
//  },
//  slot: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Slot",
//   //   required: true,
//  },
//  slotDate: {
//   type: String, // Date from Slot
//  },
//  slotTime: {
//   type: String, // Time from Slot
//  },
//  balanceDue: {
//   type: String, // Time from Slot
//  },
//  bookingFee: {
//   type: String, // Time from Slot
//  },
//  codAmount: {
//   type: String, // Time from Slot
//  },
//  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },

//  createdAt: {
//   type: Date,
//   default: Date.now,
//  },
// });

// const Order = mongoose.model("Order", orderSchema);

// module.exports = Order;
