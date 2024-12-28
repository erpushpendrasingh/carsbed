// controllers/addressController.js

const Address = require("../../model/cart/address");

// Function to get addresses by userId
const getAddressByUserId = async (req, res) => {
 try {
  const { userId } = req.query;

  // Validate userId
  if (!userId) {
   return res.status(400).json({ message: "userId is required" });
  }

  // Fetch the addresses
  const addresses = await Address.find({ userId });

  // If no addresses are found
  if (addresses.length === 0) {
   return res.status(404).json({ message: "No addresses found for this user" });
  }

  // Return the found addresses
  return res.status(200).json(addresses);
 } catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Server Error" });
 }
};

// Export the controller functions
module.exports = {
 getAddressByUserId,
};
