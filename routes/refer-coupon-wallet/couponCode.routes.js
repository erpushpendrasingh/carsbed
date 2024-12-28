const express = require("express");
const {
 getCouponCodes,
 createCouponCode,
 updateCouponCode,
 deleteCouponCode,
} = require("../../controller/refer-coupon-wallet/couponCode.controller");

const couponCodeRoutes = express.Router();

couponCodeRoutes.get("/", getCouponCodes);
couponCodeRoutes.post("/", createCouponCode);
couponCodeRoutes.put("/:id", updateCouponCode);
couponCodeRoutes.delete("/:id", deleteCouponCode);

module.exports = couponCodeRoutes;
