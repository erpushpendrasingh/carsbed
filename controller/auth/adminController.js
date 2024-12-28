const NewUser = require("../../model/auth/user");
const Car = require("../../model/brand-car/car.model");

// Admin/User: Add a car to a user
// exports.addCarToUser = async (req, res) => {
//  try {
//   const { carId, userId } = req.body;
//   let targetUserId;

//   if (req.user.role === "user") {
//    // Users can only add cars to their own account
//    targetUserId = req.user.id;
//   } else if (req.user.role === "admin") {
//    // Admins can specify the userId to add the car to
//    if (!userId) {
//     return res
//      .status(400)
//      .json({ success: false, error: "User ID is required for admin requests" });
//    }
//    targetUserId = userId;
//   } else {
//    return res
//     .status(403)
//     .json({ success: false, error: "Unauthorized action" });
//   }

//   const user = await NewUser.findById(targetUserId);
//   if (!user) {
//    return res.status(404).json({ success: false, error: "User not found" });
//   }

//   const car = await Car.findById(carId);
//   if (!car) {
//    return res.status(404).json({ success: false, error: "Car not found" });
//   }

//   user.cars.push(carId);
//   user.currentCar = carId; // Set the last added car as the current car
//   await user.save();

//   res
//    .status(200)
//    .json({ success: true, message: "Car added successfully", user });
//  } catch (error) {
//   console.error("Error adding car to user:", error);
//   res.status(500).json({ success: false, error: "Failed to add car to user" });
//  }
// };

exports.addCarToUser = async (req, res) => {
 try {
  const { carId, userId } = req.body;
  let targetUserId;

  if (req.user.role === "user") {
   // Users can only add cars to their own account
   targetUserId = req.user.id;
  } else if (req.user.role === "admin") {
   // Admins can specify the userId to add the car to
   if (!userId) {
    return res
     .status(400)
     .json({ success: false, error: "User ID is required for admin requests" });
   }
   targetUserId = userId;
  } else {
   return res
    .status(403)
    .json({ success: false, error: "Unauthorized action" });
  }

  const user = await NewUser.findById(targetUserId);
  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  const car = await Car.findById(carId);
  if (!car) {
   return res.status(404).json({ success: false, error: "Car not found" });
  }

  // Check if the car is already in the user's list
  if (user.cars.includes(carId)) {
   return res
    .status(400)
    .json({ success: false, error: "Car already added to user" });
  }

  user.cars.push(carId);
  user.currentCar = carId; // Set the last added car as the current car
  await user.save();

  res
   .status(200)
   .json({ success: true, message: "Car added successfully", user });
 } catch (error) {
  console.error("Error adding car to user:", error);
  res.status(500).json({ success: false, error: "Failed to add car to user" });
 }
};
// Admin/User: Get all cars for a user (Admin can specify any user)
exports.getAllCars = async (req, res) => {
 try {
  let targetUserId;

  if (req.user.role === "user") {
   // Users can only see their own cars
   targetUserId = req.user.id;
  } else if (req.user.role === "admin") {
   // Admins can see cars for any user
   const { userId } = req.query;
   if (!userId) {
    return res
     .status(400)
     .json({ success: false, error: "User ID is required for admin requests" });
   }
   targetUserId = userId;
  } else {
   return res
    .status(403)
    .json({ success: false, error: "Unauthorized action" });
  }

  const user = await NewUser.findById(targetUserId).populate("cars");
  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  res.status(200).json({ success: true, cars: user.cars, user });
 } catch (error) {
  console.error("Error fetching cars for user:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to fetch cars for user" });
 }
};

// Admin: Delete a car from a user

