// routes/cityRoutes.js
const express = require("express");

// const upload = require("../config/multerConfig");
const {
 createCity,
 updateCity,
 deleteCity,
 fetchCities,
 updateVotes,
 toggleServiceStatus,
 removePincode,
} = require("../../controller/service-provider/cityController");
const upload = require("../../middleware/upload");

const router = express.Router();

router.post("/cities", upload.single("image"), createCity);
router.put("/cities/:id", upload.single("image"), updateCity);
router.delete("/cities/:id", deleteCity);
router.get("/cities", fetchCities);
router.post("/cities/:id/vote", updateVotes);
router.put("/cities/:id/toggle-service", toggleServiceStatus);
router.put("/cities/:id/remove-pincode", removePincode);

module.exports = router;
