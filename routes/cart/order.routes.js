const express = require("express");
const {
 createOrder,
 paymentCallback,
 cancelOrder,
 getAllOrders,
 getOrdersByUserId,
} = require("../../controller/cart/order.controller");
const orderRoutes = express.Router();
// const {
//  createOrder,
//  paymentCallback,
//  cancelOrder,
// } = require("../controllers/order.controller");

// Create a new order
orderRoutes.get("/", getAllOrders);
// orderRoutes.post("", createOrder);
// In your routes file
orderRoutes.get("/get-order-by-user/:userId", getOrdersByUserId);

orderRoutes.post("/orders/:userId", createOrder);

// Mock payment callback
orderRoutes.post("/orders/:orderId/payment/callback", paymentCallback);

// Cancel an order
orderRoutes.post("/orders/:orderId/cancel", cancelOrder);

module.exports = orderRoutes;
