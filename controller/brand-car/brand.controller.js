const xlsx = require("xlsx");
const Brand = require("../../model/brand-car/brand.model");

 
const createBrandWithImage = async (req, res) => {
 try {
  const { title } = req.body;
  const file = req.file; // Multer stores uploaded file in req.file

  if (!title || !file) {
   return res
    .status(400)
    .json({ success: false, error: "Title and logo are required" });
  }

  // Check if the brand already exists (case-insensitive)
  const existingBrand = await Brand.findOne({
   title: { $regex: new RegExp("^" + title + "$", "i") },
  });
  if (existingBrand) {
   return res
    .status(400)
    .json({ success: false, error: "Brand with this title already exists" });
  }

  const brand = new Brand({
   title,
   logo: file.location, // URL of the uploaded file
  });

  await brand.save();
  res.status(201).json({ success: true, data: brand });
 } catch (error) {
  console.error("Error creating brand with image:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to create brand with image" });
 }
};

// Get all brands
const getAllBrands = async (req, res) => {
 try {
  const brands = await Brand.find().sort({ createdAt: -1, title: 1 }); // Sort by creation date in descending order, then by title in ascending order
  res.status(200).json({ success: true, data: brands });
 } catch (error) {
  console.error("Error fetching brands:", error);
  res.status(500).json({ success: false, error: "Failed to fetch brands" });
 }
};

// Get a single brand by ID
const getBrandById = async (req, res) => {
 try {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
   return res.status(404).json({ success: false, error: "Brand not found" });
  }

  res.status(200).json({ success: true, data: brand });
 } catch (error) {
  console.error("Error fetching brand:", error);
  res.status(500).json({ success: false, error: "Failed to fetch brand" });
 }
};

// Update a brand by ID
const updateBrand = async (req, res) => {
 try {
  const { title } = req.body;
  const file = req.file;

  const updateData = { title };
  if (file) {
   updateData.logo = file.location; // URL of the uploaded file
  }

  const brand = await Brand.findByIdAndUpdate(req.params.id, updateData, {
   new: true,
   runValidators: true,
  });

  if (!brand) {
   return res.status(404).json({ success: false, error: "Brand not found" });
  }

  res.status(200).json({ success: true, data: brand });
 } catch (error) {
  console.error("Error updating brand:", error);
  res.status(500).json({ success: false, error: "Failed to update brand" });
 }
};

// Delete a brand by ID
const deleteBrand = async (req, res) => {
 try {
  const brand = await Brand.findByIdAndDelete(req.params.id);

  if (!brand) {
   return res.status(404).json({ success: false, error: "Brand not found" });
  }

  res.status(200).json({ success: true, data: {} });
 } catch (error) {
  console.error("Error deleting brand:", error);
  res.status(500).json({ success: false, error: "Failed to delete brand" });
 }
};

// Bulk insert brands with images from Excel file
const bulkInsertBrands = async (req, res) => {
 try {
  const file = req.file; // Multer stores uploaded file in req.file

  if (!file) {
   return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  const workbook = xlsx.readFile(file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const brands = xlsx.utils.sheet_to_json(worksheet);

  if (!Array.isArray(brands) || brands.length === 0) {
   return res.status(400).json({ success: false, error: "Invalid Excel file" });
  }

  const formattedBrands = brands.map((brand) => ({
   title: brand.title,
   logo: brand.logo, // Assuming logos in Excel are URLs or S3 file paths
  }));

  const insertedBrands = await Brand.insertMany(formattedBrands);
  res.status(201).json({ success: true, data: insertedBrands });
 } catch (error) {
  console.error("Error inserting brands:", error);
  res.status(400).json({ success: false, error: error.message });
 }
};

module.exports = {
 createBrandWithImage,
 getAllBrands,
 getBrandById,
 updateBrand,
 deleteBrand,
 bulkInsertBrands,
};

// const Brand = require("../../model/brand-car/brand.model");

// // Create a new brand
// const createBrand = async (req, res) => {
//  try {
//   const { title, logo } = req.body;

//   const brand = new Brand({ title, logo });
//   await brand.save();

//   res.status(201).json({ success: true, data: brand });
//  } catch (error) {
//   console.error("Error creating brand:", error);
//   res.status(500).json({ success: false, error: "Failed to create brand" });
//  }
// };

// // Get all brands
// const getAllBrands = async (req, res) => {
//  try {
//   const brands = await Brand.find();

//   res.status(200).json({ success: true, data: brands });
//  } catch (error) {
//   console.error("Error fetching brands:", error);
//   res.status(500).json({ success: false, error: "Failed to fetch brands" });
//  }
// };

// // Get a single brand by ID
// const getBrandById = async (req, res) => {
//  try {
//   const brand = await Brand.findById(req.params.id);

//   if (!brand) {
//    return res.status(404).json({ success: false, error: "Brand not found" });
//   }

//   res.status(200).json({ success: true, data: brand });
//  } catch (error) {
//   console.error("Error fetching brand:", error);
//   res.status(500).json({ success: false, error: "Failed to fetch brand" });
//  }
// };

// // Update a brand by ID
// const updateBrand = async (req, res) => {
//  try {
//   const { title, logo } = req.body;

//   const brand = await Brand.findByIdAndUpdate(
//    req.params.id,
//    { title, logo },
//    { new: true, runValidators: true }
//   );

//   if (!brand) {
//    return res.status(404).json({ success: false, error: "Brand not found" });
//   }

//   res.status(200).json({ success: true, data: brand });
//  } catch (error) {
//   console.error("Error updating brand:", error);
//   res.status(500).json({ success: false, error: "Failed to update brand" });
//  }
// };

// // Delete a brand by ID
// const deleteBrand = async (req, res) => {
//  try {
//   const brand = await Brand.findByIdAndDelete(req.params.id);

//   if (!brand) {
//    return res.status(404).json({ success: false, error: "Brand not found" });
//   }

//   res.status(200).json({ success: true, data: {} });
//  } catch (error) {
//   console.error("Error deleting brand:", error);
//   res.status(500).json({ success: false, error: "Failed to delete brand" });
//  }
// };

// const bulkInsertBrands = async (req, res) => {
//  try {
//   const brands = req.body;
//   const insertedBrands = await Brand.insertMany(brands);
//   res.status(201).json(insertedBrands);
//  } catch (error) {
//   res.status(400).json({ error: error.message });
//  }
// };

// module.exports = {
//  createBrand,
//  getAllBrands,
//  getBrandById,
//  updateBrand,
//  deleteBrand,
//  bulkInsertBrands,
// };
