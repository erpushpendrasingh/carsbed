const { uploadFileToS3 } = require("../../config/multerConfig");
const FranchiseModel = require("../../model/website/FranchiseModel");
// const { uploadFileToS3 } = require("../../utils/s3"); // S3 utility for file upload

// Create a new Franchise entry with file uploads
const createFranchise = async (req, res) => {
 try {
  const franchiseData = req.body;

  // Process uploaded files and save their metadata
  if (req.files) {
   const fileFields = [
    "panUpload",
    "aadharUpload",
    "businessDocUpload",
    "bankProofUpload",
    "photoUpload",
   ];

   // Iterate over file fields and upload each file to S3
   for (const field of fileFields) {
    if (req.files[field]) {
     const uploadedFiles = await Promise.all(
      req.files[field].map(async (file) => {
       const uploadedUrl = await uploadFileToS3(file);
       return {
        fileName: file.originalname,
        filePath: uploadedUrl, // S3 file location URL
        mimeType: file.mimetype,
       };
      })
     );

     // Save uploaded files metadata to the franchise data
     franchiseData[field] = uploadedFiles;
    }
   }
  }

  // Create a new FranchiseModel document with the received and processed data
  const newFranchise = new FranchiseModel(franchiseData);
  await newFranchise.save();

  res.status(201).json({
   message: "Franchise data saved successfully",
   data: newFranchise,
  });
 } catch (error) {
  res.status(500).json({
   message: "An error occurred while saving franchise data",
   error: error.message,
  });
 }
};
const getFranchise = async (req, res) => {
 try {
  // Fetch all franchise data or filter based on query parameters if needed
  const franchises = await FranchiseModel.find();

  res.status(200).json({
   message: "Franchise data retrieved successfully",
   data: franchises,
  });
 } catch (error) {
  res.status(500).json({
   message: "An error occurred while retrieving franchise data",
   error: error.message,
  });
 }
};

module.exports = {
 createFranchise,
 getFranchise,
};
