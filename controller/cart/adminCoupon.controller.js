const Coupon = require('../models/coupon.model');

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCoupon = async (req, res) => {
  const { code, discountPercentage, validTill, usageLimit } = req.body;
  try {
    const newCoupon = new Coupon({
      code,
      discountPercentage,
      validTill,
      usageLimit,
    });

    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { code, discountPercentage, validTill, usageLimit } = req.body;
  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    coupon.code = code;
    coupon.discountPercentage = discountPercentage;
    coupon.validTill = validTill;
    coupon.usageLimit = usageLimit;

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
};
