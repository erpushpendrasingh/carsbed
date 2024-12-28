const BookingFee = require("../../model/general/bookingFee");

// Set or Update Booking Fee
const setBookingFee = async (req, res) => {
  const { amount } = req.body;

  try {
    let bookingFee = await BookingFee.findOne();

    if (bookingFee) {
      bookingFee.amount = amount;
      bookingFee.updatedAt = Date.now();
    } else {
      bookingFee = new BookingFee({ amount });
    }

    await bookingFee.save();
    res
      .status(200)
      .json({ message: "Booking fee updated successfully", bookingFee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Current Booking Fee
const getBookingFee = async (req, res) => {
  try {
    const bookingFee = await BookingFee.findOne();

    if (!bookingFee) {
      return res.status(404).json({ message: "Booking fee not found" });
    }

    res.status(200).json(bookingFee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Update Booking Fee
const updateBookingFee = async (req, res) => {
  const { amount } = req.body;

  try {
    const bookingFee = await BookingFee.findOne();

    if (!bookingFee) {
      return res.status(404).json({ message: "Booking fee not found" });
    }

    bookingFee.amount = amount;
    bookingFee.updatedAt = Date.now();

    await bookingFee.save();
    res
      .status(200)
      .json({ message: "Booking fee updated successfully", bookingFee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  setBookingFee,
  getBookingFee,
  updateBookingFee,
};
