const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const User = require("../../model/user/user.model");
const Car = require("../../model/brand-car/car.model");
const Brand = require("../../model/brand-car/brand.model");

// Request OTP Controller
const requestOtp = async (req, res) => {
 try {
  const { phoneNumber } = req.body;

  if (!phoneNumber || phoneNumber.toString().length !== 10) {
   return res.status(400).json({
    success: false,
    error: "Valid 10-digit phone number is required",
   });
  }

  // Generate a random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Set OTP expiration time (e.g., 5 minutes from now)
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // checking if user exists then update otp or create new user
  let user = await User.findOneAndUpdate(
   { mobile: phoneNumber },
   { otp, otpExpiresAt, verify: false }, // Reset OTP and verification
   { new: true, upsert: true }
  );

  // Send OTP to user via SMS (Implement SMS service here)

  console.log(`Generated OTP for ${phoneNumber}: ${otp}`);

  return res.status(200).json({
   success: true,
   message: "OTP generated successfully. Please check your SMS.",
   otp: otp,
  });
 } catch (error) {
  console.error("Error generating OTP:", error);
  return res.status(500).json({
   success: false,
   error: "Failed to generate OTP",
   details: error.message,
  });
 }
};

// Verify OTP and Issue JWT Controller
const verifyOtp = async (req, res) => {
 try {
  const { phoneNumber, otpCode } = req.body;

  if (!phoneNumber || !otpCode) {
   return res.status(400).json({
    success: false,
    error: "Phone number and OTP code are required",
   });
  }

  // Find the user by phone number
  const user = await User.findOne({ mobile: phoneNumber });

  if (!user) {
   return res.status(400).json({ success: false, error: "User not found" });
  }

  // Check if OTP matches and is not expired
  if (user.otp === parseInt(otpCode) && user.otpExpiresAt > new Date()) {
   // OTP is valid, mark the user as verified
   user.verify = true;
   user.otp = undefined; // Clear the OTP
   user.otpExpiresAt = undefined; // Clear OTP expiration
   await user.save();

   // Generate a JWT token and include the user's role
   const token = jwt.sign(
    { id: user._id, mobile: user.mobile, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
   );

   return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    token, // Send the JWT token to the client
   });
  } else {
   return res
    .status(400)
    .json({ success: false, error: "Invalid or expired OTP" });
  }
 } catch (error) {
  console.error("Error verifying OTP:", error);
  return res
   .status(500)
   .json({ success: false, error: "Failed to verify OTP" });
 }
};

// const requestOtp = async (req, res) => {
//  try {
//   const { phoneNumber } = req.body;

//   if (!phoneNumber || phoneNumber.toString().length !== 10) {
//    return res.status(400).json({
//     success: false,
//     error: "Valid 10-digit phone number is required",
//    });
//   }

//   // Hardcode OTP as 1234 for all phone numbers
//   const otp = 1234;

//   // Set OTP expiration time (e.g., 5 minutes from now)
//   const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//   // Check if user exists, then update OTP or create new user
//   let user = await User.findOneAndUpdate(
//    { mobile: phoneNumber },
//    { otp, otpExpiresAt, verify: false }, // Reset OTP and verification
//    { new: true, upsert: true }
//   );

//   // You can implement an SMS service here to send the OTP to the user

//   console.log(`Generated OTP for ${phoneNumber}: ${otp}`);

//   return res.status(200).json({
//    success: true,
//    message: "OTP generated successfully. Please check your SMS.",
//    otp: otp, // For testing purposes, include OTP in response. Remove in production.
//   });
//  } catch (error) {
//   console.error("Error generating OTP:", error);
//   return res.status(500).json({
//    success: false,
//    error: "Failed to generate OTP",
//    details: error.message,
//   });
//  }
// };

// const verifyOtp = async (req, res) => {
//  try {
//   const { phoneNumber, otpCode } = req.body;

//   if (!phoneNumber || !otpCode) {
//    return res.status(400).json({
//     success: false,
//     error: "Phone number and OTP code are required",
//    });
//   }

//   // Find the user by phone number
//   const user = await User.findOne({ mobile: phoneNumber });

//   if (!user) {
//    return res.status(400).json({ success: false, error: "User not found" });
//   }

//   // Hardcoded OTP check (1234) and expiration check
//   if (otpCode === "1234" && user.otpExpiresAt > new Date()) {
//    // OTP is valid, mark the user as verified
//    user.verify = true;
//    user.otp = undefined; // Clear the OTP
//    user.otpExpiresAt = undefined; // Clear OTP expiration
//    await user.save();

