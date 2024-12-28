const express = require("express");
const {
 getCart,
 addToCart,
 removeFromCart,
 updateCartItemQuantity,
 bookSlot,
 applyCoupon,
 removeCoupon,
 applyReferralCode,
} = require("../../controller/cart/cart.controller");

const cartRoutes = express.Router();

cartRoutes.get("/:userId", getCart);
cartRoutes.post("/:userId/add", addToCart);
cartRoutes.post("/:userId/remove", removeFromCart);
cartRoutes.put("/:userId/update", updateCartItemQuantity);
cartRoutes.put("/:userId/book-slot", bookSlot);
cartRoutes.put("/:userId/apply-coupon", applyCoupon);
cartRoutes.put("/:userId/remove-coupon", removeCoupon);
cartRoutes.put("/:userId/apply-referral", applyReferralCode);
module.exports = cartRoutes;

// const express = require("express");
// const {
//   getCart,
//   addToCart,
//   removeFromCart,
//   updateCartItemQuantity,
//   bookSlot,
// } = require("../../controller/cart/cart.controller");

// const cartRoutes = express.Router();

// cartRoutes.get("/:userId", getCart);
// cartRoutes.post("/:userId/add", addToCart);
// cartRoutes.post("/:userId/remove", removeFromCart);
// cartRoutes.put("/:userId/update", updateCartItemQuantity);
// cartRoutes.put("/:userId/book-slot", bookSlot);
// // cartRoutes.post("/:userId/apply-coupon", applyCoupon);
// // cartRoutes.post("/:userId/book-slot", bookSlot); // Add route for slot booking
// module.exports = cartRoutes;

// // const express = require("express");
// // const {
// //  getCart,
// //  addToCart,
// //  removeFromCart,
// //  applyCoupon,
// // } = require("../../controller/cart/cart.controller");

// // const cartRoutes = express.Router();

// // cartRoutes.get("/:userId", getCart); // Only authenticated users can access
// // cartRoutes.post("/:userId/add", addToCart); // Only authenticated users can access
// // cartRoutes.post("/:userId/remove", removeFromCart); // Only authenticated users can access
// // cartRoutes.post("/:userId/apply-coupon", applyCoupon); // Only authenticated users can access

// // module.exports = cartRoutes;

// // // const express = require("express");
// // // // const { auth, authorizeRole } = require("../../middleware/auth");
// // // const {
// // //  getCart,
// // //  addToCart,
// // //  removeFromCart,
// // //  applyCoupon,
// // // } = require("../../controller/cart/cart.controller");
// // // const { auth } = require("../../middleware/middleware");

// // // const cartRoutes = express.Router();

// // // cartRoutes.get("/", auth, getCart); // Only authenticated users can access
// // // cartRoutes.post("/add", auth, addToCart); // Only authenticated users can access
// // // cartRoutes.post("/remove", auth, removeFromCart); // Only authenticated users can access
// // // cartRoutes.post("/apply-coupon", auth, applyCoupon); // Only authenticated users can access

// // // module.exports = cartRoutes;
