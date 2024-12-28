// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const Vendor = require("./model/user/vendor.model");

// // Define the Vendor schema (assuming you already have this schema in your project)

// // MongoDB connection URL
// const mongoURI =
//  "mongodb+srv://arvmultimedia:1234@cluster0.mvezpot.mongodb.net/car-expert?retryWrites=true&w=majority&appName=Cluster0";

// // Function to hash passwords
// async function hashPassword(password) {
//  const salt = await bcrypt.genSalt(10);
//  return await bcrypt.hash(password, salt);
// }

// // Function to create admin users
// async function createAdmins() {
//  try {
//   // Connect to MongoDB
//   await mongoose.connect(mongoURI, {
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
//   });

//   // Hash passwords
//   const hashedPass1 = await hashPassword("12345");
//   const hashedPass2 = await hashPassword("12345");
//   const hashedPass3 = await hashPassword("12345");

//   // Admin data
//   const admins = [
//    {
//     name: "Vendor 1",
//     email: "vendor1@gmail.com",
//     password: hashedPass1,
//     mobile: "9999504503",
//     verify: true,
//     vendor: false,
//     status: "accept",
//     role: "vendor",
//     documentStatus: "approved",
//     rejectionReason: "",
//     dailyBookingCap: 0,
//     monthlyBookingCap: 0,
//     aadhaar: null,
//     panCard: null,
//     gstCertificate: null,
//     storePhoto: null,
//     city: "gorakhpur",
//     isOnline: true,
//    },
//    {
//     name: "Vendor 2",
//     email: "vendor2@gmail.com",
//     password: hashedPass2,
//     mobile: "9999999999",
//     verify: true,
//     vendor: true,
//     status: "accept",
//     role: "vendor",
//     documentStatus: "approved",
//     rejectionReason: "",
//     dailyBookingCap: 0,
//     monthlyBookingCap: 0,
//     aadhaar: null,
//     panCard: null,
//     gstCertificate: null,
//     storePhoto: null,
//     city: "noida",
//     isOnline: true,
//    },
//    {
//     name: "Admin 3",
//     email: "vendor3@gmail.com",
//     password: hashedPass3,
//     mobile: "9999999991",
//     verify: true,
//     vendor: true,
//     status: "accept",
//     role: "vendor",
//     documentStatus: "approved",
//     rejectionReason: "",
//     dailyBookingCap: 10,
//     monthlyBookingCap: 300,
//     aadhaar: null,
//     panCard: null,
//     gstCertificate: null,
//     storePhoto: null,
//     city: "delhi",
//     isOnline: true,
//    },
//   ];

//   // Insert admin users
//   await Vendor.insertMany(admins);
//   console.log("Admin accounts created successfully!");
//  } catch (error) {
//   console.error("Error creating admin accounts:", error);
//  } finally {
//   mongoose.connection.close();
//  }
// }

// // Call the function to create admins
// createAdmins();

// // const mongoose = require("mongoose");
// // const bcrypt = require("bcrypt");
// // const dotenv = require("dotenv");

// // dotenv.config();

// // // const User = require("./model/user/User");
// // // const Admin = require("./model/user/Admin");
// // const NewUser = require("./model/auth/user");
// // const Admin = require("./model/auth/admin");

// // mongoose
// //  .connect(
// //   "mongodb+srv://arvmultimedia:1234@cluster0.mvezpot.mongodb.net/car-expert?retryWrites=true&w=majority&appName=Cluster0",
// //   {
// //    useNewUrlParser: true,
// //    useUnifiedTopology: true,
// //   }
// //  )
// //  .then(() => console.log("MongoDB connected"))
// //  .catch((err) => console.log("MongoDB connection error:", err));

// // const seedData = async () => {
// //  try {
// //   // Clear existing data
// //   await NewUser.deleteMany({});
// //   await Admin.deleteMany({});

// //   // Password hashing
// //   const hashedVendorPassword = await bcrypt.hash("vendorpassword", 10);
// //   const hashedAdminPassword = await bcrypt.hash("adminpassword", 10);

// //   // Create users
// //   const user1 = new NewUser({
// //    name: "John Doe",
// //    email: "john@example.com",
// //    mobile: "+1234567891",
// //    role: "user",
// //    verify: true,
// //   });

// //   const user2 = new NewUser({
// //    name: "Jane Doe",
// //    email: "jane@example.com",
// //    mobile: "+1234567892",
// //    role: "user",
// //    verify: true,
// //   });

// //   // Create vendor
// //   const vendor = new NewUser({
// //    name: "Vendor Smith",
// //    email: "vendor@example.com",
// //    mobile: "+1234567893",
// //    role: "vendor",
// //    verify: true,
// //    status: "approved",
// //    password: hashedVendorPassword,
// //    documentStatus: "approved",
// //   });

// //   // Create admin
// //   const admin = new Admin({
// //    email: "admin@example.com",
// //    password: hashedAdminPassword,
// //   });

// //   // Save users, vendor, and admin to the database
// //   await user1.save();
// //   await user2.save();
// //   await vendor.save();
// //   await admin.save();

// //   console.log("Fake data inserted successfully!");
// //   process.exit();
// //  } catch (error) {
// //   console.error("Error seeding data:", error);
// //   process.exit(1);
// //  }
// // };

// // seedData();
