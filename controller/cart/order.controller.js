const Address = require("../../model/cart/address");
const Cart = require("../../model/cart/cart");
const Order = require("../../model/cart/Order");
const Slot = require("../../model/cart/Slot");
const BookingFee = require("../../model/general/bookingFee");
const Wallet = require("../../model/refer-coupon-wallet/wallet.model");
const createFakeRazorpayOrder = (amount) => {
 return new Promise((resolve) => {
  setTimeout(() => {
   resolve({
    id: `order_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Math.random().toString(36).substr(2, 9)}`,
   });
  }, 1000); // Simulate network delay
 });
};
const createOrder = async (req, res) => {
 const { userId } = req.params;
 const { slotId, date, paymentMethod, carId, addressId, newAddress } = req.body;

 try {
  // Retrieve the cart for the user
  const cart = await Cart.findOne({ userId })
   .populate("userId", "mobile currentCar walletBalance") // Populate wallet balance as well
   .exec();

  if (!cart || !cart.items || cart.items.length === 0) {
   return res.status(404).json({ message: "Cart is empty or not found" });
  }

  // Retrieve the slot details
  const slot = await Slot.findById(slotId);
  if (!slot) {
   return res.status(404).json({ message: "Slot not found" });
  }

  // Handle the address logic
  let selectedAddress;

  if (addressId) {
   selectedAddress = await Address.findById(addressId);
   if (!selectedAddress) {
    return res
     .status(404)
     .json({ message: "Address not found. Please provide a new address." });
   }
  } else if (newAddress) {
   const address = new Address({
    userId: cart.userId._id,
    ...newAddress,
   });
   selectedAddress = await address.save();
  } else {
   return res
    .status(400)
    .json({ message: "No address provided. Please provide a new address." });
  }

  // Calculate the final amount based on the payment method
  let finalPrice = cart.finalPrice;
  let walletUsed = 0;
  let balanceDue = 0;
  let bookingFee = 0;
  let codAmount = 0;
  const walletBalance = cart.userId.walletBalance;

  if (paymentMethod === "Full Payment") {
   if (finalPrice >= 1000 && walletBalance > 0) {
    walletUsed = Math.min(walletBalance, finalPrice * 0.25);
    finalPrice -= walletUsed;
   }
   balanceDue = 0;
  } else if (paymentMethod === "Booking Fee") {
   const bookingFeeDoc = await BookingFee.findOne();
   bookingFee = bookingFeeDoc ? bookingFeeDoc.amount : 0;
   balanceDue = finalPrice - bookingFee;
   finalPrice = bookingFee;
  } else if (paymentMethod === "COD") {
   codAmount = finalPrice;
   balanceDue = finalPrice;
  }

  // Create a fake Razorpay order for demonstration purposes
  const fakeRazorpayOrder = await createFakeRazorpayOrder(finalPrice);

  // Prepare cart items for the order
  const cartItems = cart.items.map((item) => ({
   productId: item.productId,
   subCategoryId: item.subCategoryId,
   type: item.type,
   quantity: item.quantity,
   price: item.price,
   totalPrice: item.totalPrice,
  }));

  // Save the cart data inside the order before deleting the cart
  const newOrder = new Order({
   userId: cart.userId._id,
   razorpayOrderId: fakeRazorpayOrder.id,
   amount: finalPrice, // Final calculated amount
   currency: fakeRazorpayOrder.currency,
   receipt: fakeRazorpayOrder.receipt,
   paymentMethod: paymentMethod,
   orderStatus: "Pending",
   paymentStatus: "Pending",
   finalPrice: finalPrice,
   totalPrice: cart.totalPrice,
   cartItems: cartItems, // Save all cart items directly in the order
   discounts: {
    coupon: cart.couponDiscount,
    referral: cart.referralDiscount,
    slot: cart.slotDiscount,
    walletUsed: walletUsed, // Include wallet used
    totalDiscount:
     cart.discount +
     cart.couponDiscount +
     cart.referralDiscount +
     cart.slotDiscount,
   },
   slot: slotId,
   slotDate: date,
   slotTime: slot.time,
   carId: carId,
   address: selectedAddress._id,
   balanceDue: balanceDue,
   bookingFee: bookingFee,
   codAmount: codAmount,
  });

  // Save the order to the database
  await newOrder.save();

  // After the order is saved, delete the cart for the user
  await Cart.deleteOne({ _id: cart._id });

  // Send response with order details
  res.status(201).json({
   orderId: newOrder._id,
   razorpayOrderId: fakeRazorpayOrder.id,
   amount: finalPrice,
   currency: fakeRazorpayOrder.currency,
   receipt: fakeRazorpayOrder.receipt,
   paymentMethod: paymentMethod,
   discounts: newOrder.discounts,
   slot: {
    id: newOrder.slot,
    time: newOrder.slotTime,
    date: newOrder.slotDate,
   },
   carId: newOrder.carId,
   user: {
    _id: cart.userId._id,
    mobile: cart.userId.mobile,
    cars: cart.userId.cars || [],
    currentCar: cart.userId.currentCar,
   },
   address: selectedAddress,
   cart: newOrder.cartItems, // Return cart items in the response
   balanceDue: balanceDue,
   bookingFee: bookingFee,
   codAmount: codAmount,
   orderStatus: newOrder.orderStatus,
   paymentStatus: newOrder.paymentStatus,
   createdAt: newOrder.createdAt,
  });
 } catch (err) {
  console.error("Error creating order:", err.message);
  res.status(500).json({ message: err.message });
 }
};

