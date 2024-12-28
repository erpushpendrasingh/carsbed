// controller/service-provider/cityController.js
const City = require("../../model/service-provider/city");

const createCity = async (req, res) => {
 try {
  const { state, city, pincodes, isServiced, votes } = req.body;

  const newCity = new City({
   state,
   city,
   pincodes: pincodes.split(",").map((pincode) => pincode.trim()),
   image: req.file ? req.file.location : "",
   isServiced,
   votes,
  });

  await newCity.save();

  res.status(201).json(newCity);
 } catch (error) {
  console.error("Error creating city:", error);
  res.status(500).json({ message: "Error creating city", error });
 }
};

const updateCity = async (req, res) => {
 try {
  const { id } = req.params;
  const { state, city, pincodes, isServiced, votes } = req.body;

  const updateData = {
   state,
   city,
   pincodes: pincodes.split(",").map((pincode) => pincode.trim()),
   isServiced,
   votes,
  };

  if (req.file) {
   updateData.image = req.file.location;
  }

  const updatedCity = await City.findByIdAndUpdate(id, updateData, {
   new: true,
  });

  res.status(200).json(updatedCity);
 } catch (error) {
  console.error("Error updating city:", error);
  res.status(500).json({ message: "Error updating city", error });
 }
};

const deleteCity = async (req, res) => {
 try {
  const { id } = req.params;
  await City.findByIdAndDelete(id);
  res.status(200).json({ message: "City deleted successfully" });
 } catch (error) {
  console.error("Error deleting city:", error);
  res.status(500).json({ message: "Error deleting city", error });
 }
};

const fetchCities = async (req, res) => {
 try {
  const cities = await City.find();
  res.status(200).json(cities);
 } catch (error) {
  console.error("Error fetching cities:", error);
  res.status(500).json({ message: "Error fetching cities", error });
 }
};

const updateVotes = async (req, res) => {
 try {
  const { id } = req.params;
  const city = await City.findById(id);
  if (!city) {
   return res.status(404).json({ message: "City not found" });
  }

  city.votes += 1;
  await city.save();

  res.status(200).json(city);
 } catch (error) {
  console.error("Error updating votes:", error);
  res.status(500).json({ message: "Error updating votes", error });
 }
};

const toggleServiceStatus = async (req, res) => {
 try {
  const { id } = req.params;
  const city = await City.findById(id);
  if (!city) {
   return res.status(404).json({ message: "City not found" });
  }

  city.isServiced = !city.isServiced;
  await city.save();

  res.status(200).json(city);
 } catch (error) {
  console.error("Error toggling service status:", error);
  res.status(500).json({ message: "Error toggling service status", error });
 }
};

const removePincode = async (req, res) => {
 try {
  const { id } = req.params;
  const { pincode } = req.body;
  const city = await City.findById(id);
  if (!city) {
   return res.status(404).json({ message: "City not found" });
  }

  city.pincodes = city.pincodes.filter((pin) => pin !== pincode);
  await city.save();

  res.status(200).json(city);
 } catch (error) {
  console.error("Error removing pincode:", error);
  res.status(500).json({ message: "Error removing pincode", error });
 }
};

module.exports = {
 createCity,
 updateCity,
 deleteCity,
 fetchCities,
 updateVotes,
 removePincode,
 toggleServiceStatus,
};