//    // Generate a JWT token and include the user's role
//    const token = jwt.sign(
//     { id: user._id, mobile: user.mobile, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//    );

//    return res.status(200).json({
//     success: true,
//     message: "OTP verified successfully",
//     token, // Send the JWT token to the client
//    });
//   } else {
//    return res.status(400).json({
//     success: false,
//     error: "Invalid or expired OTP",
//    });
//   }
//  } catch (error) {
//   console.error("Error verifying OTP:", error);
//   return res.status(500).json({
//    success: false,
//    error: "Failed to verify OTP",
//   });
//  }
// };

// const requestOtp = async (req, res) => {
//  try {
//   const { phoneNumber } = req.body;

//   if (!phoneNumber || phoneNumber.toString().length !== 10) {
//    return res.status(400).json({
//     success: false,
//     error: "Valid 10-digit phone number is required",
//    });
//   }

//   // Check if the phone number is '9999999999', if so, assign OTP as 1234
//   const otp =
//    phoneNumber === "9999999999"
//     ? 1234
//     : Math.floor(1000 + Math.random() * 9000);

//   // Set OTP expiration time (e.g., 5 minutes from now)
//   const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//   // checking if user exists then update otp or create new user
//   let user = await User.findOneAndUpdate(
//    { mobile: phoneNumber },
//    { otp, otpExpiresAt, verify: false }, // Reset OTP and verification
//    { new: true, upsert: true }
//   );

//   // Send OTP to user via SMS (Implement SMS service here)

//   console.log(`Generated OTP for ${phoneNumber}: ${otp}`);

//   return res.status(200).json({
//    success: true,
//    message: "OTP generated successfully. Please check your SMS.",
//    otp: otp, // For testing purposes, include OTP in response. Remove in production.
//   });
//  } catch (error) {
//   console.error("Error generating OTP:", error);
//   return res.status(500).json({
//    success: false,
//    error: "Failed to generate OTP",
//    details: error.message,
//   });
//  }
// };

// // Verify OTP and Issue JWT Controller
// const verifyOtp = async (req, res) => {
//  try {
//   const { phoneNumber, otpCode } = req.body;

//   if (!phoneNumber || !otpCode) {
//    return res.status(400).json({
//     success: false,
//     error: "Phone number and OTP code are required",
//    });
//   }

//   // Find the user by phone number
//   const user = await User.findOne({ mobile: phoneNumber });

//   if (!user) {
//    return res.status(400).json({ success: false, error: "User not found" });
//   }

//   // Check if OTP matches and is not expired
//   if (user.otp === parseInt(otpCode) && user.otpExpiresAt > new Date()) {
//    // OTP is valid, mark the user as verified
//    user.verify = true;
//    user.otp = undefined; // Clear the OTP
//    user.otpExpiresAt = undefined; // Clear OTP expiration
//    await user.save();

//    // Generate a JWT token and include the user's role
//    const token = jwt.sign(
//     { id: user._id, mobile: user.mobile, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//    );

//    return res.status(200).json({
//     success: true,
//     message: "OTP verified successfully",
//     token, // Send the JWT token to the client
//    });
//   } else {
//    return res
//     .status(400)
//     .json({ success: false, error: "Invalid or expired OTP" });
//   }
//  } catch (error) {
//   console.error("Error verifying OTP:", error);
//   return res
//    .status(500)
//    .json({ success: false, error: "Failed to verify OTP" });
//  }
// };

// Get User Info Controller
// const getUserInfo = async (req, res) => {
//  try {
//   const userId = req.user.id;

//   const user = await User.findById(userId);

//   if (!user) {
//    return res.status(404).json({
//     success: false,
//     error: "User not found",
//    });
//   }

//   return res.status(200).json({
//    success: true,
//    data: user,
//   });
//  } catch (error) {
//   console.error("Error fetching user:", error);
//   return res.status(500).json({
//    success: false,
//    error: "Failed to fetch user",
//    details: error.message,
//   });
//  }
// };
// const getUserInfo = async (req, res) => {
//  try {
//   const userId = req.user.id;

//   // Find the user by ID and populate the currentCar field
//   const user = await User.findById(userId).populate("currentCar");

//   if (!user) {
//    return res.status(404).json({
//     success: false,
//     error: "User not found",
//    });
//   }

