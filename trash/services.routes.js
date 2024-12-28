const Booking = require("../model/booking.model");
const Vendor = require("../model/vendor.model");
const Customer = require("../model/customer.model");

exports.createBooking = async (req, res) => {
 try {
  const {
   customer,
   vendor,
   service,
   preferredDate,
   timeSlot,
   additionalDetails,
  } = req.body;

  const booking = new Booking({
   customer,
   vendor,
   service,
   preferredDate,
   timeSlot,
   additionalDetails,
  });

  await booking.save();

  // Notify the vendor about the new booking
  // Implementation depends on your notification system (e.g., email, push notifications)

  res
   .status(201)
   .json({ success: true, message: "Booking request created", booking });
 } catch (error) {
  console.error("Error creating booking:", error);
  res.status(500).json({ success: false, error: "Failed to create booking" });
 }
};

exports.updateBookingStatus = async (req, res) => {
 try {
  const { bookingId, status, proposedTimeSlot } = req.body;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
   return res.status(404).json({ success: false, error: "Booking not found" });
  }

  booking.status = status;
  if (proposedTimeSlot) {
   booking.timeSlot = proposedTimeSlot;
  }

  await booking.save();

  // Notify the customer about the status update
  // Implementation depends on your notification system

  res
   .status(200)
   .json({ success: true, message: "Booking status updated", booking });
 } catch (error) {
  console.error("Error updating booking status:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to update booking status" });
 }
};

exports.getBookingsForVendor = async (req, res) => {
 try {
  const { vendorId } = req.params;

  const bookings = await Booking.find({ vendor: vendorId }).populate(
   "customer"
  );

  res.status(200).json({ success: true, bookings });
 } catch (error) {
  console.error("Error fetching bookings:", error);
  res.status(500).json({ success: false, error: "Failed to fetch bookings" });
 }
};
