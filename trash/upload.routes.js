const express = require("express");
const multer = require("multer");
const { uploadFile } = require("./upload.controller");

const uploadRoute = express.Router();

// Configure multer to accept multiple fields
const upload = multer({
 storage: multer.memoryStorage(), // Adjust storage settings as necessary
}).fields([
 { name: "aadhaar", maxCount: 1 },
 { name: "panCard", maxCount: 1 },
 { name: "gstCertificate", maxCount: 1 },
 { name: "storePhoto", maxCount: 1 },
]);

// Route to upload documents
uploadRoute.patch("/upload", upload, uploadFile);

module.exports = { uploadRoute };
