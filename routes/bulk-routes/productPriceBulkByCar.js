const express = require("express");
const multer = require("multer");
const {
 createCarPricesFromExcel,
} = require("../../controller/bulk-upload/carPriceBulkController");

const carPriceRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

carPriceRouter.post(
 "/api/bulk-price/create",
 upload.single("file"),
 createCarPricesFromExcel
);

module.exports = carPriceRouter;
