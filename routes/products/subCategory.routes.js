const express = require("express");
const subCategory = express.Router();
const {
 createSubCategory,
 getAllSubCategories,
 updateSubCategory,
 deleteSubCategory,
 getSubCategoriesByCategoryId,
} = require("../../controller/products-categories/subCategory.controller");
// Route to create a new subcategory
subCategory.post("/create", createSubCategory);

// Route to get all subcategories
subCategory.get("/all", getAllSubCategories);

// Route to get a single subcategory by ID
subCategory.get("/:id", getSubCategoriesByCategoryId);

// Route to update a subcategory
subCategory.patch("/update/:subCategoryId", updateSubCategory);

// Route to delete a subcategory
subCategory.delete("/rm/:id", deleteSubCategory);

module.exports = subCategory;
