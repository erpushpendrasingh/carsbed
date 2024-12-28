const Booking = require("../../model/website/bookingModel");

// Create a new booking after payment success
const createBooking = async (req, res) => {
 try {
  const bookingData = req.body;

  const newBooking = new Booking(bookingData);
  await newBooking.save();

  return res.status(201).json({
   success: true,
   message: "Booking created successfully",
   booking: newBooking,
  });
 } catch (error) {
  console.error("Error creating booking:", error);
  return res.status(500).json({
   success: false,
   message: "Error creating booking",
  });
 }
};

module.exports = { createBooking };
