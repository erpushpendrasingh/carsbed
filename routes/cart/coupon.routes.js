const express = require('express');
// const { getCoupons, createCoupon, updateCoupon } = require('../controllers/coupon.controller');
 
const couponRoutes = express.Router();

couponRoutes.get('/',   getCoupons);
couponRoutes.post('/',   createCoupon);
couponRoutes.put('/:id',   updateCoupon);

module.exports = couponRoutes;
