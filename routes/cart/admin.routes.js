const express = require("express");
const router = express.Router();
const {
 getSlots,
 createSlot,
 updateSlot,
} = require("../controllers/adminSlot.controller");
const {
 getCoupons,
 createCoupon,
 updateCoupon,
} = require("../controllers/adminCoupon.controller");
const { getAllOrders } = require("../../controller/cart/adminOrder.controller");
// const {
//   getAllOrders,
// } = require('../controllers/adminOrder.controller');

router.get("/slots", getSlots);
router.post("/slots", createSlot);
router.put("/slots/:id", updateSlot);

router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);

router.get("/orders", getAllOrders);

module.exports = router;