//   return res.status(200).json({
//    success: true,
//    data: user,
//   });
//  } catch (error) {
//   console.error("Error fetching user:", error);
//   return res.status(500).json({
//    success: false,
//    error: "Failed to fetch user",
//    details: error.message,
//   });
//  }
// };
const getUserInfo = async (req, res) => {
 try {
  const userId = req.user.id;

  // Find the user by ID and populate currentCar with brand name
  const user = await User.findById(userId).populate({
   path: "currentCar",
   populate: {
    path: "brand", // Populate the brand field inside currentCar
    select: "title", // Select only the brand name
   },
  });

  if (!user) {
   return res.status(404).json({
    success: false,
    error: "User not found",
   });
  }

  return res.status(200).json({
   success: true,
   data: user,
  });
 } catch (error) {
  console.error("Error fetching user:", error);
  return res.status(500).json({
   success: false,
   error: "Failed to fetch user",
   details: error.message,
  });
 }
};

// const requestOtp = async (req, res) => {
//   try {
//     const { phoneNumber } = req.body;

//     if (!phoneNumber) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Phone number is required" });
//     }
//     console.log("phoneNumber:", phoneNumber);
//     const verification = await client.verify.v2
//       .services(verifySid)
//       .verifications.create({ to: phoneNumber, channel: "sms" });

//     console.log(verification.sid);
//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//       verificationSid: verification.sid,
//     });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ success: false, error: "Failed to send OTP" });
//   }
// };

// const verifyOtp = async (req, res) => {
//   try {
//     const { phoneNumber, otpCode } = req.body;

//     if (!phoneNumber || !otpCode) {
//       return res.status(400).json({
//         success: false,
//         error: "Phone number and OTP code are required",
//       });
//     }

//     const verificationCheck = await client.verify.v2
//       .services(verifySid)
//       .verificationChecks.create({ to: phoneNumber, code: otpCode });

//     console.log(verificationCheck.status);

//     if (verificationCheck.status === "approved") {
//       const existingUser = await User.findOne({
//         mobile: phoneNumber,
//         verify: true,
//       });
//       if (existingUser) {
//         return res.status(200).json({
//           success: true,
//           message: "Mobile number already verified",
//         });
//       }

//       const user = new User({ verify: true, mobile: phoneNumber });
//       await user.save();

//       return res
//         .status(200)
//         .json({ success: true, message: "OTP verified successfully" });
//     } else {
//       return res
//         .status(400)
//         .json({ success: false, error: "OTP verification failed" });
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({ success: false, error: "Failed to verify OTP" });
//   }
// };
const saveAdditionalInfo = async (req, res) => {
 try {
  const mobile = req.body.phoneNumber;
  const {
   name,
   referral_code,
   house_no,
   address1,
   address2,
   pincode,
   landmark,
   selectedBrand,
   selectedCar, // Car ID to be added
   transmissionType,
   fuelType,
  } = req.body;

  // Find the user by mobile
  const user = await User.findOne({ mobile: mobile });

  // If user doesn't exist, return 404
  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  // Update user details
  user.name = name || user.name;
  user.referral_code = referral_code || user.referral_code;
  user.house_no = house_no || user.house_no;
  user.address1 = address1 || user.address1;
  user.address2 = address2 || user.address2;
  user.pincode = pincode || user.pincode;
  user.landmark = landmark || user.landmark;
  user.transmissionType = transmissionType || user.transmissionType;
  user.fuelType = fuelType || user.fuelType;
  user.selectedBrand = selectedBrand || user.selectedBrand;

  // Ensure that selectedCar is not null or undefined
  if (selectedCar) {
   // Check if the car already exists in the user's cars array
   if (!user.cars.includes(selectedCar)) {
    // Add the car to the user's cars array
    user.cars.push(selectedCar);
   }

   // Set the currentCar to the newly added or selected car
   user.currentCar = selectedCar;
  }

  // Save the updated user information
  await user.save();

  res.status(200).json({
   success: true,
   message: "Additional information saved successfully",
   user,
  });
 } catch (error) {
  console.error("Error saving additional information:", error);
  res.status(500).json({
   success: false,
   error: "Failed to save additional information",
  });
 }
};

// const saveAdditionalInfo = async (req, res) => {
//  try {
//   const mobile = req.body.phoneNumber;
//   const {
//    name,
//    referral_code,
//    house_no,
//    address1,
//    address2,
//    pincode,
//    landmark,
//    selectedBrand,
//    selectedCar,
//    transmissionType,
//    fuelType,
//   } = req.body;

