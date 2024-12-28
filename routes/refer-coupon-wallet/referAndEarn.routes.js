const express = require("express");
const {
 getReferralCodes,
 createReferralCode,
 applyReferralCode,
} = require("../../controller/refer-coupon-wallet/referAndEarn.controller");

const referAndEarnRoutes = express.Router();

referAndEarnRoutes.get("/", getReferralCodes);
referAndEarnRoutes.post("/", createReferralCode);
referAndEarnRoutes.put("/apply-referral/:userId", applyReferralCode);

module.exports = referAndEarnRoutes;
