// routes/addressRoutes.js

const express = require("express");
const { getAddressByUserId } = require("../../controller/address/address");
const addressRoutes = express.Router();

// Import the controller

// Define the GET route for fetching addresses by userId
addressRoutes.get("/addresses", getAddressByUserId);

// Export the addressRoutes
module.exports = addressRoutes;