//   const updatedUser = await User.findOneAndUpdate(
//    { mobile: mobile },
//    {
//     name: name,
//     referral_code: referral_code,
//     house_no: house_no,
//     address1: address1,
//     address2: address2,
//     pincode: pincode,
//     landmark: landmark,
//     selectedBrand: selectedBrand,
//     selectedCar: selectedCar,
//     transmissionType: transmissionType,
//     fuelType: fuelType,
//    },
//    { new: true }
//   );

//   if (!updatedUser) {
//    return res.status(404).json({ success: false, error: "User not found" });
//   }

//   res.status(200).json({
//    success: true,
//    message: "Additional information saved successfully",
//    user: updatedUser,
//   });
//  } catch (error) {
//   console.error("Error saving additional information:", error);
//   res
//    .status(500)
//    .json({ success: false, error: "Failed to save additional information" });
//  }
// };

const getAllUser = async (req, res) => {
 try {
  const allUsers = await User.find();
  res.status(200).json(allUsers);
 } catch (error) {
  console.error("Error fetching all users:", error);
  res.status(500).json({ success: false, error: "Failed to fetch all users" });
 }
};

const saveSelectedBrand = async (req, res) => {
 try {
  const { userId, brandId } = req.body;

  const brand = await Brand.findById(brandId);
  if (!brand) {
   return res.status(404).json({ success: false, error: "Brand not found" });
  }

  const user = await User.findByIdAndUpdate(
   userId,
   { selectedBrand: brandId },
   { new: true }
  ).populate("selectedBrand");

  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  res.status(200).json({ success: true, data: user });
 } catch (error) {
  console.error("Error saving selected brand:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to save selected brand" });
 }
};

const saveSelectedCar = async (req, res) => {
 try {
  const { userId, carId } = req.body;

  const car = await Car.findById(carId);
  if (!car) {
   return res.status(404).json({ success: false, error: "Car not found" });
  }

  const user = await User.findById(userId);
  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  user.cars.push(carId);
  user.currentCar = carId;
  await user.save();

  res.status(200).json({ success: true, data: user });
 } catch (error) {
  console.error("Error saving selected car:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to save selected car" });
 }
};
const getUserCars = async (req, res) => {
 try {
  const { userId } = req.params;

  // Fetch the user and populate the cars and currentCar fields
  const user = await User.findById(userId)
   .populate("cars")
   .populate("currentCar"); // Populate the currentCar field

  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  // Return the user's cars and currentCar
  res.status(200).json({
   success: true,
   data: user.cars,
   currentCar: user.currentCar,
   user,
  });
 } catch (error) {
  console.error("Error fetching user cars:", error);
  res.status(500).json({ success: false, error: "Failed to fetch user cars" });
 }
};
const deleteSelectedCar = async (req, res) => {
 try {
  const { userId, carId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  const carIndex = user.cars.findIndex((car) => car.toString() === carId);
  if (carIndex === -1) {
   return res
    .status(404)
    .json({ success: false, error: "Car not found in user's list" });
  }

  user.cars.splice(carIndex, 1);

  if (user.currentCar.toString() === carId) {
   user.currentCar =
    user.cars.length > 0 ? user.cars[user.cars.length - 1] : null;
  }

  await user.save();

  res.status(200).json({
   success: true,
   message: "Car deleted from user successfully",
   user,
  });
 } catch (error) {
  console.error("Error deleting car from user:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to delete car from user" });
 }
};
const switchCar = async (req, res) => {
 try {
  const { userId, carId } = req.body;
  console.log("userId:", userId);
  console.log("carId:", carId);
  const user = await User.findById(userId);
  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  const carExists = user.cars.includes(carId);
  if (!carExists) {
   return res
    .status(404)
    .json({ success: false, error: "Car not found in user's list" });
  }

  user.currentCar = carId;
  await user.save();

  res.status(200).json({
   success: true,
   message: "Current car switched successfully",
   currentCar: user.currentCar,
   user,
  });
 } catch (error) {
  console.error("Error switching car:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to switch current car" });
 }
};

module.exports = {
 requestOtp,
 verifyOtp,
 saveAdditionalInfo,
 getAllUser,
 saveSelectedBrand,
 saveSelectedCar,
 deleteSelectedCar,
 getUserCars,
 getUserInfo,
 switchCar,
};
