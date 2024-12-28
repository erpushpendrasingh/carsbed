const { default: mongoose } = require("mongoose");
const upload = require("../../middleware/upload");
const Car = require("../../model/brand-car/car.model");

const createCar = async (req, res) => {
 try {
  const { brand, title, transmissionTypes, fuelTypes } = req.body;
  const imageUrl = req.file ? req.file.location : null; // The URL of the uploaded image
  if (!brand || !title || !transmissionTypes || !fuelTypes || !imageUrl) {
   return res.status(400).json({ error: "Missing required fields" });
  }

  const existingCar = await Car.findOne({ title });
  if (existingCar) {
   return res.status(400).json({ error: "Car with this name already exists" });
  }

  const transmissionArray = transmissionTypes.split(",");
  const fuelTypeArray = fuelTypes.split(",");

  const promises = transmissionArray
   .map((transmission) =>
    fuelTypeArray.map((fuelType) =>
     new Car({
      brand,
      title,
      images: imageUrl,
      transmissionType: transmission,
      fuelType,
     }).save()
    )
   )
   .flat();

  await Promise.all(promises);
  res.status(201).json({ message: "Cars added successfully" });
 } catch (error) {
  console.error("Error saving the car:", error);
  res.status(500).json({ error: "Error saving the car" });
 }
};

const getAllCars = async (req, res) => {
 const { title, transmissionType, fuelType, brand } = req.query;
 const filter = {};

 if (title) filter.title = new RegExp(title, "i");
 if (transmissionType) filter.transmissionType = transmissionType;
 if (fuelType) filter.fuelType = fuelType;
 if (brand) filter["brand.title"] = new RegExp(brand, "i");

 try {
  const cars = await Car.find(filter).populate("brand").sort({ createdAt: -1 }); // Sort by creation date in descending order
  res.json(cars);
 } catch (error) {
  res.status(500).json({ message: "Error fetching cars", error });
 }
};

const getCarById = async (req, res) => {
 try {
  const car = await Car.findById(req.params.id).populate("brand");
  if (!car) {
   return res.status(404).json({ success: false, error: "Car not found" });
  }
  res.status(200).json({ success: true, data: car });
 } catch (error) {
  console.error("Error fetching car:", error);
  res.status(500).json({ success: false, error: "Failed to fetch car" });
 }
};
const getCarsByIds = async (req, res) => {
 try {
  const { ids } = req.body; // Expecting an array of IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
   return res
    .status(400)
    .json({ success: false, error: "Invalid or empty IDs array" });
  }

  const cars = await Car.find({ _id: { $in: ids } }).populate("brand");
  if (!cars || cars.length === 0) {
   return res.status(404).json({ success: false, error: "No cars found" });
  }

  res.status(200).json({ success: true, data: cars });
 } catch (error) {
  console.error("Error fetching cars:", error);
  res.status(500).json({ success: false, error: "Failed to fetch cars" });
 }
};

const updateCarsByTitle = async (req, res) => {
 const { title } = req.params;
 const { brandId, newTitle, imageFile, transmissionTypes, fuelTypes } =
  req.body;

 try {
  // Validate input
  if (!brandId || !newTitle || !transmissionTypes || !fuelTypes) {
   return res.status(400).json({ message: "Missing required fields" });
  }

  // Update all cars with the given title

  const updatedCars = await Car.updateMany(
   { title },
   {
    $set: {
     brand: brandId,
     title: newTitle,
     transmissionType: { $in: transmissionTypes },
     fuelType: { $in: fuelTypes },
     images: imageFile || undefined,
    },
   },
   { multi: true }
  );

  res
   .status(200)
   .json({ message: "Cars updated successfully", data: updatedCars });
 } catch (error) {
  console.error("Error updating cars:", error);
  res.status(500).json({ message: "Server error", error });
 }
};

const deleteCar = async (req, res) => {
 try {
  const { title } = req.params;
  const result = await Car.deleteMany({ title });
  res
   .status(200)
   .json({ success: true, message: "Cars deleted successfully", result });
 } catch (error) {
  res
   .status(500)
   .json({ success: false, message: "Error deleting cars", error });
 }
};

const getCarsByBrand = async (req, res) => {
 try {
  const cars = await Car.find({ brand: req.params.brandId }).populate("brand");

  const carMap = new Map();

  cars.forEach((car) => {
   if (!carMap.has(car.title)) {
    carMap.set(car.title, {
     brand: car.brand,
     title: car.title,
     images: car.images,
     transmissionTypes: new Set(),
     fuelTypes: new Set(),
    });
   }

   const carEntry = carMap.get(car.title);
   carEntry.transmissionTypes.add(car.transmissionType);
   carEntry.fuelTypes.add(car.fuelType);
  });

  const uniqueCars = Array.from(carMap.values()).map((car) => ({
   ...car,
   transmissionTypes: Array.from(car.transmissionTypes),
   fuelTypes: Array.from(car.fuelTypes),
  }));

  if (!uniqueCars.length) {
   return res
    .status(404)
    .json({ success: false, error: "No cars found for this brand" });
  }

  res.status(200).json({ success: true, data: uniqueCars });
 } catch (error) {
  console.error("Error fetching cars:", error);
  res.status(500).json({ success: false, error: "Failed to fetch cars" });
 }
};
const findCarByDetails = async (req, res) => {
 try {
  const { brand, title, fuelType, transmissionType } = req.query;

  // Validate query parameters
  if (!brand || !title || !fuelType || !transmissionType) {
   return res.status(400).json({ message: "All fields are required" });
  }

  // Validate if brand is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(brand)) {
   return res.status(400).json({ message: "Invalid brand ID" });
  }

  // Find the car based on the query parameters
  const car = await Car.findOne({
   brand: brand,
   title: title,
   fuelType: fuelType,
   transmissionType: transmissionType,
  });

  // If no car is found, return a 404 error
  if (!car) {
   return res
    .status(404)
    .json({ message: "No car found with the provided details" });
  }

  // If a car is found, return the car's ID
  return res.status(200).json({ carId: car });
 } catch (error) {
  console.error("Error fetching car:", error);
  return res.status(500).json({ message: "Server error" });
 }
};