// const createOrder = async (req, res) => {
//  const { userId } = req.params;
//  const { slotId, date, paymentMethod, carId, addressId, newAddress } = req.body;

//  try {
//   // Retrieve the cart for the user
//   const cart = await Cart.findOne({ userId })
//    .populate("userId", "mobile currentCar walletBalance") // Populate wallet balance as well
//    .exec();
//   if (!cart) {
//    return res.status(404).json({ message: "Cart not found" });
//   }

//   // Retrieve the slot details
//   const slot = await Slot.findById(slotId);
//   if (!slot) {
//    return res.status(404).json({ message: "Slot not found" });
//   }

//   // Handle the address
//   let selectedAddress;

//   if (addressId) {
//    // Try to use an existing address if provided
//    selectedAddress = await Address.findById(addressId);
//    if (!selectedAddress) {
//     return res
//      .status(404)
//      .json({ message: "Address not found. Please provide a new address." });
//    }
//   }

//   if (!selectedAddress && newAddress) {
//    // Save the new address if no valid existing address is found
//    const address = new Address({
//     userId: cart.userId._id,
//     ...newAddress,
//    });
//    selectedAddress = await address.save();
//   } else if (!selectedAddress && !newAddress) {
//    // If no addressId is provided and no newAddress is provided, throw an error
//    return res
//     .status(400)
//     .json({ message: "No address provided. Please provide a new address." });
//   }

//   // Calculate the final amount (ensure finalPrice is correctly calculated)
//   let finalPrice = cart.finalPrice;
//   let walletUsed = 0;
//   let balanceDue = 0;
//   let bookingFee = 0;
//   let codAmount = 0;
//   const walletBalance = cart.userId.walletBalance;

//   if (paymentMethod === "Full Payment") {
//    // Apply wallet usage if applicable
//    if (finalPrice >= 1000 && walletBalance > 0) {
//     walletUsed = Math.min(walletBalance, finalPrice * 0.25);
//     finalPrice -= walletUsed;
//    }
//    balanceDue = 0;
//   } else if (paymentMethod === "Booking Fee") {
//    const bookingFeeDoc = await BookingFee.findOne();
//    bookingFee = bookingFeeDoc ? bookingFeeDoc.amount : 0;
//    balanceDue = finalPrice - bookingFee;
//    finalPrice = bookingFee; // Final price is the booking fee
//   } else if (paymentMethod === "COD") {
//    codAmount = finalPrice;
//    balanceDue = finalPrice;
//   }

//   // Create a fake Razorpay order
//   const fakeRazorpayOrder = await createFakeRazorpayOrder(finalPrice);