exports.deleteCarFromUser = async (req, res) => {
 try {
  const { userId, carId } = req.body;

  const user = await NewUser.findById(userId);
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

// Admin: Set vendor limitations
exports.setVendorLimitations = async (req, res) => {
 try {
  const { vendorId, dailyCap, monthlyCap } = req.body;

  const vendor = await NewUser.findById(vendorId);
  if (!vendor || vendor.role !== "vendor") {
   return res.status(404).json({ success: false, error: "Vendor not found" });
  }

  vendor.dailyBookingCap = dailyCap;
  vendor.monthlyBookingCap = monthlyCap;

  await vendor.save();

  res.status(200).json({
   success: true,
   message: "Vendor limitations set successfully",
   vendor,
  });
 } catch (error) {
  console.error("Error setting vendor limitations:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to set vendor limitations" });
 }
};

// Admin: Approve vendor by checking documents
exports.approveVendor = async (req, res) => {
 try {
  const { vendorId } = req.body;

  const vendor = await NewUser.findById(vendorId);
  if (!vendor || vendor.role !== "vendor") {
   return res.status(404).json({ success: false, error: "Vendor not found" });
  }

  if (vendor.documentStatus !== "submitted") {
   return res
    .status(400)
    .json({ success: false, error: "Vendor documents not submitted" });
  }

  vendor.status = "approved";
  vendor.documentStatus = "approved";
  await vendor.save();

  res
   .status(200)
   .json({ success: true, message: "Vendor approved successfully", vendor });
 } catch (error) {
  console.error("Error approving vendor:", error);
  res.status(500).json({ success: false, error: "Failed to approve vendor" });
 }
};

// // const Car = require("../../model/brand-car/Car");
// const NewUser = require("../../model/auth/user");
// const Car = require("../../model/brand-car/car.model");

// // Admin: Add a car to a user
// exports.addCarToUser = async (req, res) => {
//  try {
//   const { carId, userId } = req.body;

//   let targetUserId;

//   if (req.user.role === "user") {
//    // If the requester is a user, they can only add cars to their own account
//    targetUserId = req.user.id;
//   } else if (req.user.role === "admin") {
//    // If the requester is an admin, they can specify the userId to add the car to
//    if (!userId) {
//     return res
//      .status(400)
//      .json({ success: false, error: "User ID is required for admin requests" });
//    }
//    targetUserId = userId;
//   } else {
//    return res
//     .status(403)
//     .json({ success: false, error: "Unauthorized action" });
//   }

//   const user = await NewUser.findById(targetUserId);
//   if (!user) {
//    return res.status(404).json({ success: false, error: "User not found" });
//   }

//   const car = await Car.findById(carId);
//   if (!car) {
//    return res.status(404).json({ success: false, error: "Car not found" });
//   }

//   user.cars.push(carId);
//   user.currentCar = carId; // Set the last added car as the current car
//   await user.save();

//   res
//    .status(200)
//    .json({ success: true, message: "Car added successfully", user });
//  } catch (error) {
//   console.error("Error adding car to user:", error);
//   res.status(500).json({ success: false, error: "Failed to add car to user" });
//  }
// };

// // Admin: Delete a car from a user
// exports.deleteCarFromUser = async (req, res) => {
//  try {
//   const { userId, carId } = req.body;

//   const user = await NewUser.findById(userId);
//   if (!user) {
//    return res.status(404).json({ success: false, error: "User not found" });
//   }

//   const carIndex = user.cars.findIndex((car) => car.toString() === carId);
//   if (carIndex === -1) {
//    return res
//     .status(404)
//     .json({ success: false, error: "Car not found in user's list" });
//   }

//   user.cars.splice(carIndex, 1);

//   if (user.currentCar.toString() === carId) {
//    user.currentCar =
//     user.cars.length > 0 ? user.cars[user.cars.length - 1] : null;
//   }

//   await user.save();

//   res.status(200).json({
//    success: true,
//    message: "Car deleted from user successfully",
//    user,
//   });
//  } catch (error) {
//   console.error("Error deleting car from user:", error);
//   res
//    .status(500)
//    .json({ success: false, error: "Failed to delete car from user" });
//  }
// };

// // Admin: Set vendor limitations
// exports.setVendorLimitations = async (req, res) => {
//  try {
//   const { vendorId, dailyCap, monthlyCap } = req.body;

//   const vendor = await NewUser.findById(vendorId);
//   if (!vendor || vendor.role !== "vendor") {
//    return res.status(404).json({ success: false, error: "Vendor not found" });
//   }

//   vendor.dailyBookingCap = dailyCap;
//   vendor.monthlyBookingCap = monthlyCap;

//   await vendor.save();

//   res.status(200).json({
//    success: true,
//    message: "Vendor limitations set successfully",
//    vendor,
//   });
//  } catch (error) {
//   console.error("Error setting vendor limitations:", error);
//   res
//    .status(500)
//    .json({ success: false, error: "Failed to set vendor limitations" });
//  }
// };

// // Admin: Approve vendor by checking documents
// exports.approveVendor = async (req, res) => {
//  try {
//   const { vendorId } = req.body;

//   const vendor = await NewUser.findById(vendorId);
//   if (!vendor || vendor.role !== "vendor") {
//    return res.status(404).json({ success: false, error: "Vendor not found" });
//   }

//   if (vendor.documentStatus !== "submitted") {
//    return res
//     .status(400)
//     .json({ success: false, error: "Vendor documents not submitted" });
//   }

//   vendor.status = "approved";
//   vendor.documentStatus = "approved";
//   await vendor.save();

//   res
//    .status(200)
//    .json({ success: true, message: "Vendor approved successfully", vendor });
//  } catch (error) {
//   console.error("Error approving vendor:", error);
//   res.status(500).json({ success: false, error: "Failed to approve vendor" });
//  }
// };
