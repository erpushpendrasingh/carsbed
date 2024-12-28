const express = require("express");
const categoryRoutes = express.Router();
const categoryController = require("../../controller/products-categories/category.controller");
const Category = require("../../model/products/category.model");
const SubCategory = require("../../model/products/subCategory.model");
categoryRoutes.get("/", async (req, res) => {
 try {
  const categories = await Category.find();
  const subCategories = await SubCategory.find();
  res.status(200).json({ categories, subCategories });
 } catch (error) {
  res
   .status(500)
   .json({ error: "Failed to fetch categories and subcategories" });
 }
});
categoryRoutes.post("/create", categoryController.createCategory);
categoryRoutes.get("/all", categoryController.getAllCategories);
categoryRoutes.patch("/update/:id", categoryController.updateCategory);
categoryRoutes.delete("/rm/:id", categoryController.deleteCategory);

module.exports = categoryRoutes;
