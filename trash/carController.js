const upload = require("../middleware/upload");
const Car = require("../model/brand-car/car.model");

const createCar = async (req, res) => {
 //  upload.single("images")(req, res, async (err) => {
 //   if (err) {
 //    console.error("Error uploading image:", err);
 //    return res.status(400).json({ error: "Error uploading image" });
 //   }
 //   console.log("File uploaded:", req.file); // Debugging statement
 //   if (!req.file) {
 //    return res.status(400).json({ error: "File is missing" });
 //   }
 //   const { brand, title, transmissionType, fuelType } = req.body;
 //   const imageUrl = req.file.location; // The URL of the uploaded image
 //   try {
 //    const transmissionArray = transmissionType.split(",");
 //    const fuelTypeArray = fuelType.split(",");
 //    const promises = [];
 //    transmissionArray.forEach((transmission) => {
 //     fuelTypeArray.forEach((fuelType) => {
 //      const newCar = new Car({
 //       brand: brand, // Ensure `brand` is a valid ObjectId
 //       title,
 //       images: imageUrl,
 //       transmissionType: transmission,
 //       fuelType: fuelType,
 //      });
 //      promises.push(newCar.save());
 //     });
 //    });
 //    await Promise.all(promises);
 //    res.status(201).json({ message: "Cars added successfully" });
 //   } catch (error) {
 //    console.error("Error saving the car:", error);
 //    res.status(500).json({ error: "Error saving the car" });
 //   }
 //  });
};
const updateCar = async (req, res) => {
 console.log("lodu lalit");
 // Handle the image upload (if a new image is being uploaded)
 //  upload.single("images")(req, res, async (err) => {
 //   if (err) {
 //    console.error("Error uploading image:", err);
 //    return res.status(400).json({ error: "Error uploading image" });
 //   }
 //   // Get the car ID from the request params and other details from the request body
 //   const carId = req.params.id;
 //   const { brand, title, transmissionType, fuelType } = req.body;
 //   const imageUrl = req.file ? req.file.location : undefined; // Use existing image if no new image
 //   if (!carId) {
 //    return res.status(400).json({ error: "Car ID is required" });
 //   }
 //   try {
 //    // Prepare the update data
 //    const updateData = {};
 //    if (brand) updateData.brand = brand; // Ensure `brand` is a valid ObjectId or other identifier
 //    if (title) updateData.title = title;
 //    // Ensure transmissionType is a single value for updates
 //    if (transmissionType) {
 //     updateData.transmissionType = Array.isArray(transmissionType)
 //      ? transmissionType[0] // Get the first value if it's an array
 //      : transmissionType; // Use the value directly if it's a single value
 //    }
 //    // Ensure fuelType is a single value for updates
 //    if (fuelType) {
 //     updateData.fuelType = Array.isArray(fuelType)
 //      ? fuelType[0] // Get the first value if it's an array
 //      : fuelType; // Use the value directly if it's a single value
 //    }
 //    if (imageUrl) updateData.images = imageUrl;
 //    // Update the car in the database
 //    const updatedCar = await Car.findByIdAndUpdate(carId, updateData, {
 //     new: true,
 //     runValidators: true,
 //    });
 //    if (!updatedCar) {
 //     return res.status(404).json({ error: "Car not found" });
 //    }
 //    res
 //     .status(200)
 //     .json({ message: "Car updated successfully", car: updatedCar });
 //   } catch (error) {
 //    console.error("Error updating the car:", error);
 //    res.status(500).json({ error: "Error updating the car" });
 //   }
 //  });
};

module.exports = { createCar, updateCar };
