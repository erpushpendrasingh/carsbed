const express = require("express");
const {
 initiatePayment,
 checkPaymentStatus,
} = require("../../controller/website/paymentController");

const bookingRouter = express.Router();
// Assuming your controller is located in `controllers/paymentController.js`

// Route to initiate payment
bookingRouter.get("/status", checkPaymentStatus);
bookingRouter.post("/create-order", initiatePayment);

// Route to check payment status

module.exports = bookingRouter;
