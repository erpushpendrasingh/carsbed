const mongoose = require("mongoose");
const CartItem = require("./cartItem.model");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [CartItem.schema],
  extra_requirement: { type: String },

  totalItems: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  finalPrice: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  couponCode: {
    type: String,
    default: null,
  },
  couponDiscount: {
    type: Number,
    default: 0,
  },
  cashbackAmount: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    default: null,
  },
  referralDiscount: {
    type: Number,
    default: 0,
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
  },
  slotDiscount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
cartSchema.methods.calculateTotals = function () {
  // Calculate total quantity of all items and the number of distinct items
  const totalQuantity = this.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const distinctItemsCount = this.items.length;

  // Calculate total price
  this.totalPrice = this.items.reduce((acc, item) => acc + item.totalPrice, 0);

  // Update totalItems to reflect the number of distinct items
  this.totalItems = distinctItemsCount;

  // Handle slot discount logic
  if (totalQuantity === 0) {
    this.slot = null;
    this.slotDiscount = 0;
  }

  // Handle coupon discount logic
  if (!this.couponCode || totalQuantity === 0 || this.totalPrice < 500) {
    this.couponCode = null;
    this.couponDiscount = 0;
  }

  // Calculate final price
  this.finalPrice =
    this.totalPrice -
    this.discount -
    this.slotDiscount -
    this.couponDiscount -
    this.referralDiscount;
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
