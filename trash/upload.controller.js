const { GridFSBucket } = require("mongodb");
const connectDB = require("../config/db");
const Document = require("./documents.model");

let gfs, conn;

const initializeGridFS = async () => {
 const dbConnection = await connectDB();
 conn = dbConnection.conn;
 gfs = dbConnection.gfs;
};

initializeGridFS();

const uploadFile = async (req, res) => {
 const { vendorId } = req.body;
 console.log("vendorId:", vendorId);

 if (!req.body.vendorId || !req.files) {
  return res.status(400).send("Missing required fields.");
 }

 try {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
   return res.status(404).send("Vendor not found.");
  }

  const documentTypes = ["aadhaar", "panCard", "gstCertificate", "storePhoto"];
  const uploadedDocuments = [];

  for (const type of documentTypes) {
   if (req.files[type]) {
    const file = req.files[type][0];
    const newDocument = new Document({
     fileName: file.originalname,
     fileType: file.mimetype,
     fileSize: file.size,
     vendorId: vendorId,
     documentType: type,
    });

    const savedDocument = await newDocument.save();

    switch (type) {
     case "aadhaar":
      vendor.aadhaar = savedDocument._id;
      break;
     case "panCard":
      vendor.panCard = savedDocument._id;
      break;
     case "gstCertificate":
      vendor.gstCertificate = savedDocument._id;
      break;
     case "storePhoto":
      vendor.storePhoto = savedDocument._id;
      break;
    }

    uploadedDocuments.push(savedDocument);
   }
  }

  await vendor.save();

  res.status(200).json({
   documents: uploadedDocuments,
   message: "Documents uploaded and associated with vendor.",
  });
 } catch (error) {
  console.error(error);
  res.status(500).send("Error uploading documents.");
 }
};

const getFilesByType = async (req, res) => {
 try {
  const { type } = req.params;
  const files = await gfs.files.find({ "metadata.type": type }).toArray();

  if (!files || files.length === 0) {
   return res.status(404).send("No files found");
  }

  res.status(200).send(files);
 } catch (err) {
  console.error(err);
  res.status(500).send("Error retrieving files.");
 }
};

module.exports = { uploadFile, getFilesByType };
