const express = require("express");
const {
 authenticate,
 authorizeRoles,
} = require("../../middleware/auth.middleware");
const {
 completePurchase,
 addCoinsToUser,
} = require("../../controller/auth/referController");

const referRouter = express.Router();

referRouter.post("/complete-purchase", authenticate, completePurchase);
referRouter.post(
 "/add-coins",
 authenticate,
 authorizeRoles("admin"),
 addCoinsToUser
);

module.exports = referRouter;
