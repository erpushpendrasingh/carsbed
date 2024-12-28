// const Slot = require('../models/slot.model');

const Slot = require("../../model/cart/Slot");

const getSlots = async (req, res) => {
 try {
  const slots = await Slot.find();
  res.json(slots);
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

//// Admin function to add time and discount to slots
// const createSlot = async (req, res) => {
//   const { time, discount } = req.body;

//   try {
//     // Check if the slot time already exists
//     const existingSlot = await Slot.findOne({ time });
//     if (existingSlot) {
//       return res.status(400).json({ message: "This time slot already exists" });
//     }

//     // Create a new slot with the provided time and discount
//     const newSlot = new Slot({
//       time,
//       discount,
//       maxBookings: 0, // This will be determined later when the user provides city and date
//       currentBookings: 0,
//     });

//     await newSlot.save();

//     res.status(201).json({ message: "Time slot added successfully", slot: newSlot });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };
const createSlot = async (req, res) => {
 const { time, maxBookings, discount } = req.body;

 try {
  // Check if the slot time already exists
  const existingSlot = await Slot.findOne({ time });
  if (existingSlot) {
   return res.status(400).json({ message: "This time slot already exists" });
  }

  // Create a new slot with the provided time, maxBookings, and discount
  const newSlot = new Slot({
   time,
   maxBookings,
   discount,
   currentBookings: 0,
  });

  await newSlot.save();

  res
   .status(201)
   .json({ message: "Time slot added successfully", slot: newSlot });
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

// const updateSlot = async (req, res) => {
//  const { id } = req.params;
//  const { city, slot, vendorsAvailable, offer } = req.body;
//  try {
//   const slotToUpdate = await Slot.findById(id);
//   if (!slotToUpdate) {
//    return res.status(404).json({ message: "Slot not found" });
//   }

//   slotToUpdate.city = city;
//   slotToUpdate.slot = slot;
//   slotToUpdate.vendorsAvailable = vendorsAvailable;
//   slotToUpdate.offer = offer;

//   await slotToUpdate.save();
//   res.json(slotToUpdate);
//  } catch (err) {
//   res.status(400).json({ message: err.message });
//  }
// };
const updateSlot = async (req, res) => {
 const { id } = req.params;
 const { time, maxBookings, discount } = req.body;

 try {
  const slotToUpdate = await Slot.findById(id);
  if (!slotToUpdate) {
   return res.status(404).json({ message: "Slot not found" });
  }

  slotToUpdate.time = time;
  slotToUpdate.maxBookings = maxBookings;
  slotToUpdate.discount = discount;

  await slotToUpdate.save();
  res.json(slotToUpdate);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};
const deleteSlot = async (req, res) => {
 const { id } = req.params;

 try {
  const slotToDelete = await Slot.findById(id);
  if (!slotToDelete) {
   return res.status(404).json({ message: "Slot not found" });
  }

  await Slot.deleteOne({ _id: id });

  res.status(200).json({ message: "Slot deleted successfully" });
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

module.exports = {
 getSlots,
 createSlot,
 updateSlot,
 deleteSlot,
};
