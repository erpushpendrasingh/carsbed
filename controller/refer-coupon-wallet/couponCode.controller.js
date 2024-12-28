const CouponCode = require("../../model/refer-coupon-wallet/couponCode.model");

const getCouponCodes = async (req, res) => {
 try {
  const couponCodes = await CouponCode.find().populate("subCategory");
  res.json(couponCodes);
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

const createCouponCode = async (req, res) => {
 const {
  title,
  code,
  discountPercent,
  description,
  subCategory,
  type,
  expiryDate,
  isActive,
 } = req.body;

 const newCouponCode = new CouponCode({
  title,
  code,
  discountPercent,
  description,
  subCategory,
  type,
  expiryDate,
  isActive,
 });

 try {
  const savedCouponCode = await newCouponCode.save();
  res.status(201).json(savedCouponCode);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const updateCouponCode = async (req, res) => {
 try {
  const couponCode = await CouponCode.findById(req.params.id);
  if (!couponCode) {
   return res.status(404).json({ message: "Coupon Code not found" });
  }

  Object.assign(couponCode, req.body);
  const updatedCouponCode = await couponCode.save();
  res.json(updatedCouponCode);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const deleteCouponCode = async (req, res) => {
 try {
  const couponCode = await CouponCode.findById(req.params.id);
  if (!couponCode) {
   return res.status(404).json({ message: "Coupon Code not found" });
  }

  await couponCode.deleteOne();
  res.status(204).json({ message: "Coupon Code deleted successfully" });
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

module.exports = {
 getCouponCodes,
 createCouponCode,
 updateCouponCode,
 deleteCouponCode,
};

// const CouponCode = require("../../model/refer-coupon-wallet/couponCode.model");

// const getCouponCodes = async (req, res) => {
//  try {
//   const couponCodes = await CouponCode.find().populate("subCategory");
//   res.json(couponCodes);
//  } catch (err) {
//   res.status(500).json({ message: err.message });
//  }
// };

// const createCouponCode = async (req, res) => {
//  const {
//   title,
//   code,
//   discountPercent,
//   description,
//   subCategory,
//   type,
//   expiryDate,
//   isActive,
//  } = req.body;

//  const newCouponCode = new CouponCode({
//   title,
//   code,
//   discountPercent,
//   description,
//   subCategory,
//   type,
//   expiryDate,
//   isActive,
//  });

//  try {
//   const savedCouponCode = await newCouponCode.save();
//   res.status(201).json(savedCouponCode);
//  } catch (err) {
//   res.status(400).json({ message: err.message });
//  }
// };

// const updateCouponCode = async (req, res) => {
//  try {
//   const couponCode = await CouponCode.findById(req.params.id);
//   if (!couponCode) {
//    return res.status(404).json({ message: "Coupon Code not found" });
//   }

//   Object.assign(couponCode, req.body);
//   const updatedCouponCode = await couponCode.save();
//   res.json(updatedCouponCode);
//  } catch (err) {
//   res.status(400).json({ message: err.message });
//  }
// };

// const deleteCouponCode = async (req, res) => {
//  try {
//   const couponCode = await CouponCode.findById(req.params.id);
//   if (!couponCode) {
//    return res.status(404).json({ message: "Coupon Code not found" });
//   }

//   await couponCode.deleteOne();
//   res.status(204).json({ message: "Coupon Code deleted successfully" });
//  } catch (err) {
//   res.status(500).json({ message: err.message });
//  }
// };

// module.exports = {
//  getCouponCodes,
//  createCouponCode,
//  updateCouponCode,
//  deleteCouponCode,
// };
