const subCategoryModel = require("../../model/products/subCategory.model");
const upload = require("../../middleware/upload");
exports.createSubCategory = (req, res) => {
 upload.single("subCategoryImage")(req, res, async (err) => {
  if (err) {
   console.error("Error uploading image:", err);
   return res.status(400).json({ error: "Error uploading image" });
  }

  const { categoryId, subCategoryName } = req.body;
  const subCategoryImage = req.file ? req.file.location : null; // The URL of the uploaded image

  try {
   // Check if a subcategory with the same name already exists for the given category
   const existingSubCategory = await subCategoryModel.findOne({
    categoryId,
    subCategoryName,
   });

   if (existingSubCategory) {
    return res.status(400).json({ error: "Subcategory already exists" });
   }

   const newSubCategory = new subCategoryModel({
    categoryId,
    subCategoryName,
    subCategoryImage,
   });
   await newSubCategory.save();
   res.status(201).json(newSubCategory);
  } catch (err) {
   console.error("Error creating subcategory:", err);
   res.status(500).json({ error: err.message });
  }
 });
};
exports.getAllSubCategories = async (req, res) => {
 try {
  const subCategories = await subCategoryModel
   .find()
   .populate("categoryId")
   .sort({ createdAt: -1 });
  res.status(200).json(subCategories);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};


exports.getSubCategoriesByCategoryId = async (req, res) => {
 const { id } = req.params; // Get categoryId from request parameters

 try {
  // Find subcategories with the matching categoryId and populate the categoryId field
  const subCategories = await subCategoryModel
   .find({ categoryId: id })
   .populate("categoryId");
  res.status(200).json(subCategories); // Respond with the fetched subCategories
 } catch (err) {
  console.error("Error fetching subcategories:", err.message); // Log any errors that occur
  res.status(500).json({ error: err.message }); // Respond with an error message
 }
};



exports.updateSubCategory = (req, res) => {
 upload.single("subCategoryImage")(req, res, async (err) => {
  if (err) {
   console.error("Error uploading image:", err);
   return res.status(400).json({ error: "Error uploading image" });
  }

  const { subCategoryId } = req.params;
  const { categoryId, subCategoryName } = req.body;
  const subCategoryImage = req.file ? req.file.location : null; // The URL of the uploaded image

  try {
   const updatedFields = {
    categoryId,
    subCategoryName,
    subCategoryImage,
   };

   // Add subCategoryImage only if a new image is uploaded
   if (subCategoryImage) {
    updatedFields.subCategoryImage = subCategoryImage;
   }

   const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
    subCategoryId,
    updatedFields,
    { new: true } // To return the updated subcategory
   );

   if (!updatedSubCategory) {
    return res.status(404).json({ error: "Subcategory not found" });
   }

   res.status(200).json(updatedSubCategory);
  } catch (err) {
   res.status(500).json({ error: err.message });
  }
 });
};
// Delete a subcategory
exports.deleteSubCategory = async (req, res) => {
 const { id } = req.params;

 try {
  const deletedSubCategory = await subCategoryModel.findByIdAndDelete(id);
  if (!deletedSubCategory) {
   return res.status(404).json({ error: "SubCategory not found" });
  }
  res.status(200).json({ message: "SubCategory deleted successfully" });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};
