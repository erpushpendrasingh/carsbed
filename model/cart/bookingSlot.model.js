// const mongoose = require("mongoose");

// const bookingSlotSchema = new mongoose.Schema({
//  date: { type: Date, required: true },
//  startTime: { type: String, required: true },
//  endTime: { type: String, required: true },
//  isAvailable: { type: Boolean, default: true },
// });

// // Helper function to check if two time slots overlap
// const isTimeSlotOverlap = (start1, end1, start2, end2) => {
//  return start1 < end2 && start2 < end1;
// };

// // Custom validation to check for overlap on the same date
// bookingSlotSchema.pre("save", async function (next) {
//  const slot = this;
//  const overlappingSlots = await BookingSlot.find({
//   date: slot.date,
//   _id: { $ne: slot._id },  // Exclude the current document if it's an update
//  });

//  for (const existingSlot of overlappingSlots) {
//   if (
//    isTimeSlotOverlap(
//     slot.startTime,
//     slot.endTime,
//     existingSlot.startTime,
//     existingSlot.endTime
//    )
//   ) {
//    return next(
//     new Error(
//      "Time slot overlaps with an existing booking slot on the same date."
//     )
//    );
//   }
//  }

//  next();
// });

// const BookingSlot = mongoose.model("BookingSlot", bookingSlotSchema);
// module.exports = BookingSlot;
