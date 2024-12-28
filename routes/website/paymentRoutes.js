const express = require("express");
const {
 initiatePayment,
} = require("../../controller/website/paymentController");

const paymentRouter = express.Router();

// Route for initiating payment
paymentRouter.post("/phonepe", initiatePayment);

module.exports = paymentRouter;
