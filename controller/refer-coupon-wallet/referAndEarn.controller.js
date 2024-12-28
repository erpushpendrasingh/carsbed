const Cart = require("../../model/cart/cart");
const Referral = require("../../model/refer-coupon-wallet/referAndEarn.model");

const getReferralCodes = async (req, res) => {
 try {
  const referralCodes = await Referral.find().populate("referredBy");
  res.json(referralCodes);
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

const createReferralCode = async (req, res) => {
 const { code, discountPercent, referredBy, expiryDate, isActive } = req.body;

 const newReferralCode = new Referral({
  code,
  discountPercent,
  referredBy,
  expiryDate,
  isActive,
 });

 try {
  const savedReferralCode = await newReferralCode.save();
  res.status(201).json(savedReferralCode);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const applyReferralCode = async (req, res) => {
 const { userId } = req.params;
 const { referralCode } = req.body;

 try {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  const referral = await Referral.findOne({
   code: referralCode,
   isActive: true,
  });
  if (!referral) {
   return res.status(404).json({ message: "Invalid or expired referral code" });
  }

  if (new Date() > new Date(referral.expiryDate)) {
   return res.status(400).json({ message: "Referral code has expired" });
  }

  cart.referralCode = referralCode;
  cart.referralDiscount = (cart.totalPrice * referral.discountPercent) / 100;
  cart.calculateTotals();

  await cart.save();
  res.status(200).json(cart);
 } catch (err) {
  console.error("Error applying referral code:", err.message);
  res.status(400).json({ message: err.message });
 }
};

module.exports = {
 getReferralCodes,
 createReferralCode,
 applyReferralCode,
};
