const xlsx = require("xlsx");
// const Category = require("../model/productsModels/category.model");
// const SubCategory = require("../model/productsModels/subCategory.model");
// const Product = require("../model/productsModels/product.model");
// const Car = require("../model/serviceModels/car.model");

const bulkInsert = async (req, res) => {
 try {
  const file = req.file;
  if (!file) {
   return res.status(400).json({ error: "No file uploaded" });
  }

  // Read the Excel file from buffer
  const workbook = xlsx.read(file.buffer, { type: "buffer" });
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  // Process each row
  for (const row of data) {
   // Handle categories
   let category = await Category.findOne({ name: row.Category });
   if (!category) {
    category = new Category({ name: row.Category });
    category = await category.save();
   }

   // Handle subcategories
   let subCategory = await SubCategory.findOne({
    name: row.SubCategory,
    category: category._id,
   });
   if (!subCategory) {
    subCategory = new SubCategory({
     name: row.SubCategory,
     category: category._id,
    });
    subCategory = await subCategory.save();
   }

   // Handle products
   const car = await Car.findOne({ title: row.Car });
   if (!car) {
    return res.status(400).json({ error: `Car not found: ${row.Car}` });
   }

   const product = new Product({
    name: row.ProductName,
    description: row.Description,
    price: row.Price,
    subCategory: subCategory._id,
    car: car._id,
   });

   await product.save();
  }

  res.status(201).json({ message: "Bulk data inserted successfully" });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

module.exports = { bulkInsert };
