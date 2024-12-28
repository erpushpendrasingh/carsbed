const express = require("express");
const {
 createCarPrice,
 getAllCarPrices,
 getProductsByCarId,
 getCarPriceById,
 updateCarPrice,
 deleteCarPrice,
 getProductsBySubCategory,
} = require("../../controller/products-categories/productPriceBycar.controller");

const productPriceBycar = express.Router();

productPriceBycar.post("/create", createCarPrice);
productPriceBycar.get("/all", getAllCarPrices);
productPriceBycar.get("/products/:id", getProductsByCarId);
productPriceBycar.get(
 "/products-by-subcategory/:subCategoryId",
 getProductsBySubCategory
);
productPriceBycar.get("/:id", getCarPriceById);
productPriceBycar.put("/:id", updateCarPrice);
productPriceBycar.delete("/:id", deleteCarPrice);

module.exports = productPriceBycar;

// const express = require("express");
// const {
//  createCarPrice,
//  getAllCarPrices,
//  getProductsByCarId,
//  getCarPriceById,
//  updateCarPrice,
//  deleteCarPrice,
// } = require("../../controller/products-categories/productPriceBycar.controller");
// const productPriceBycar = express.Router();
// // const = require("../../controller/productControllers/carpriceController");

// productPriceBycar.post("/create", createCarPrice);

// productPriceBycar.get("/all", getAllCarPrices);
// productPriceBycar.get("/products/:id", getProductsByCarId);
// productPriceBycar.get("/:id", getCarPriceById);
// productPriceBycar.put("/:id", updateCarPrice);
// productPriceBycar.delete("/:id", deleteCarPrice);

// module.exports = productPriceBycar;
