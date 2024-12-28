const upload = require("../../middleware/upload");
const categoryModel = require("../../model/products/category.model");

exports.createCategory = (req, res) => {
 upload.single("categoryImage")(req, res, async (err) => {
  if (err) {
   console.error("Error uploading image:", err);
   return res.status(400).json({ error: "Error uploading image" });
  }

  const { variantType, categoryName, tag } = req.body;
  const categoryImage = req.file ? req.file.location : null; // The URL of the uploaded image

  try {
   // Check if a category with the same name already exists
   const existingCategory = await categoryModel.findOne({ categoryName });

   if (existingCategory) {
    return res.status(400).json({ error: "Category already exists" });
   }

   const newCategory = new categoryModel({
    variantType,
    categoryName,
    categoryImage,
    tag,
   });
   await newCategory.save();
   res.status(201).json(newCategory);
  } catch (err) {
   console.error("Error creating category:", err);
   res.status(500).json({ error: err.message });
  }
 });
};
exports.getAllCategories = async (req, res) => {
 try {
  const categories = await categoryModel
   .find()
   .sort({ createdAt: -1, categoryName: 1 });
  res.status(200).json(categories);
 } catch (err) {
  console.error("Error fetching categories:", err.message); // Log the error message
  res
   .status(500)
   .json({ error: "An error occurred while fetching categories." });
 }
};
exports.updateCategory = (req, res) => {
 upload.single("categoryImage")(req, res, async (err) => {
  if (err) {
   console.error("Error uploading image:", err);
   return res.status(400).json({ error: "Error uploading image" });
  }

  const { id } = req.params;
  const { variantType, categoryName, tag } = req.body;
  const categoryImage = req.file ? req.file.location : null; // The URL of the uploaded image

  // Create an update object
  const updateFields = {};

  if (variantType) updateFields.variantType = variantType;
  if (categoryName) updateFields.categoryName = categoryName;
  if (categoryImage) updateFields.categoryImage = categoryImage;
  if (tag) updateFields.tag = tag;

  try {
   const updatedCategory = await categoryModel.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true } // To return the updated category
   );

   if (!updatedCategory) {
    return res.status(404).json({ message: "Category not found" });
   }

   res.status(200).json(updatedCategory);
  } catch (err) {
   res.status(500).json({ error: err.message });
  }
 });
};

exports.deleteCategory = async (req, res) => {
 try {
  const { id } = req.params;
  const deletedCategory = await categoryModel.findByIdAndDelete(id);

  if (!deletedCategory) {
   return res.status(404).json({ message: "Category not found" });
  }

  res.status(200).json({ message: "Category deleted successfully" });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};
