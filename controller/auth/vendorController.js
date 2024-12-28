// const NewUser = require("../../model/user/NewUser");

const NewUser = require("../../model/auth/user");
// const User = require("../../model/auth/user");

exports.uploadVendorDocument = async (req, res) => {
 try {
  const { vendorId, documentType, documentId } = req.body;

  const vendor = await NewUser.findById(vendorId);
  if (!vendor || vendor.role !== "vendor") {
   return res.status(404).json({ success: false, error: "Vendor not found" });
  }

  if (
   !["aadhaar", "panCard", "gstCertificate", "storePhoto"].includes(
    documentType
   )
  ) {
   return res
    .status(400)
    .json({ success: false, error: "Invalid document type" });
  }

  vendor.documents[documentType] = documentId;
  vendor.documentStatus = "submitted";
  await vendor.save();

  res
   .status(200)
   .json({ success: true, message: "Document uploaded successfully", vendor });
 } catch (error) {
  console.error("Error uploading vendor document:", error);
  res.status(500).json({ success: false, error: "Failed to upload document" });
 }
};

// Approve or reject vendor by admin
exports.approveOrRejectVendor = async (req, res) => {
 try {
  const { vendorId, approve, rejectionReason } = req.body;

  const vendor = await NewUser.findById(vendorId);
  if (!vendor || vendor.role !== "vendor") {
   return res.status(404).json({ success: false, error: "Vendor not found" });
  }

  if (approve) {
   vendor.status = "approved";
   vendor.documentStatus = "approved";
  } else {
   vendor.status = "rejected";
   vendor.documentStatus = "rejected";
   vendor.rejectionReason = rejectionReason || "Not specified";
  }

  await vendor.save();
  res.status(200).json({
   success: true,
   message: `Vendor status updated to ${vendor.status}`,
   vendor,
  });
 } catch (error) {
  console.error("Error updating vendor status:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to update vendor status" });
 }
};
