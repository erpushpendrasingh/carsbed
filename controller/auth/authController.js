const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const NewUser = require("../../model/auth/user");
const Admin = require("../../model/auth/admin");

const otpStore = {};

// Send OTP (Simulated)
exports.sendOtp = async (req, res) => {
 try {
  const { mobile } = req.body;
  if (!mobile) {
   return res
    .status(400)
    .json({ success: false, error: "Mobile number is required" });
  }

  // Generate a fake OTP (for testing purposes)
  const fakeOtp = "123456"; // Simulate a static OTP
  otpStore[mobile] = fakeOtp; // Store it in-memory for testing

  console.log(`Fake OTP sent to ${mobile}: ${fakeOtp}`);

  res.status(200).json({
   success: true,
   message: `Fake OTP sent successfully to ${mobile}`,
   verificationSid: "fakeSidForTesting", // Simulated SID
  });
 } catch (error) {
  console.error("Error sending fake OTP:", error);
  res.status(500).json({ success: false, error: "Failed to send fake OTP" });
 }
};

// Verify OTP and Login/Register (Simulated)
exports.verifyOtp = async (req, res) => {
 try {
  const { mobile, otpCode, role, referralCode } = req.body;

  if (!mobile || !otpCode) {
   return res.status(400).json({
    success: false,
    error: "Mobile number and OTP code are required",
   });
  }

  // Simulated OTP verification
  if (otpStore[mobile] !== otpCode) {
   return res.status(400).json({
    success: false,
    error: "OTP verification failed (Simulated check).",
   });
  }

  let user = await NewUser.findOne({ mobile });

  if (!user) {
   // Register as a user by default
   const newReferralCode = crypto.randomBytes(4).toString("hex"); // Generate a unique referral code

   user = new NewUser({
    mobile,
    verify: true,
    role: "user",
    referralCode: newReferralCode,
   });

   // If a referral code was provided, find the referrer and set the referredBy field
   if (referralCode) {
    const referrer = await NewUser.findOne({ referralCode });
    if (referrer) {
     user.referredBy = referrer._id;
    }
   }

   await user.save();
  } else if (role && role === "vendor" && user.role === "user") {
   // User applies to become a vendor
   user.role = "vendor";
   user.status = "pending"; // Approval needed
   await user.save();
  } else {
   user.verify = true;
   await user.save();
  }

  // Generate JWT token
  const token = jwt.sign(
   { id: user._id, mobile: user.mobile, role: user.role },
   process.env.JWT_SECRET,
   {
    expiresIn: "1h",
   }
  );

  res.status(200).json({
   success: true,
   message: "OTP verified successfully (Simulated)",
   token,
   user,
  });
 } catch (error) {
  console.error("Error verifying fake OTP:", error);
  res.status(500).json({ success: false, error: "Failed to verify fake OTP" });
 }
};