//   // Save the cart data inside the order
//   const newOrder = new Order({
//    userId: cart.userId._id,
//    cartId: cart._id,
//    razorpayOrderId: fakeRazorpayOrder.id,
//    amount: finalPrice, // Store the final calculated amount
//    currency: fakeRazorpayOrder.currency,
//    receipt: fakeRazorpayOrder.receipt,
//    paymentMethod: paymentMethod,
//    orderStatus: "Pending", // Set a default status
//    paymentStatus: "Pending", // Set a default status
//    finalPrice: finalPrice, // The final price after all adjustments
//    totalPrice: cart.totalPrice, // From cart's total price
//    cartItems: cart.items, // Store the entire cart items with the order
//    discounts: {
//     coupon: cart.couponDiscount,
//     referral: cart.referralDiscount,
//     slot: cart.slotDiscount,
//     walletUsed: walletUsed, // Include the wallet amount used
//     totalDiscount:
//      cart.discount +
//      cart.couponDiscount +
//      cart.referralDiscount +
//      cart.slotDiscount,
//    },
//    slot: slotId, // Store the slot ID
//    slotDate: date, // Store the date provided in the request
//    slotTime: slot.time, // Store the slot time
//    carId: carId, // Use carId from the request
//    address: selectedAddress._id, // Use the selected or new address
//    balanceDue: balanceDue, // Include balance due
//    bookingFee: bookingFee, // Include booking fee if applicable
//    codAmount: codAmount, // Include COD amount if applicable
//   });

//   await newOrder.save();

//   // Delete the previous cart for the user after the order is created
//   await Cart.deleteOne({ _id: cart._id });

//   // Respond with all necessary details, including userId, mobile, carId, and address
//   res.status(201).json({
//    orderId: newOrder._id,
//    razorpayOrderId: fakeRazorpayOrder.id,
//    amount: finalPrice,
//    currency: fakeRazorpayOrder.currency,
//    receipt: fakeRazorpayOrder.receipt,
//    paymentMethod: paymentMethod,
//    discounts: newOrder.discounts,
//    slot: {
//     id: newOrder.slot,
//     time: newOrder.slotTime,
//     date: newOrder.slotDate, // Include the date in the response
//    },
//    carId: newOrder.carId, // Include carId in the response
//    userId: cart.userId._id, // Include userId in the response
//    mobile: cart.userId.mobile, // Include mobile number in the response
//    address: selectedAddress, // Include address details in the response
//    orderStatus: newOrder.orderStatus,
//    paymentStatus: newOrder.paymentStatus,
//    balanceDue: balanceDue, // Include balance due in the response
//    bookingFee: bookingFee, // Include booking fee in the response
//    codAmount: codAmount, // Include COD amount in the response
//   });
//  } catch (err) {
//   console.error("Error creating order:", err.message);
//   res.status(500).json({ message: err.message });
//  }
// };

// const createOrder = async (req, res) => {
//  const { userId } = req.params;
//  const { slotId, date, paymentMethod, carId, addressId, newAddress } = req.body;

//  try {
//   // Retrieve the cart for the user
//   const cart = await Cart.findOne({ userId })
//    .populate("userId", "mobile currentCar walletBalance") // Populate wallet balance as well
//    .exec();
//   if (!cart) {
//    return res.status(404).json({ message: "Cart not found" });
//   }

//   // Retrieve the slot details
//   const slot = await Slot.findById(slotId);
//   if (!slot) {
//    return res.status(404).json({ message: "Slot not found" });
//   }

//   // Handle the address
//   let selectedAddress;

//   if (addressId) {
//    // Try to use an existing address if provided
//    selectedAddress = await Address.findById(addressId);
//    if (!selectedAddress) {
//     return res
//      .status(404)
//      .json({ message: "Address not found. Please provide a new address." });
//    }
//   }

//   if (!selectedAddress && newAddress) {
//    // Save the new address if no valid existing address is found
//    const address = new Address({
//     userId: cart.userId._id,
//     ...newAddress,
//    });
//    selectedAddress = await address.save();
//   } else if (!selectedAddress && !newAddress) {
//    // If no addressId is provided and no newAddress is provided, throw an error
//    return res
//     .status(400)
//     .json({ message: "No address provided. Please provide a new address." });
//   }

//   // Calculate the final amount (ensure finalPrice is correctly calculated)
//   let finalPrice = cart.finalPrice;
//   let walletUsed = 0;
//   let balanceDue = 0;
//   let bookingFee = 0;
//   let codAmount = 0;
//   const walletBalance = cart.userId.walletBalance;

