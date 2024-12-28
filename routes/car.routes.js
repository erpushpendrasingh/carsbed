const express = require("express");
const { createCar, updateCar } = require("../trash/carController");
const carRouterForAdd = express.Router();

// carRouterForAdd.post("/add-car", createCar);
// carRouterForAdd.patch("/update-car/:id", updateCar);

module.exports = { carRouterForAdd };
