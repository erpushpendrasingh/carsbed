const express = require("express");
const {
 setBookingFee,
 getBookingFee,
 updateBookingFee,
} = require("../../controller/general/bookingController");
const bookingRoutes = express.Router();
 
bookingRoutes.post("/", setBookingFee);

// Get Current Booking Fee
bookingRoutes.get("/", getBookingFee);
bookingRoutes.put("/update", updateBookingFee);

module.exports = bookingRoutes;