//   if (paymentMethod === "Full Payment") {
//    // Apply wallet usage if applicable
//    if (finalPrice >= 1000 && walletBalance > 0) {
//     walletUsed = Math.min(walletBalance, finalPrice * 0.25);
//     finalPrice -= walletUsed;
//    }
//    balanceDue = 0;
//   } else if (paymentMethod === "Booking Fee") {
//    const bookingFeeDoc = await BookingFee.findOne();
//    bookingFee = bookingFeeDoc ? bookingFeeDoc.amount : 0;
//    balanceDue = finalPrice - bookingFee;
//    finalPrice = bookingFee; // Final price is the booking fee
//   } else if (paymentMethod === "COD") {
//    codAmount = finalPrice;
//    balanceDue = finalPrice;
//   }

//   // Create a fake Razorpay order
//   const fakeRazorpayOrder = await createFakeRazorpayOrder(finalPrice);

//   // Save the order details in your database
//   const newOrder = new Order({
//    userId: cart.userId._id,
//    cartId: cart._id,
//    razorpayOrderId: fakeRazorpayOrder.id,
//    amount: finalPrice, // Store the final calculated amount
//    currency: fakeRazorpayOrder.currency,
//    receipt: fakeRazorpayOrder.receipt,
//    paymentMethod: paymentMethod,
//    orderStatus: "Pending", // Set a default status
//    paymentStatus: "Pending", // Set a default status
//    finalPrice: finalPrice, // The final price after all adjustments
//    totalPrice: cart.totalPrice, // From cart's total price
//    discounts: {
//     coupon: cart.couponDiscount,
//     referral: cart.referralDiscount,
//     slot: cart.slotDiscount,
//     walletUsed: walletUsed, // Include the wallet amount used
//     totalDiscount:
//      cart.discount +
//      cart.couponDiscount +
//      cart.referralDiscount +
//      cart.slotDiscount,
//    },
//    slot: slotId, // Store the slot ID
//    slotDate: date, // Store the date provided in the request
//    slotTime: slot.time, // Store the slot time
//    carId: carId, // Use carId from the request
//    address: selectedAddress._id, // Use the selected or new address
//    balanceDue: balanceDue, // Include balance due
//    bookingFee: bookingFee, // Include booking fee if applicable
//    codAmount: codAmount, // Include COD amount if applicable
//   });

//   await newOrder.save();

//   // Respond with all necessary details, including userId, mobile, carId, and address
//   res.status(201).json({
//    orderId: newOrder._id,
//    razorpayOrderId: fakeRazorpayOrder.id,
//    amount: finalPrice,
//    currency: fakeRazorpayOrder.currency,
//    receipt: fakeRazorpayOrder.receipt,
//    paymentMethod: paymentMethod,
//    discounts: newOrder.discounts,
//    slot: {
//     id: newOrder.slot,
//     time: newOrder.slotTime,
//     date: newOrder.slotDate, // Include the date in the response
//    },
//    carId: newOrder.carId, // Include carId in the response
//    userId: cart.userId._id, // Include userId in the response
//    mobile: cart.userId.mobile, // Include mobile number in the response
//    address: selectedAddress, // Include address details in the response
//    orderStatus: newOrder.orderStatus,
//    paymentStatus: newOrder.paymentStatus,
//    balanceDue: balanceDue, // Include balance due in the response
//    bookingFee: bookingFee, // Include booking fee in the response
//    codAmount: codAmount, // Include COD amount in the response
//   });
//  } catch (err) {
//   console.error("Error creating order:", err.message);
//   res.status(500).json({ message: err.message });
//  }
// };

const getOrdersByUserId = async (req, res) => {
 const { userId } = req.params;

 try {
  // Find all orders for the given userId, sorted by creation date (newest first)
  const orders = await Order.find({ userId })
   .populate("cartItems") // Populate the cart details if needed
   .populate("slot") // Populate the slot details if needed
   .populate("address") // Populate the address details if needed
   .populate("userId", "mobile") // Populate userId to get the mobile number
   .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
   .exec();
  console.log("orders:", orders);
  if (orders.length === 0) {
   return res.status(404).json({ message: "No orders found for this user." });
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
       date: order.slotDate,
      }
    : null, // Check if slot is populated
   carId: order.carId,
   userId: order.userId ? order.userId._id : null, // Check if userId is populated
   mobile: order.userId ? order.userId.mobile : null, // Check if mobile is populated
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
   orderStatus: order.orderStatus,
   paymentStatus: order.paymentStatus,
   balanceDue: order.balanceDue, // Include balance due in the response
   bookingFee: order.bookingFee, // Include booking fee in the response
   codAmount: order.codAmount,
  }));

  // Respond with the formatted orders
  res.status(200).json(formattedOrders);
 } catch (err) {
  console.error("Error fetching orders by user ID:", err.message);
  res.status(500).json({ message: "Internal server error." });
 }
};

