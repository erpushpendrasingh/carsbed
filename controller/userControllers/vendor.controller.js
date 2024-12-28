const twilio = require("twilio");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Vendor = require("../../model/user/vendor.model");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

exports.addMobileAndSendOtp = async (req, res) => {
 try {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
   return res
    .status(400)
    .json({ success: false, error: "Phone number is required" });
  }

  // Send OTP
  const verification = await client.verify.v2
   .services(verifySid)
   .verifications.create({ to: phoneNumber, channel: "sms" });

  console.log(verification.sid);

  // Check if the vendor already exists
  const existingVendor = await Vendor.findOne({ mobile: phoneNumber });

  if (existingVendor) {
   return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    verificationSid: verification.sid,
   });
  }

  // Save the mobile number with default verify value
  const newVendor = new Vendor({
   mobile: phoneNumber,
   verify: false,
   vendor: false, // This is the default value but we set it explicitly for clarity
  });

  await newVendor.save();

  res.status(200).json({
   success: true,
   message: "OTP sent successfully and mobile number saved",
   verificationSid: verification.sid,
  });
 } catch (error) {
  console.error("Error sending OTP:", error);
  res.status(500).json({ success: false, error: "Failed to send OTP" });
 }
};

exports.verifyOtpAndUpdateMobile = async (req, res) => {
 try {
  const { phoneNumber, otpCode } = req.body;

  if (!phoneNumber || !otpCode) {
   return res.status(400).json({
    success: false,
    error: "Phone number and OTP code are required",
   });
  }

  const verificationCheck = await client.verify.v2
   .services(verifySid)
   .verificationChecks.create({ to: phoneNumber, code: otpCode });

  console.log(verificationCheck);

  if (verificationCheck.status === "approved") {
   const existingVendor = await Vendor.findOne({ mobile: phoneNumber });

   if (!existingVendor) {
    return res.status(404).json({
     success: false,
     error: "Vendor not found",
    });
   }

   if (existingVendor.verify) {
    return res.status(200).json({
     success: true,
     message: "Mobile number already verified",
    });
   }

   // Update the vendor's verify status to true
   existingVendor.verify = true;
   await existingVendor.save();

   res.status(200).json({
    success: true,
    message: "OTP verified and mobile number updated successfully",
    vendor: existingVendor,
   });
  } else {
   return res.status(400).json({
    success: false,
    error: "OTP verification failed",
   });
  }
 } catch (error) {
  console.error("Error verifying OTP:", error);
  res.status(500).json({
   success: false,
   error: "Failed to verify OTP",
  });
 }
};

exports.updateVendorDetails = async (req, res) => {
 try {
  const { phoneNumber, name, email, password } = req.body;

  if (!phoneNumber || !name || !email || !password) {
   return res.status(400).json({
    success: false,
    error: "Phone number, name, email, and password are required",
   });
  }

  const vendor = await Vendor.findOne({ mobile: phoneNumber });

  if (!vendor) {
   return res.status(404).json({
    success: false,
    error: "Vendor not found",
   });
  }

  if (!vendor.verify) {
   return res.status(403).json({
    success: false,
    error: "Vendor is not verified",
   });
  }

  vendor.name = name;
  vendor.email = email;
  vendor.password = password; // Note: Password will be hashed in the pre-save hook

  await vendor.save();

  res.status(200).json({
   success: true,
   message: "Vendor details updated successfully",
   vendor,
  });
 } catch (error) {
  console.error("Error updating vendor details:", error);
  res.status(500).json({
   success: false,
   error: "Failed to update vendor details",
  });
 }
};

