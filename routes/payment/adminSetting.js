// routes/admin.js

const express = require("express");
const AdminSettingsRouter = express.Router();
const {
 updateCODVisibility,
 getCODVisibility,
} = require("../../controller/payment/AdminSettingsController");

// Route to get COD visibility
AdminSettingsRouter.get("/cod-visibility", getCODVisibility);

// Route to update COD visibility
AdminSettingsRouter.post("/cod-visibility", updateCODVisibility);

module.exports = AdminSettingsRouter;
