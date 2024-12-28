const express = require("express");
const multer = require("multer");
const {
 createFranchise,
 getFranchise,
} = require("../../controller/website/FranchiseController");

const franchiseRoutes = express.Router();

// Configure multer with memory storage for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Define fields for file uploads
const uploadFields = [
 { name: "panUpload", maxCount: 1 },
 { name: "aadharUpload", maxCount: 1 },
 { name: "businessDocUpload", maxCount: 1 },
 { name: "bankProofUpload", maxCount: 1 },
 { name: "photoUpload", maxCount: 1 },
];

// Route to create a franchise with file upload
franchiseRoutes.get("/", getFranchise);
franchiseRoutes.post("/create", upload.fields(uploadFields), createFranchise);

module.exports = franchiseRoutes;

// // routes/franchiseRoutes.js
// const express = require("express");
// const {
//  createFranchise,
// } = require("../../controller/website/FranchiseController");

// const franchiseRoutes = express.Router();

// // Route to create franchise with file upload
// franchiseRoutes.post("/create", createFranchise);

// module.exports = franchiseRoutes;
