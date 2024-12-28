// controllers/AdminController.js

const AdminSettings = require("../../model/payment/AdminSettings");

// Get COD visibility setting
exports.getCODVisibility = async (req, res) => {
 try {
  const settings = await AdminSettings.findOne();
  if (settings) {
   res.json({ showCOD: settings.showCOD });
  } else {
   // If no settings are found, assume COD should be shown
   res.json({ showCOD: true });
  }
 } catch (error) {
  res.status(500).json({ message: "Server error" });
 }
};

// Update COD visibility setting
exports.updateCODVisibility = async (req, res) => {
 try {
  const { showCOD } = req.body;

  let settings = await AdminSettings.findOne();
  if (settings) {
   settings.showCOD = showCOD;
   await settings.save();
  } else {
   settings = new AdminSettings({ showCOD });
   await settings.save();
  }

  res.json({
   message: "COD visibility updated successfully",
   showCOD: settings.showCOD,
  });
 } catch (error) {
  res.status(500).json({ message: "Server error" });
 }
};
