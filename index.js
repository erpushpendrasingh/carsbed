const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
// const corsOptions = {
//  origin: ["https://www.carexpert.org.in/", "*"], // Allow all origins, you can replace '*' with specific domain if needed
//  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//  allowedHeaders: ["Content-Type", "Authorization"],
//  optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

const brandRoutes = require("./routes/car-brand/brand.routes");
const carRoutes = require("./routes/car-brand/car.routes");
const subCategoryRoutes = require("./routes/products/subCategory.routes");
const { userRouter } = require("./routes/user/user.routes");
const { uploadRoute } = require("./trash/upload.routes");
const variantRoutes = require("./trash/variantRoutes");
const productRoutes = require("./routes/products/products.routes");
const productPriceBycar = require("./routes/products/productPriceBycar.routes");
const offerRoutes = require("./routes/offer-banner-reviews/offer.routes");
const bulkRoutes = require("./routes/bulk-action-routes/bulk.routes");
const reviewRoutes = require("./routes/offer-banner-reviews/reviews.routes");
const vendorRoutes = require("./routes/user/vendor.routes");
const categoryRoutes = require("./routes/products/category.routes.routes");
const testimonialVideoRouter = require("./routes/offer-banner-reviews/testimonialVideoRoutes.routes");
const cityRouter = require("./routes/service-provider/city");
const faqRoutes = require("./routes/user/faq.routes");
const partnerReviewRoutes = require("./routes/offer-banner-reviews/partner-reviews.routes");
const aboutRoutes = require("./routes/company_profile/about.routes");
const privacyPolicyRoutes = require("./routes/company_profile/privacyPolicy.routes");
const termsConditionsRoutes = require("./routes/company_profile/termsConditions.routes");
const referAndEarnRoutes = require("./routes/refer-coupon-wallet/referAndEarn.routes");
const couponCodeRoutes = require("./routes/refer-coupon-wallet/couponCode.routes");
const walletRoutes = require("./routes/refer-coupon-wallet/wallet.routes");
const cartRoutes = require("./routes/cart/cart.routes");
const slotRoutes = require("./routes/cart/slot.routes");
const sparePartRoutes = require("./routes/products/sparePartRoutes");
const orderRoutes = require("./routes/cart/order.routes");
const bookingRoutes = require("./routes/general/bookingRoutes");

const authRouter = require("./routes/auth/authRoutes");
const vendorRouter = require("./routes/auth/vendorRoutes");
const bcrypt = require("bcrypt");
const adminRouter = require("./routes/auth/adminRoutes");
const referRouter = require("./routes/auth/referRoutes");
const AdminSettingsRouter = require("./routes/payment/adminSetting");
const addressRouter = require("./routes/cart/address");
const ContactRouter = require("./routes/nodemailer/Contact");
const FranchiseRouter = require("./routes/nodemailer/franchise");
const BookingRouter = require("./routes/nodemailer/CarBooking");
const refundAndPolicyRouter = require("./routes/company_profile/refundAndPolicy");
// const refundAndPolicyRouter = require("./routes/About-PrivacyPolicy-TermsConditions/refundAndPolicy");
const contactRoutesCompany = require("./routes/company_profile/ContactUs");
const toolRoutes = require("./routes/products/toolRoutes");
const forgotRouter = require("./routes/user/authRoutes");
const paymentRouter = require("./routes/website/paymentRoutes");
const bookingRouter = require("./routes/website/bookingRoutes");
const addressRoutes = require("./routes/address/address");
const carPriceRouter = require("./routes/bulk-routes/productPriceBulkByCar");
const franchiseRoutes = require("./routes/website/franchiseRoutes");

const allowedOrigins = [
 "https://www.carexpert.org.in", // Production domain
 "https://carexpert.org.in/",
 "http://localhost:3000", // Development domain, add others as needed
 "http://localhost:3001", // Development domain, add others as needed
 "*", // Development domain, add others as needed
];
// const corsOptions = {
//  origin: (origin, callback) => {
//   // Allow requests with no origin (like mobile apps or curl requests)
//   if (!origin) return callback(null, true);