exports.loginVendor = async (req, res) => {
 try {
  const { email, password } = req.body;
  console.log("Email entered:", email);
  console.log("Password entered:", password);

  if (!email || !password) {
   return res
    .status(400)
    .json({ success: false, error: "Email and password are required" });
  }

  // Find the vendor by email
  const vendor = await Vendor.findOne({ email });
  if (!vendor) {
   return res.status(404).json({ success: false, error: "Vendor not found" });
  }

  // Debug: Check stored password in the database
  console.log("Stored hashed password from DB:", vendor.password);

  // Manually hash the entered password for debugging
  const testHashedPassword = await bcrypt.hash(password, 10);
  console.log("Manually hashed entered password:", testHashedPassword);

  // Compare passwords using bcrypt
  const isMatch = await bcrypt.compare(password, vendor.password);
  console.log("Password match result (bcrypt.compare):", isMatch);

  if (!isMatch) {
   console.log("Passwords do not match");
   return res
    .status(400)
    .json({ success: false, error: "Invalid credentials" });
  }

  // Generate JWT token if password matches
  const token = jwt.sign(
   { id: vendor._id, email: vendor.email, role: vendor.role },
   process.env.JWT_SECRET,
   { expiresIn: "1h" }
  );

  res.status(200).json({
   success: true,
   message: "Logged in successfully",
   token,
   vendor,
  });
 } catch (error) {
  console.error("Error logging in vendor:", error);
  res.status(500).json({ success: false, error: "Failed to log in vendor" });
 }
};

// exports.loginVendor = async (req, res) => {
//  try {
//   const { email, password } = req.body;
//   console.log("email:", email);
//   console.log("password:", password);
//   if (!email || !password) {
//    return res
//     .status(400)
//     .json({ success: false, error: "Email and password are required" });
//   }

//   // Find the vendor by email
//   const vendor = await Vendor.findOne({ email });
//   // console.log("vendor:", vendor);
//   if (!vendor) {
//    return res.status(404).json({ success: false, error: "Vendor not found" });
//   }

//   // Check if the vendor is verified
//   if (!vendor.verify) {
//    return res
//     .status(403)
//     .json({ success: false, error: "Vendor is not verified" });
//   }

//   // Compare passwords
//   const isMatch = await bcrypt.compare(password, vendor.password);

//   if (!isMatch) {
//    return res
//     .status(400)
//     .json({ success: false, error: "Invalid credentials" });
//   }

//   // Generate JWT token
//   const token = jwt.sign(
//    { id: vendor._id, email: vendor.email, role: vendor.role },
//    process.env.JWT_SECRET,
//    {
//     expiresIn: "1h",
//    }
//   );
//   console.log("role:", vendor.role);
//   res.status(200).json({
//    success: true,
//    message: "Logged in successfully",
//    token,
//    vendor,
//    role: vendor.role,
//   });
//  } catch (error) {
//   console.error("Error logging in vendor:", error);
//   res.status(500).json({ success: false, error: "Failed to log in vendor" });
//  }
// };

exports.getAllVendor = async (req, res) => {
 try {
  const vendors = await Vendor.find();
  console.log("vendors:", vendors);
  res.status(200).json({ data: vendors });
 } catch (error) {
  console.error("Error getting vendors:", error);
  res.status(500).json({
   success: false,
   error: "Failed to get vendors",
  });
 }
};

exports.approveOrRejectVendor = async (req, res) => {
 try {
  const { vendorId, approve, rejectionReason } = req.body;

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
   return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  if (approve) {
   vendor.documentStatus = "approved";
   vendor.status = "accept";
  } else {
   vendor.documentStatus = "rejected";
   vendor.rejectionReason = rejectionReason || "Not specified";
   vendor.status = "pending";
  }

  await vendor.save();
  res.status(200).json({
   success: true,
   message: "Vendor status updated successfully",
   vendor,
  });
 } catch (error) {
  console.error("Error updating vendor status:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to update vendor status" });
 }
};

exports.updateVendorStatus = async (req, res) => {
 try {
  const { vendorId, status, reason } = req.body;

  if (!["delist", "hold", "block"].includes(status)) {
   return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
   return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  vendor.status = status;
  vendor.rejectionReason = reason || "";

  await vendor.save();
  res.status(200).json({
   success: true,
   message: "Vendor status updated successfully",
   vendor,
  });
 } catch (error) {
  console.error("Error updating vendor status:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to update vendor status" });
 }
};

exports.setBookingCaps = async (req, res) => {
 try {
  const { vendorId, dailyCap, monthlyCap } = req.body;

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
   return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  vendor.dailyBookingCap = dailyCap;
  vendor.monthlyBookingCap = monthlyCap;

  await vendor.save();
  res.status(200).json({
   success: true,
   message: "Booking caps updated successfully",
   vendor,
  });
 } catch (error) {
  console.error("Error setting booking caps:", error);
  res.status(500).json({ success: false, error: "Failed to set booking caps" });
 }
};