// Vendor login with email and password after admin approval
exports.loginVendorWithEmail = async (req, res) => {
 try {
  const { email, password } = req.body;

  if (!email || !password) {
   return res
    .status(400)
    .json({ success: false, error: "Email and password are required" });
  }

  const vendor = await NewUser.findOne({ email, role: "vendor" });
  if (!vendor) {
   return res.status(404).json({ success: false, error: "Vendor not found" });
  }

  // Check if the vendor is approved by admin
  if (vendor.status !== "approved") {
   return res
    .status(403)
    .json({ success: false, error: "Vendor is not approved" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, vendor.password);
  if (!isMatch) {
   return res
    .status(400)
    .json({ success: false, error: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
   { id: vendor._id, email: vendor.email, role: vendor.role },
   process.env.JWT_SECRET,
   {
    expiresIn: "1h",
   }
  );

  res.status(200).json({
   success: true,
   message: "Logged in successfully",
   token,
   vendor,
  });
 } catch (error) {
  console.error("Error logging in vendor:", error);
  res.status(500).json({ success: false, error: "Failed to log in" });
 }
};

// Admin login
exports.loginAdmin = async (req, res) => {
 try {
  const { email, password } = req.body;

  if (!email || !password) {
   return res
    .status(400)
    .json({ success: false, error: "Email and password are required" });
  }

  const admin = await NewUser.findOne({ email, role: "admin" });
  if (!admin) {
   return res.status(404).json({ success: false, error: "Admin not found" });
  }

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
   return res
    .status(400)
    .json({ success: false, error: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
   { id: admin._id, email: admin.email, role: admin.role },
   process.env.JWT_SECRET,
   {
    expiresIn: "1h",
   }
  );

  res.status(200).json({
   success: true,
   message: "Logged in successfully",
   token,
   admin,
  });
 } catch (error) {
  console.error("Error logging in admin:", error);
  res.status(500).json({ success: false, error: "Failed to log in" });
 }
};

//*********************************************************************************************** */

// // Send OTP (Unified for both user and vendor)
// exports.sendOtp = async (req, res) => {
//  try {
//   const { mobile } = req.body;
//   if (!mobile) {
//    return res
//     .status(400)
//     .json({ success: false, error: "Mobile number is required" });
//   }

//   const verification = await client.verify.v2
//    .services(verifySid)
//    .verifications.create({ to: mobile, channel: "sms" });

//   res.status(200).json({
//    success: true,
//    message: "OTP sent successfully",
//    verificationSid: verification.sid,
//   });
//  } catch (error) {
//   console.error("Error sending OTP:", error);
//   res.status(500).json({ success: false, error: "Failed to send OTP" });
//  }
// };

// // Verify OTP and Login/Register (Unified for both user and vendor)
// exports.verifyOtp = async (req, res) => {
//  try {
//   const { mobile, otpCode, role } = req.body;

//   if (!mobile || !otpCode) {
//    return res.status(400).json({
//     success: false,
//     error: "Mobile number and OTP code are required",
//    });
//   }

//   const verificationCheck = await client.verify.v2
//    .services(verifySid)
//    .verificationChecks.create({ to: mobile, code: otpCode });

//   if (verificationCheck.status === "approved") {
//    let user = await NewUser.findOne({ mobile });

//    if (!user) {
//     // Register as a user by default
//     user = new User({ mobile, verify: true, role: "user" });
//     await user.save();
//    } else if (role && role === "vendor" && user.role === "user") {
//     // User applies to become a vendor
//     user.role = "vendor";
//     user.status = "pending"; // Approval needed
//     await user.save();
//    } else {
//     user.verify = true;
//     await user.save();
//    }

//    // Generate JWT token
//    const token = jwt.sign(
//     { id: user._id, mobile: user.mobile, role: user.role },
//     process.env.JWT_SECRET,
//     {
//      expiresIn: "1h",
//     }
//    );

//    res.status(200).json({
//     success: true,
//     message: "OTP verified successfully",
//     token,
//     user,
//    });
//   } else {
//    return res.status(400).json({
//     success: false,
//     error: "OTP verification failed",
//    });
//   }
//  } catch (error) {
//   console.error("Error verifying OTP:", error);
//   res.status(500).json({ success: false, error: "Failed to verify OTP" });
//  }
// };

// // Vendor login with email and password after admin approval
// exports.loginVendorWithEmail = async (req, res) => {
//  try {
//   const { email, password } = req.body;

//   if (!email || !password) {
//    return res
//     .status(400)
//     .json({ success: false, error: "Email and password are required" });
//   }

//   const vendor = await NewUser.findOne({ email, role: "vendor" });
//   if (!vendor) {
//    return res.status(404).json({ success: false, error: "Vendor not found" });
//   }

//   // Check if the vendor is approved by admin
//   if (vendor.status !== "approved") {
//    return res
//     .status(403)
//     .json({ success: false, error: "Vendor is not approved" });
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

//   res.status(200).json({
//    success: true,
//    message: "Logged in successfully",
//    token,
//    vendor,
//   });
//  } catch (error) {
//   console.error("Error logging in vendor:", error);
//   res.status(500).json({ success: false, error: "Failed to log in" });
//  }
// };

// // Admin login
// exports.loginAdmin = async (req, res) => {
//  try {
//   const { email, password } = req.body;

//   if (!email || !password) {
//    return res
//     .status(400)
//     .json({ success: false, error: "Email and password are required" });
//   }

//   const admin = await Admin.findOne({ email });
//   if (!admin) {
//    return res.status(404).json({ success: false, error: "Admin not found" });
//   }

//   const isMatch = await bcrypt.compare(password, admin.password);
//   if (!isMatch) {
//    return res
//     .status(400)
//     .json({ success: false, error: "Invalid credentials" });
//   }

//   // Generate JWT token
//   const token = jwt.sign(
//    { id: admin._id, email: admin.email, role: "admin" },
//    process.env.JWT_SECRET,
//    {
//     expiresIn: "1h",
//    }
//   );

//   res.status(200).json({
//    success: true,
//    message: "Logged in successfully",
//    token,
//    admin,
//   });
//  } catch (error) {
//   console.error("Error logging in admin:", error);
//   res.status(500).json({ success: false, error: "Failed to log in" });
//  }
// };