const getCarIds = async (req, res) => {
 const { title } = req.query;

 if (!title) {
  return res.status(400).json({ message: "Title is required" });
 }

 const filter = { title: new RegExp(title, "i") };

 try {
  const cars = await Car.find(filter).select("title transmissionType fuelType"); // Only select relevant fields
  res.json(cars);
 } catch (error) {
  res.status(500).json({ message: "Error fetching cars", error });
 }
};

const getUniqueCars = async (req, res) => {
 try {
  const cars = await Car.find().populate("brand");
  const uniqueCars = [];

  const carTitles = new Set();

  cars.forEach((car) => {
   if (!carTitles.has(car.title)) {
    carTitles.add(car.title);
    uniqueCars.push(car);
   }
  });

  res.status(200).json(uniqueCars);
 } catch (error) {
  console.error("Error fetching cars:", error);
  res.status(500).json({ error: "Error fetching cars" });
 }
};
const getCarsByModel = async (req, res) => {
 try {
  const { brandId, model } = req.params;
  const cars = await Car.find({ brand: brandId, title: model }).populate(
   "brand"
  );
  if (!cars.length) {
   return res
    .status(404)
    .json({ success: false, error: "No cars found for this model" });
  }
  res.status(200).json({ success: true, data: cars });
 } catch (error) {
  console.error("Error fetching cars by model:", error);
  res.status(500).json({ success: false, error: "Failed to fetch cars" });
 }
};

const selectCarVariant = async (req, res) => {
 const { brandId, carTitle, transmissionType, fuelType } = req.body;

 try {
  // Validate input
  if (!brandId || !carTitle || !transmissionType || !fuelType) {
   return res.status(400).json({ error: "Missing required fields" });
  }

  // Fetch the specific car variant based on transmission type and fuel type
  const carVariant = await Car.findOne({
   brand: brandId,
   title: carTitle,
   transmissionType,
   fuelType,
  }).populate("brand");

  if (!carVariant) {
   return res
    .status(404)
    .json({ success: false, error: "Car variant not found" });
  }

  res.status(200).json({ success: true, data: carVariant });
 } catch (error) {
  console.error("Error selecting car variant:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to select car variant" });
 }
};
const deleteCarVariant = async (req, res) => {
 const { title, transmissionType, fuelType } = req.body;

 try {
  const result = await Car.deleteOne({ title, transmissionType, fuelType });
  if (result.deletedCount === 0) {
   return res
    .status(404)
    .json({ success: false, message: "Car variant not found" });
  }
  res.status(200).json({
   success: true,
   message: "Car variant deleted successfully",
   result,
  });
 } catch (error) {
  res
   .status(500)
   .json({ success: false, message: "Error deleting car variant", error });
 }
};
// const getAllvarientsOfCars = async (req, res) => {
//  try {
//   const cars = await Car.find().populate("brand");
//   res.status(200).json(cars);
//  } catch (err) {
//   res.status(500).json({ error: err.message });
//  }
// };
const getAllvarientsOfCars = async (req, res) => {
 const { title, transmissionType, fuelType, brand } = req.query;
 const filter = {};

 if (title) filter.title = new RegExp(title, "i");
 if (transmissionType)
  filter.transmissionType = new RegExp(transmissionType, "i");
 if (fuelType) filter.fuelType = new RegExp(fuelType, "i");
 if (brand) filter["brand.title"] = new RegExp(brand, "i");

 try {
  const cars = await Car.find(filter).populate("brand");
  res.status(200).json(cars);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};
// const getAllvarientsOfCars = async (req, res) => {
//  const { title, transmissionType, fuelType, brand } = req.query;
//  const filter = {};

//  if (title) filter.title = new RegExp(title, "i");
//  if (transmissionType) filter.transmissionType = transmissionType;
//  if (fuelType) filter.fuelType = fuelType;
//  if (brand) filter["brand.title"] = new RegExp(brand, "i");

//  try {
//   const cars = await Car.find(filter).populate("brand");
//   res.status(200).json(cars);
//  } catch (err) {
//   res.status(500).json({ error: err.message });
//  }
// };
const deleteCarById = async (req, res) => {
 const { id } = req.params;

 try {
  await Car.findByIdAndDelete(id);
  res.status(200).json({ message: "Car deleted successfully" });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

module.exports = {
 createCar,
 getAllCars,
 getCarById,
 deleteCar,
 getCarsByBrand,
 updateCarsByTitle,
 getCarIds,
 getUniqueCars,
 getCarsByModel,
 selectCarVariant,
 deleteCarVariant,
 getAllvarientsOfCars,
 deleteCarById,
 findCarByDetails,
 getCarsByIds,
};
