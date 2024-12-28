const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
require("dotenv").config();

const connectDB = async () => {
 try {
  const conn = await mongoose.connect(
   "mongodb+srv://arvmultimedia:1234@cluster0.mvezpot.mongodb.net/car-expert?retryWrites=true&w=majority&appName=Cluster0",
   {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   }
  );
  console.log("Connected to the database successfully");

  // Initialize GridFS
  let gfs;
  const mongoConn = mongoose.connection;
  mongoConn.once("open", () => {
   gfs = Grid(mongoConn.db, mongoose.mongo);
   gfs.collection("uploads");
  });

  // Export connection and gfs
  return { conn, gfs };
 } catch (error) {
  console.error("MongoDB connection error:", error.message);
  process.exit(1);
 }
};

module.exports = connectDB;
