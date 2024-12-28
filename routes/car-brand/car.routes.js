const express = require("express");
const {
 createCar,
 getAllCars,
 getCarById,
 updateCarsByTitle,
 deleteCar,
 getCarsByBrand,
 getCarIds,
 getUniqueCars,
 getCarsByModel,
 selectCarVariant,
 deleteCarVariant,
 getAllvarientsOfCars,
 deleteCarById,
 findCarByDetails,
 getCarsByIds,
} = require("../../controller/brand-car/car.controller");
const upload = require("../../middleware/upload");
const router = express.Router();

// GET routes
router.get("/find", findCarByDetails);
router.get("/unique", getUniqueCars);
router.get("/all-car", getAllCars);
router.get("/car-ids", getCarIds);
router.get("/all-varients", getAllvarientsOfCars);
router.get("/brand/:brandId", getCarsByBrand);
router.get("/brand/:brandId/model/:model", getCarsByModel);
router.get("/:id", getCarById); // This should be defined after specific routes
router.post("/", getCarsByIds); // This should be defined after specific routes
// POST routes
router.post("/add-car", upload.single("image"), createCar);
router.post("/select-variant", selectCarVariant);

// PATCH routes
router.patch("/updateCar/:title", upload.single("image"), updateCarsByTitle);

// DELETE routes
router.delete("/delete-variant", deleteCarVariant);
router.delete("/:title", deleteCar);
router.delete("/del/var/:id", deleteCarById);

module.exports = router;

// const express = require("express");
// const {
//  createCar,
//  getAllCars,
//  getCarById,
//  updateCarsByTitle,
//  deleteCar,
//  getCarsByBrand,
//  getCarIds,
//  getUniqueCars,
//  getCarsByModel,
//  selectCarVariant,
//  deleteCarVariant,
//  getAllvarientsOfCars,
//  deleteCarById,
// } = require("../../controller/brand-car/car.controller");
// const upload = require("../../middleware/upload");
// const router = express.Router();

// router.get("/unique", getUniqueCars);
// router.get("/all-car", getAllCars);
// router.get("/car-ids", getCarIds);
// router.get("/all-varients", getAllvarientsOfCars);
// router.get("/brand/:brandId", getCarsByBrand);
// router.get("/brand/:brandId/model/:model", getCarsByModel);
// router.get("/:id", getCarById); // This should be defined after specific routes
// router.post("/add-car", upload.single("image"), createCar);
// router.delete("/delete-variant", deleteCarVariant);
// router.patch("/updateCar/:title", upload.single("image"), updateCarsByTitle);
// router.delete("/:title", deleteCar);
// router.post("/select-variant", selectCarVariant);
// router.delete("/del/var/:id", deleteCarById);

// module.exports = router;
