const Slot = require('../models/slot.model');

const getSlots = async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSlot = async (req, res) => {
  const { city, slot, vendorsAvailable, offer } = req.body;

  try {
    const newSlot = new Slot({ city, slot, vendorsAvailable, offer });
    await newSlot.save();
    res.status(201).json({ message: 'Slot created successfully', slot: newSlot });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateSlot = async (req, res) => {
  const { id } = req.params;
  const { vendorsAvailable, offer } = req.body;

  try {
    const slot = await Slot.findById(id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    slot.vendorsAvailable = vendorsAvailable;
    slot.offer = offer;

    await slot.save();
    res.status(200).json({ message: 'Slot updated successfully', slot });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getSlots,
  createSlot,
  updateSlot,
};
