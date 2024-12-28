const express = require("express");
const {
 getSlots,
 createSlot,
 updateSlot,
 deleteSlot,
} = require("../../controller/cart/slot.controller");
// const { getSlots, createSlot, updateSlot } = require('../controllers/slot.controller');

const slotRoutes = express.Router();

slotRoutes.get("/", getSlots);
slotRoutes.post("/", createSlot);
slotRoutes.put("/:id", updateSlot);
slotRoutes.delete("/:id", deleteSlot);

module.exports = slotRoutes;
