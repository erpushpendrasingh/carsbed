const express = require("express");
const bulkRoutes = express.Router();
const { bulkInsert } = require("../../trash/bulkController");
const upload = require("../../middleware/upload");

// Bulk insert categories, subcategories, and products
bulkRoutes.post("/", upload.single("file"), bulkInsert);

module.exports = bulkRoutes;
