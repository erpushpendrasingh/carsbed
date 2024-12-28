const Order = require("../../model/cart/Order");
const getAllOrders = async (req, res) => {
 try {
  // Find all orders, sorted by creation date (newest first)
  const orders = await Order.find()
   .populate("slot") // Populate the slot details if needed
   .populate("address") // Populate the address details if needed
   .populate("userId", "mobile cars currentCar") // Populate userId to get the mobile number and car details
   .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
   .exec();

  if (orders.length === 0) {
   return res.status(404).json({ message: "No orders found." });
  }

  // Map the orders to the desired structure
  const formattedOrders = orders.map((order) => ({
   orderId: order._id,
   razorpayOrderId: order.razorpayOrderId,
   amount: order.amount,
   currency: order.currency,
   receipt: order.receipt,
   paymentMethod: order.paymentMethod,
   discounts: order.discounts,
   slot: order.slot
    ? {
       id: order.slot._id,
       time: order.slot.time,
       date: order.slotDate, // Using slotDate from order
      }
    : null, // Check if slot is populated
   carId: order.carId ? order.carId._id : null, // Check if carId is populated and return car details
   user: order.userId
    ? {
       _id: order.userId._id,
       mobile: order.userId.mobile,
       cars: order.userId.cars,
       currentCar: order.userId.currentCar,
      }
    : null, // Check if userId is populated and return user details
   address: order.address
    ? {
       _id: order.address._id,
       userId: order.address.userId,
       name: order.address.name,
       houseFlatNumber: order.address.houseFlatNumber,
       completeAddress: order.address.completeAddress,
       pincode: order.address.pincode,
       landmark: order.address.landmark,
       city: order.address.city,
       state: order.address.state,
       country: order.address.country,
       phoneNumber: order.address.phoneNumber,
       createdAt: order.address.createdAt,
       updatedAt: order.address.updatedAt,
       __v: order.address.__v,
      }
    : null, // Check if address is populated
   cart: order.cartItems // Return cart items stored directly in the order
    ? {
       items: order.cartItems, // Include cart items details directly from the order
       totalItems: order.cartItems.length, // Calculate total items
       totalPrice: order.totalPrice,
       finalPrice: order.finalPrice,
       discount: order.discounts.totalDiscount,
       balanceDue: order.balanceDue,
      }
    : null, // If no cartItems found, return null
   balanceDue: order.balanceDue, // Include balance due in the response
   bookingFee: order.bookingFee, // Include booking fee in the response
   codAmount: order.codAmount,
   orderStatus: order.orderStatus,
   paymentStatus: order.paymentStatus,
   createdAt: order.createdAt,
   updatedAt: order.updatedAt,
  }));

  // Respond with the formatted orders
  res.status(200).json(formattedOrders);
 } catch (err) {
  console.error("Error fetching all orders:", err.message);
  res.status(500).json({ message: "Internal server error." });
 }
};

// const getAllOrders = async (req, res) => {
//  try {
//   // Find all orders, sorted by creation date (newest first)
//   const orders = await Order.find()
//    .populate("cartId") // Populate the cart details if needed
//    .populate("slot") // Populate the slot details if needed
//    .populate("address") // Populate the address details if needed
//    .populate("userId", "mobile") // Populate userId to get the mobile number
//    .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
//    .exec();

//   if (orders.length === 0) {
//    return res.status(404).json({ message: "No orders found." });
//   }

//   // Map the orders to the desired structure
//   const formattedOrders = orders.map((order) => ({
//    orderId: order._id,
//    razorpayOrderId: order.razorpayOrderId,
//    amount: order.amount,
//    currency: order.currency,
//    receipt: order.receipt,
//    paymentMethod: order.paymentMethod,
//    discounts: order.discounts,
//    slot: order.slot
//     ? {
//        id: order.slot._id,
//        time: order.slot.time,
//        date: order.slotDate, // Using slotDate from order
//       }
//     : null, // Check if slot is populated
//    carId: order.carId ? order.carId._id : null, // Check if carId is populated
//    userId: order.userId ? order.userId._id : null, // Check if userId is populated
//    mobile: order.userId ? order.userId.mobile : null, // Check if mobile is populated
//    address: order.address
//     ? {
//        _id: order.address._id,
//        userId: order.address.userId,
//        name: order.address.name,
//        houseFlatNumber: order.address.houseFlatNumber,
//        completeAddress: order.address.completeAddress,
//        pincode: order.address.pincode,
//        landmark: order.address.landmark,
//        city: order.address.city,
//        state: order.address.state,
//        country: order.address.country,
//        phoneNumber: order.address.phoneNumber,
//        createdAt: order.address.createdAt,
//        updatedAt: order.address.updatedAt,
//        __v: order.address.__v,
//       }
//     : null, // Check if address is populated
//    balanceDue: order.balanceDue, // Include balance due in the response
//    bookingFee: order.bookingFee, // Include booking fee in the response
//    codAmount: order.codAmount,
//    orderStatus: order.orderStatus,
//    paymentStatus: order.paymentStatus,
//    createdAt: order.createdAt,
//    updatedAt: order.updatedAt,
//   }));

//   // Respond with the formatted orders
//   res.status(200).json(formattedOrders);
//  } catch (err) {
//   console.error("Error fetching all orders:", err.message);
//   res.status(500).json({ message: "Internal server error." });
//  }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate('cartId userId');
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

module.exports = {
 getAllOrders,
};
