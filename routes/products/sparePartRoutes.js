// routes/sparePartRoutes.js
const express = require("express");

const upload = require("../../middleware/upload");
const {
 createSparePart,
 updateSparePart,
 deleteSparePart,
 getSpareParts,
 getSparePartById,
} = require("../../controller/products-categories/sparePartController");
const {
 createSparePartPrice,
 getSparePartPrices,
 updateSparePartPrice,
 deleteSparePartPrice,
 getSpareProductsByCarId,
 getSparePartPricesAll,
} = require("../../controller/products-categories/sparePartPriceController");

const sparePartRoutes = express.Router();

// Spare Part CRUD operations
sparePartRoutes.post("/", createSparePart);
sparePartRoutes.put("/:id", updateSparePart);
sparePartRoutes.delete("/:id", deleteSparePart);
sparePartRoutes.get("/", getSpareParts);
sparePartRoutes.get("/:id", getSparePartById);

// Spare Part Price operations
sparePartRoutes.post("/sparepart/price", createSparePartPrice);
sparePartRoutes.get("/spare-product/:carId", getSpareProductsByCarId); ///api/spareparts
sparePartRoutes.get("/spareparts/all", getSparePartPricesAll);
sparePartRoutes.get("/sparepart/:sparePartId/prices", getSparePartPrices);
sparePartRoutes.put("/sparepart/price/:priceId", updateSparePartPrice);
sparePartRoutes.delete("/sparepart/price/:priceId", deleteSparePartPrice);

module.exports = sparePartRoutes;

// // routes/sparePartRoutes.js
// const express = require("express");

// const upload = require("../../middleware/upload");
// const {
//  createSparePart,
//  updateSparePart,
//  deleteSparePart,
//  getSpareParts,
//  getSparePartById,
// } = require("../../controller/products-categories/sparePartController");
// const {
//  createSparePartPrice,
// } = require("../../controller/products-categories/sparePartPriceController");

// const sparePartRoutes = express.Router();

// sparePartRoutes.post("/", createSparePart);
// sparePartRoutes.put("/:id", updateSparePart);
// sparePartRoutes.delete("/:id", deleteSparePart);
// sparePartRoutes.get("/", getSpareParts);
// sparePartRoutes.get("/:id", getSparePartById);
// sparePartRoutes.post("/sparepart/price", createSparePartPrice);
// module.exports = sparePartRoutes;
