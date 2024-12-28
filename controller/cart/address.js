const Address = require("../../model/cart/address");

const saveAddress = async (req, res) => {
 const { userId } = req.params;
 const {
  name,
  houseFlatNumber,
  completeAddress,
  pincode,
  landmark,
  city,
  state,
  country,
  phoneNumber,
 } = req.body;

 try {
  const address = new Address({
   userId,
   name,
   houseFlatNumber,
   completeAddress,
   pincode,
   landmark,
   city,
   state,
   country,
   phoneNumber,
  });

  await address.save();

  res.status(201).json({ message: "Address saved successfully", address });
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

module.exports = {
 saveAddress,
};
