const mongoose = require("mongoose"); // Import mongoose
const xlsx = require("xlsx");
const Car = require("../../model/brand-car/car.model");
const Brand = require("../../model/brand-car/brand.model");
const CarPrice = require("../../model/products/productPriceBycar.model"); // Assuming you have a CarPrice model

exports.createCarPricesFromExcel = async (req, res) => {
 try {
  const file = req.file;

  // Check if the file is provided
  if (!file) {
   return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  // Parse Excel file
  const workbook = xlsx.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Guard against empty or improperly formatted sheet data
  if (!sheetData || sheetData.length === 0) {
   return res.status(400).json({
    success: false,
    message: "Excel file is empty or improperly formatted",
   });
  }

  const carPricePromises = sheetData.map(async (row) => {
   let { brand, model, transmission, fuelType, mrp, actualPrice, productId } =
    row;

   // Normalize (trim) the values from the Excel file
   brand = brand.trim();
   model = model.trim();
   transmission = transmission.trim();
   fuelType = fuelType.trim();

   // Find the brand to get its ObjectId
   const foundBrand = await Brand.findOne({ title: brand });
   if (!foundBrand) {
    console.log(`Brand not found for: '${brand}'`);
    return null;
   }

   // Find the car matching the brand, model, transmissionType, and fuelType
   const car = await Car.findOne({
    brand: foundBrand._id,
    title: model,
    transmissionType: transmission,
    fuelType: fuelType,
   });

   if (!car) {
    console.log(
     `No cars found for model: ${model}, transmission: ${transmission}, fuelType: ${fuelType}`
    );
    return null;
   }

   // Log the found car
   console.log(
    `Found car for model: ${model}, transmission: ${transmission}, fuelType: ${fuelType}`
   );

   // Create or update the car price in the CarPrice collection
   const carPrice = await CarPrice.findOneAndUpdate(
    {
     carId: car._id,
     productId: productId, // Assuming productId is part of the car price
    },
    {
     mrp: mrp,
     givenPrice: actualPrice,
    },
    { upsert: true, new: true } // This will create a new price if it doesn't exist
   );

   console.log(`Price updated/created for carId: ${car._id}`);
  });

  // Await all promises to finish processing
  await Promise.all(carPricePromises);

  // Return success message
  return res.status(200).json({
   success: true,
   message: "Car prices updated/created successfully",
  });
 } catch (error) {
  console.error("Error processing file or updating car prices:", error);
  return res.status(500).json({
   success: false,
   message:
    "An error occurred while processing the file and updating car prices",
  });
 }
};

// const mongoose = require("mongoose"); // Import mongoose
// const xlsx = require("xlsx");
// const Car = require("../../model/brand-car/car.model");
// const Brand = require("../../model/brand-car/brand.model");

// exports.createCarPricesFromExcel = async (req, res) => {
//  try {
//   const file = req.file;

//   // Check if the file is provided
//   if (!file) {
//    return res.status(400).json({ success: false, message: "No file uploaded" });
//   }

//   // Parse Excel file
//   const workbook = xlsx.read(file.buffer, { type: "buffer" });
//   const sheetName = workbook.SheetNames[0];
//   const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//   // Guard against empty or improperly formatted sheet data
//   if (!sheetData || sheetData.length === 0) {
//    return res.status(400).json({
//     success: false,
//     message: "Excel file is empty or improperly formatted",
//    });
//   }

//   const carIds = []; // To store all car IDs found

//   // Log all cars for the brand from the database for debugging
//   const carsForBrand = await Car.find({
//    brand: new mongoose.Types.ObjectId("668e25528856e5daa23778dc"),
//   });
//   console.log("Cars under 'Toyota':", carsForBrand); // Log all cars for Toyota

//   // Process each row from Excel file
//   const carPricePromises = sheetData.map(async (row) => {
//    let { brand, model, transmission, fuelType } = row;

//    // Normalize (trim and convert to lowercase) the values from the Excel file
//    brand = brand.trim();
//    console.log(`Brand from Excel: '${brand}'`);
//    model = model;
//    transmission = transmission;
//    fuelType = fuelType;

//    // Find the brand first to get its ObjectId
//    const foundBrand = await Brand.findOne({ title: brand });
//    if (!foundBrand) {
//     console.log(`Brand not found for: '${brand}'`);
//     return null;
//    }

//    // Log the found brand and query values for debugging
//    console.log(`Found brand for: '${brand}', id: ${foundBrand._id}`);
//    console.log(
//     `Looking for cars with model: ${model}, transmission: ${transmission}, fuelType: ${fuelType}`
//    );

//    // Log the stored car data before querying for a match
//    carsForBrand.forEach((car) => {
//     console.log(
//      `Stored car data - model: ${car.title}, transmission: ${car.transmissionType}, fuelType: ${car.fuelType}`
//     );
//    });

//    // Find cars matching the brand, model, transmissionType, and fuelType with exact matching
//    const cars = await Car.find({
//     brand: foundBrand._id, // Match brand by ObjectId
//     title: model, // Exact match for model
//     transmissionType: transmission, // Exact match for transmissionType
//     fuelType: fuelType, // Exact match for fuelType
//    });

//    // If matching cars are found, collect their IDs
//    if (cars.length > 0) {
//     cars.forEach((car) => {
//      carIds.push(car._id);
//     });
//     console.log(
//      `Found car for model: ${model}, transmission: ${transmission}, fuelType: ${fuelType}`
//     );
//    } else {
//     console.log(
//      `No cars found for model: ${model}, transmission: ${transmission}, fuelType: ${fuelType}`
//     );
//    }
//   });

//   // Await all promises
//   await Promise.all(carPricePromises);

//   // Return the car IDs found
//   return res.status(200).json({
//    success: true,
//    message: `${carIds.length} cars found`,
//    carIds, // Return the list of car IDs
//   });
//  } catch (error) {
//   console.error("Error processing file or fetching car IDs:", error);
//   return res.status(500).json({
//    success: false,
//    message: "An error occurred while processing the file and fetching car IDs",
//   });
//  }
// };
