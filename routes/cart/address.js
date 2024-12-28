const express = require("express");
const { saveAddress } = require("../../controller/cart/address");
// const { saveAddress } = require("../../controller/user/address.controller");
const addressRouter = express.Router();

addressRouter.post("/:userId/address", saveAddress);

module.exports = addressRouter;