const paymentCallback = async (req, res) => {
 const { orderId } = req.params;
 const { paymentId, razorpayOrderId, status } = req.body; // Mock data

 try {
  const order = await Order.findById(orderId);
  if (!order) {
   return res.status(404).json({ message: "Order not found" });
  }

  if (status === "success") {
   order.paymentStatus = "Paid";
   order.orderStatus = "Confirmed";
  } else {
   order.paymentStatus = "Failed";
   order.orderStatus = "Pending";
  }

  await order.save();

  res.status(200).json({ message: "Payment status updated", order });
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

// Cancel an order
const cancelOrder = async (req, res) => {
 const { orderId } = req.params;

 try {
  const order = await Order.findById(orderId);
  if (!order) {
   return res.status(404).json({ message: "Order not found" });
  }

  if (order.orderStatus !== "Pending") {
   return res.status(400).json({ message: "Cannot cancel a processed order" });
  }

  order.orderStatus = "Cancelled";
  order.paymentStatus = "Refunded";

  await order.save();
  res.status(200).json({ message: "Order cancelled and refunded" });
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};
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
//    .populate({
//     path: "cartId",
//     populate: {
//      path: "items.productId",
//      model: "Product", // Replace 'Product' with your actual model if different
//     },
//    }) // Populate cart details with nested items
//    .populate("cartId")
//    // .populate({
//    //   path: "carId",
//    //   model: "Car", // Populate car details
//    // })
//    .populate("slot") // Populate the slot details if needed
//    .populate("address") // Populate the address details if needed
//    .populate("userId", "mobile cars currentCar") // Populate userId to get the mobile number and car details
//    .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
//    .exec();

//   if (orders.length === 0) {
//    return res.status(404).json({ message: "No orders found." });
//   }
//   console.log("orders:", orders);
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
//    carId: order.carId ? order.carId._id : null, // Check if carId is populated and return car details
//    user: order.userId
//     ? {
//        _id: order.userId._id,
//        mobile: order.userId.mobile,
//        cars: order.userId.cars,
//        currentCar: order.userId.currentCar,
//       }
//     : null, // Check if userId is populated and return user details
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
//    cart: order.cartId
//     ? {
//        _id: order.cartId._id,
//        items: order.cartId.items, // Include cart items details
//        totalItems: order.cartId.totalItems,
//        totalPrice: order.cartId.totalPrice,
//        finalPrice: order.cartId.finalPrice,
//        discount: order.cartId.discount,
//        couponCode: order.cartId.couponCode,
//        couponDiscount: order.cartId.couponDiscount,
//        cashbackAmount: order.cartId.cashbackAmount,
//        referralCode: order.cartId.referralCode,
//        referralDiscount: order.cartId.referralDiscount,
//        slot: order.cartId.slot,
//        slotDiscount: order.cartId.slotDiscount,
//        createdAt: order.cartId.createdAt,
//       }
//     : null, // Check if cartId is populated and return cart details
//    balanceDue: order.balanceDue, // Include balance due in the response
//    bookingFee: order.bookingFee, // Include booking fee in the response
//    codAmount: order.codAmount,
//    orderStatus: order.orderStatus,
//    paymentStatus: order.paymentStatus,
//    createdAt: order.createdAt,
//    updatedAt: order.updatedAt,
//   }));

//   // Respond with the formatted orders
//   console.log("formattedOrders:", formattedOrders);
//   res.status(200).json(formattedOrders);
//  } catch (err) {
//   console.error("Error fetching all orders:", err.message);
//   res.status(500).json({ message: "Internal server error." });
//  }
// };

// // Get all orders (for order history)
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
//   console.log('formattedOrders:', formattedOrders)
//   res.status(200).json(formattedOrders);
//  } catch (err) {
//   console.error("Error fetching all orders:", err.message);
//   res.status(500).json({ message: "Internal server error." });
//  }
// };

module.exports = {
 createOrder,
 paymentCallback,
 cancelOrder,
 getAllOrders,
 getOrdersByUserId,
};
