const Product = require("../model/products/product.model");
const connectDB = require("./db");

const ensureIndexes = async () => {
 try {
  // Connect to the database
  await connectDB();

  // Ensure indexes are created
  await Product.init();
  console.log("Indexes ensured");
 } catch (error) {
  console.error("Error ensuring indexes:", error.message);
 } finally {
  mongoose.connection.close();
 }
};

ensureIndexes();