//   // Only allow requests from specific origins
//   if (allowedOrigins.includes(origin)) {
//    callback(null, true);
//   } else {
//    callback(new Error("Not allowed by CORS"));
//   }
//  },
//  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//  allowedHeaders: ["Content-Type", "Authorization"],
//  optionsSuccessStatus: 200, // For legacy browsers
// };

app.use(cors({ origin: "*" }));
app.use(cors());
// app.options("*", cors());
app.use(express.json());

app.use("/api/brands", brandRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/users", userRouter);
app.use("/api/vendor", vendorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subCategories", subCategoryRoutes);
app.use("/api/variant", variantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bulk", bulkRoutes);
app.use("/api", uploadRoute);
app.use("/api/price", productPriceBycar);
app.use("/api", offerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/partner-reviews", partnerReviewRoutes);
app.use("/api/testimonial-videos", testimonialVideoRouter);
app.use("/api/cart", cartRoutes);
app.use("/api", cityRouter);
app.use("/api", faqRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/privacy-policy", privacyPolicyRoutes);
app.use("/api/terms-conditions", termsConditionsRoutes);
app.use("/api/refer-and-earn", referAndEarnRoutes);
app.use("/api/coupon-codes", couponCodeRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/spareparts", sparePartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookingFee", bookingRoutes);
app.use("/api/auth", authRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/refer", referRouter);
app.use("/api/admin-settings", AdminSettingsRouter);
app.use("/api/address", addressRouter);
app.use("/api", ContactRouter);
app.use("/api", FranchiseRouter);
app.use("/api", BookingRouter);
app.use("/api", refundAndPolicyRouter);
app.use("/api/profile", contactRoutesCompany);
app.use("/api/tools", toolRoutes);
app.use("/api", forgotRouter);
app.use("/api/payment", paymentRouter); // Payment route
app.use("/api", bookingRouter); // Booking route
app.use("/api", addressRoutes);
app.use("/api/franchise", franchiseRoutes);
app.use(carPriceRouter);
app.get("/", async (req, res) => {
 try {
  res.send("Welcome to car expert");
 } catch (error) {}
});

connectDB()
 .then(() => {
  app.listen(process.env.port, () => {
   console.log(`Server is running on port ${process.env.port}`);
  });
 })
 .catch((error) => {
  console.error("Error connecting to MongoDB:", error);
 });

// const connectDB = require("./config/db");
// const express = require("express");
// const cors = require("cors");
// const app = express();

// require("dotenv").config();
// app.use(express.json());
// // Define allowed origins for CORS

// // Define allowed origins for CORS
// const allowedOrigins = [
//  "https://carexpert.org.in",
//  "https://admin.carexpert.org.in",
// ];

// // CORS options configuration
// const corsOptions = {
//  origin: function (origin, callback) {
//   console.log("Request Origin:", origin); // Debug log for incoming origin
//   if (!origin || allowedOrigins.includes(origin)) {
//    callback(null, true);
//   } else {
//    console.error("Blocked by CORS:", origin); // Log blocked origins for debugging
//    callback(new Error("Not allowed by CORS"));
//   }
//  },
//  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//  allowedHeaders: ["Content-Type", "Authorization"],
//  credentials: true, // Allow cookies or authorization headers to be sent in the request
//  optionsSuccessStatus: 200, // For legacy browsers
// };

// // Apply CORS middleware with the specified options
// app.use(cors(corsOptions));

// // Enable preflight requests for all routes
// app.options("*", cors(corsOptions));

// const brandRoutes = require("./routes/car-brand/brand.routes");
// const carRoutes = require("./routes/car-brand/car.routes");
// const subCategoryRoutes = require("./routes/products/subCategory.routes");
// const { userRouter } = require("./routes/user/user.routes");
// const { uploadRoute } = require("./trash/upload.routes");
// const variantRoutes = require("./trash/variantRoutes");
// const productRoutes = require("./routes/products/products.routes");
// const productPriceBycar = require("./routes/products/productPriceBycar.routes");
// const offerRoutes = require("./routes/offer-banner-reviews/offer.routes");
// const bulkRoutes = require("./routes/bulk-action-routes/bulk.routes");
// const reviewRoutes = require("./routes/offer-banner-reviews/reviews.routes");
// const vendorRoutes = require("./routes/user/vendor.routes");
// const categoryRoutes = require("./routes/products/category.routes.routes");
// const testimonialVideoRouter = require("./routes/offer-banner-reviews/testimonialVideoRoutes.routes");
// const cityRouter = require("./routes/service-provider/city");
// const faqRoutes = require("./routes/user/faq.routes");
// const partnerReviewRoutes = require("./routes/offer-banner-reviews/partner-reviews.routes");
// const referAndEarnRoutes = require("./routes/refer-coupon-wallet/referAndEarn.routes");
// const couponCodeRoutes = require("./routes/refer-coupon-wallet/couponCode.routes");
// const walletRoutes = require("./routes/refer-coupon-wallet/wallet.routes");
// const cartRoutes = require("./routes/cart/cart.routes");
// const slotRoutes = require("./routes/cart/slot.routes");
// const sparePartRoutes = require("./routes/products/sparePartRoutes");
// const orderRoutes = require("./routes/cart/order.routes");
// const termsConditionsRoutes = require("./routes/company_profile/termsConditions.routes");
// const privacyPolicyRoutes = require("./routes/company_profile/privacyPolicy.routes");
// const aboutRoutes = require("./routes/company_profile/about.routes");
// app.use("/api/brands", brandRoutes);
// app.use("/api/cars", carRoutes);
// app.use("/api/users", userRouter);
// app.use("/api/vendor", vendorRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/subCategories", subCategoryRoutes);
// app.use("/api/variant", variantRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/bulk", bulkRoutes);
// app.use("/api", uploadRoute);
// app.use("/api/price", productPriceBycar);
// app.use("/api", offerRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/partner-reviews", partnerReviewRoutes);
// app.use("/api/testimonial-videos", testimonialVideoRouter);
// app.use("/api/cart", cartRoutes);
// app.use("/api", cityRouter);
// app.use("/api", faqRoutes);
// app.use("/api/about", aboutRoutes);
// app.use("/api/privacy-policy", privacyPolicyRoutes);
// app.use("/api/terms-conditions", termsConditionsRoutes);
// app.use("/api/refer-and-earn", referAndEarnRoutes);
// app.use("/api/coupon-codes", couponCodeRoutes);
// app.use("/api/wallets", walletRoutes);
// app.use("/api/slots", slotRoutes);
// app.use("/api/spareparts", sparePartRoutes);
// app.use("/api/orders", orderRoutes);
// app.get("/", async (req, res) => {
//  try {
//   res.send("Welcome to car expert");
//  } catch (error) {}
// });

// connectDB()
//  .then(() => {
//   app.listen(process.env.port, () => {
//    console.log(`Server is running on port ${process.env.port}`);
//   });
//  })
//  .catch((error) => {
//   console.error("Error connecting to MongoDB:", error);
//  });

// // const connectDB = require("./config/db");
// // const express = require("express");
// // const cors = require("cors");
// // const bcrypt = require("bcrypt");
// // const app = express();
// // require("dotenv").config();

// // // Define allowed origins for CORS
// // const allowedOrigins = [
// //  "https://admin.carexpert.org.in",
// //  "https://www.carexpert.org.in", // Production domain
// //  "http://localhost:3001", // Development domain
// //  "http://localhost:3000", // Development domain
// // ];

// // const corsOptions = {
// //  origin: (origin, callback) => {
// //   // Allow requests with no origin (like mobile apps or curl requests)
// //   if (!origin || allowedOrigins.includes(origin)) {
// //    callback(null, true);
// //   } else {
// //    callback(new Error("Not allowed by CORS"));
// //   }
// //  },
// //  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //  allowedHeaders: ["Content-Type", "Authorization"],
// //  optionsSuccessStatus: 200,
// // };

// // app.use(cors(corsOptions));
// // app.options("*", cors(corsOptions)); // Enable pre-flight across all routes
// // app.use(express.json());

// // // Import Routes
// // const brandRoutes = require("./routes/car-brand/brand.routes");
// // const carRoutes = require("./routes/car-brand/car.routes");
// // const subCategoryRoutes = require("./routes/products/subCategory.routes");
// // const { userRouter } = require("./routes/user/user.routes");
// // const { uploadRoute } = require("./trash/upload.routes");
// // const variantRoutes = require("./trash/variantRoutes");
// // const productRoutes = require("./routes/products/products.routes");
// // const productPriceBycar = require("./routes/products/productPriceBycar.routes");
// // const offerRoutes = require("./routes/offer-banner-reviews/offer.routes");
// // const bulkRoutes = require("./routes/bulk-action-routes/bulk.routes");
// // const reviewRoutes = require("./routes/offer-banner-reviews/reviews.routes");
// // const vendorRoutes = require("./routes/user/vendor.routes");
// // const categoryRoutes = require("./routes/products/category.routes.routes");
// // const testimonialVideoRouter = require("./routes/offer-banner-reviews/testimonialVideoRoutes.routes");
// // const cityRouter = require("./routes/service-provider/city");
// // const faqRoutes = require("./routes/user/faq.routes");
// // const partnerReviewRoutes = require("./routes/offer-banner-reviews/partner-reviews.routes");
// // const aboutRoutes = require("./routes/company_profile/about.routes");
// // const privacyPolicyRoutes = require("./routes/company_profile/privacyPolicy.routes");
// // const termsConditionsRoutes = require("./routes/company_profile/termsConditions.routes");
// // const referAndEarnRoutes = require("./routes/refer-coupon-wallet/referAndEarn.routes");
// // const couponCodeRoutes = require("./routes/refer-coupon-wallet/couponCode.routes");
// // const walletRoutes = require("./routes/refer-coupon-wallet/wallet.routes");
// // const cartRoutes = require("./routes/cart/cart.routes");
// // const slotRoutes = require("./routes/cart/slot.routes");
// // const sparePartRoutes = require("./routes/products/sparePartRoutes");
// // const orderRoutes = require("./routes/cart/order.routes");
// // const bookingRoutes = require("./routes/general/bookingRoutes");
// // const authRouter = require("./routes/auth/authRoutes");
// // const vendorRouter = require("./routes/auth/vendorRoutes");
// // const adminRouter = require("./routes/auth/adminRoutes");
// // const referRouter = require("./routes/auth/referRoutes");
// // const AdminSettingsRouter = require("./routes/payment/adminSetting");
// // const addressRouter = require("./routes/cart/address");
// // const ContactRouter = require("./routes/nodemailer/Contact");
// // const FranchiseRouter = require("./routes/nodemailer/franchise");
// // const BookingRouter = require("./routes/nodemailer/CarBooking");
// // const refundAndPolicyRouter = require("./routes/company_profile/refundAndPolicy");
// // const contactRoutesCompany = require("./routes/company_profile/ContactUs");
// // const toolRoutes = require("./routes/products/toolRoutes");
// // const forgotRouter = require("./routes/user/authRoutes");
// // const paymentRouter = require("./routes/website/paymentRoutes");
// // const bookingRouter = require("./routes/website/bookingRoutes");
// // const addressRoutes = require("./routes/address/address");
// // const carPriceRouter = require("./routes/bulk-routes/productPriceBulkByCar");
// // const franchiseRoutes = require("./routes/website/franchiseRoutes");

// // // Define Routes
// // app.use("/api/brands", brandRoutes);
// // app.use("/api/cars", carRoutes);
// // app.use("/api/users", userRouter);
// // app.use("/api/vendor", vendorRoutes);
// // app.use("/api/categories", categoryRoutes);
// // app.use("/api/subCategories", subCategoryRoutes);
// // app.use("/api/variant", variantRoutes);
// // app.use("/api/products", productRoutes);
// // app.use("/api/bulk", bulkRoutes);
// // app.use("/api", uploadRoute);
// // app.use("/api/price", productPriceBycar);
// // app.use("/api", offerRoutes);
// // app.use("/api/reviews", reviewRoutes);
// // app.use("/api/partner-reviews", partnerReviewRoutes);
// // app.use("/api/testimonial-videos", testimonialVideoRouter);
// // app.use("/api/cart", cartRoutes);
// // app.use("/api", cityRouter);
// // app.use("/api", faqRoutes);
// // app.use("/api/about", aboutRoutes);
// // app.use("/api/privacy-policy", privacyPolicyRoutes);
// // app.use("/api/terms-conditions", termsConditionsRoutes);
// // app.use("/api/refer-and-earn", referAndEarnRoutes);
// // app.use("/api/coupon-codes", couponCodeRoutes);
// // app.use("/api/wallets", walletRoutes);
// // app.use("/api/slots", slotRoutes);
// // app.use("/api/spareparts", sparePartRoutes);
// // app.use("/api/orders", orderRoutes);
// // app.use("/api/bookingFee", bookingRoutes);
// // app.use("/api/auth", authRouter);
// // app.use("/api/admin", adminRouter);
// // app.use("/api/refer", referRouter);
// // app.use("/api/admin-settings", AdminSettingsRouter);
// // app.use("/api/address", addressRouter);
// // app.use("/api", ContactRouter);
// // app.use("/api", FranchiseRouter);
// // app.use("/api", BookingRouter);
// // app.use("/api", refundAndPolicyRouter);
// // app.use("/api/profile", contactRoutesCompany);
// // app.use("/api/tools", toolRoutes);
// // app.use("/api", forgotRouter);
// // app.use("/api/payment", paymentRouter);
// // app.use("/api", bookingRouter);
// // app.use("/api", addressRoutes);
// // app.use("/api/franchise", franchiseRoutes);
// // app.use(carPriceRouter);

// // app.get("/", async (req, res) => {
// //  try {
// //   res.send("Welcome to car expert");
// //  } catch (error) {
// //   console.error("Error in root route:", error);
// //   res.status(500).send("Internal Server Error");
// //  }
// // });

// // // Example bcrypt usage
// // const hashedPassword =
// //  "$2b$10$hv4fXYt9Z/5Admhyb8YjAeI8wosfCILeCWAmCpNm.Kb/k0Kw6OeFO";
// // const plainPassword = "123456";

// // // Compare the password with the hashed password
// // bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
// //  if (err) {
// //   console.error("Error comparing passwords:", err);
// //  } else {
// //   console.log(result ? "Password matches!" : "Password does not match.");
// //  }
// // });

// // // Example bcrypt hashing
// // bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
// //  if (err) {
// //   console.error("Error hashing password:", err);
// //  } else {
// //   console.log("Hashed Password:", hashedPassword);
// //  }
// // });

// // // Connect to Database and Start Server
// // connectDB()
// //  .then(() => {
// //   const port = process.env.PORT || 8900;
// //   app.listen(port, () => {
// //    console.log(`Server is running on port ${port}`);
// //   });
// //  })
// //  .catch((error) => {
// //   console.error("Error connecting to MongoDB:", error);
// //  });
