const express = require("express");
const {
 authenticate,
 authorizeRoles,
} = require("../../middleware/auth.middleware");
const {
 getWalletBalance,
 addTransaction,
 depositWelcomeBonus,
 completePurchase,
} = require("../../controller/refer-coupon-wallet/wallet.controller");

const walletRoutes = express.Router();

// Get wallet balance
walletRoutes.get("/:userId",  getWalletBalance);

// Add a transaction to the wallet (e.g., cashback, referral bonus)
walletRoutes.post("/:userId/add-transaction", authenticate, addTransaction);

// Admin: Deposit welcome bonus into a user's wallet
walletRoutes.post(
 "/deposit-welcome-bonus",
 authenticate,
 authorizeRoles("admin"),
 depositWelcomeBonus
);

// Route to handle purchase completion and referral bonus
walletRoutes.post("/complete-purchase", authenticate, completePurchase);

module.exports = walletRoutes;

// const express = require("express");
// const {
//  getWalletBalance,
//  addTransaction,
// } = require("../../controller/refer-coupon-wallet/wallet.controller");

// const walletRoutes = express.Router();

// walletRoutes.get("/:userId", getWalletBalance);
// walletRoutes.post("/:userId/add-transaction", addTransaction);

// module.exports = walletRoutes;
