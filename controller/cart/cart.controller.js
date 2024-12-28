const Cart = require("../../model/cart/cart");
const CartItem = require("../../model/cart/cartItem.model");
const subCategoryModel = require("../../model/products/subCategory.model");

const Slot = require("../../model/cart/Slot");
const Product = require("../../model/products/product.model");
const CarPrice = require("../../model/products/productPriceBycar.model");
const SparePart = require("../../model/products/sparePart");
const SparePartPrice = require("../../model/products/SparePartPrice");
const CouponCode = require("../../model/refer-coupon-wallet/couponCode.model");
const Referral = require("../../model/refer-coupon-wallet/referAndEarn.model");
const Wallet = require("../../model/refer-coupon-wallet/wallet.model");
const Vendor = require("../../model/user/vendor.model");
const User = require("../../model/user/user.model");
const addToCart = async (req, res) => {
 const { userId } = req.params;
 const {
  productId,
  subCategoryId,
  type,
  quantity = 1,
  carId,
  extra_requirement, // Adding extra_requirement here
 } = req.body;

 try {
  let product, price;

  if (type === "Product") {
   product = await Product.findById(productId);
   if (!product) {
    return res.status(404).json({ message: "Product not found" });
   }

   const carPrice = carId ? await CarPrice.findOne({ productId, carId }) : null;
   price = carPrice ? carPrice.givenPrice : product.dummyPriceActual;
  } else if (type === "SparePart") {
   product = await SparePart.findById(productId);
   if (!product) {
    return res.status(404).json({ message: "Spare part not found" });
   }

   const carPrice = carId
    ? await SparePartPrice.findOne({ sparePartId: productId, carId })
    : null;

   price = carPrice ? carPrice.price : product.price;
  } else {
   return res.status(400).json({ message: "Invalid product type" });
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
   cart = new Cart({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
   (item) =>
    item.productId.toString() === productId &&
    item.subCategoryId.toString() === subCategoryId &&
    item.type === type
  );

  if (itemIndex > -1) {
   // If item already exists, update the quantity, totalPrice, and extra_requirement
   cart.items[itemIndex].quantity += quantity;
   cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * price;
   cart.items[itemIndex].extra_requirement = extra_requirement; // Update extra_requirement here
  } else {
   // Add a new item to the cart with extra_requirement
   const newItem = {
    productId: product._id,
    subCategoryId: subCategoryId,
    type,
    quantity,
    price,
    totalPrice: quantity * price,
    extra_requirement, // Add extra_requirement here
   };
   cart.items.push(newItem);
  }

  // Recalculate totals for the cart
  cart.calculateTotals();
  await cart.save();

  // Populate the product information before sending the response
  cart = await Cart.findOne({ userId }).populate("items.productId");
  res.status(201).json(cart);
 } catch (err) {
  console.error("Error adding to cart:", err.message);
  res.status(400).json({ message: err.message });
 }
};
/**/
// const addToCart = async (req, res) => {
//  const { userId } = req.params;
//  const { productId, subCategoryId, type, quantity = 1, carId } = req.body;

//  try {
//   let product, price;

//   if (type === "Product") {
//    product = await Product.findById(productId);
//    if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//    }

//    const carPrice = carId ? await CarPrice.findOne({ productId, carId }) : null;
//    price = carPrice ? carPrice.givenPrice : product.dummyPriceActual;
//   } else if (type === "SparePart") {
//    product = await SparePart.findById(productId);
//    if (!product) {
//     return res.status(404).json({ message: "Spare part not found" });
//    }

//    const carPrice = carId
//     ? await SparePartPrice.findOne({ sparePartId: productId, carId })
//     : null;

//    price = carPrice ? carPrice.price : product.price;
//   } else {
//    return res.status(400).json({ message: "Invalid product type" });
//   }

//   let cart = await Cart.findOne({ userId });
//   if (!cart) {
//    cart = new Cart({ userId, items: [] });
//   }

//   const itemIndex = cart.items.findIndex(
//    (item) =>
//     item.productId.toString() === productId &&
//     item.subCategoryId.toString() === subCategoryId &&
//     item.type === type
//   );

//   if (itemIndex > -1) {
//    cart.items[itemIndex].quantity += quantity;
//    cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * price;
//   } else {
//    const newItem = {
//     productId: product._id,
//     subCategoryId: subCategoryId,
//     type,
//     quantity,
//     price,
//     totalPrice: quantity * price,
//    };
//    cart.items.push(newItem);
//   }

//   cart.calculateTotals();
//   await cart.save();

//   cart = await Cart.findOne({ userId }).populate("items.productId");
//   res.status(201).json(cart);
//  } catch (err) {
//   console.error("Error adding to cart:", err.message);
//   res.status(400).json({ message: err.message });
//  }
// };

// const addToCart = async (req, res) => {
//  const { userId } = req.params;
//  const { productId, subCategoryId, type, quantity = 1, carId } = req.body;

//  try {
//   let product, price;

//   if (type === "Product") {
//    product = await Product.findById(productId);
//    if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//    }

//    // Check if there's a car-specific price
//    const carPrice = carId ? await CarPrice.findOne({ productId, carId }) : null;
//    price = carPrice ? carPrice.givenPrice : product.dummyPriceActual;
//   } else if (type === "SparePart") {
//    product = await SparePart.findById(productId);
//    if (!product) {
//     return res.status(404).json({ message: "Spare part not found" });
//    }

//    // Check if there's a car-specific price for spare parts
//    const carPrice = carId
//     ? await SparePartPrice.findOne({ sparePartId: productId, carId })
//     : null;

//    price = carPrice ? carPrice.price : product.price;
//   } else {
//    return res.status(400).json({ message: "Invalid product type" });
//   }

//   let cart = await Cart.findOne({ userId });
//   if (!cart) {
//    cart = new Cart({ userId, items: [] });
//   }

//   // Check if the item is already in the cart
//   const itemIndex = cart.items.findIndex(
//    (item) =>
//     item.productId.toString() === productId &&
//     item.subCategoryId.toString() === subCategoryId &&
//     item.type === type
//   );

//   if (itemIndex > -1) {
//    // If the item exists, update the quantity and total price
//    cart.items[itemIndex].quantity += quantity;
//    cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * price;
//   } else {
//    // If the item does not exist, create a new cart item
//    const newItem = new CartItem({
//     productId: product._id,
//     subCategoryId: subCategoryId,
//     type,
//     quantity,
//     price,
//     totalPrice: quantity * price,
//    });

//    await newItem.save();
//    cart.items.push(newItem);
//   }

//   cart.calculateTotals();
//   await cart.save();

//   cart = await Cart.findOne({ userId }).populate("items.productId");
//   res.status(201).json(cart);
//  } catch (err) {
//   console.error("Error adding to cart:", err.message);
//   res.status(400).json({ message: err.message });
//  }
// };
//******************************************************************************************************************************************************************** */
// const addToCart = async (req, res) => {
//  const { userId } = req.params;
//  const { productId, subCategoryId, type, quantity = 1, carId } = req.body;

//  try {
//   let product, price;

//   if (type === "Product") {
//    product = await Product.findById(productId);
//    if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//    }

//    const carPrice = carId ? await CarPrice.findOne({ productId, carId }) : null;
//    price = carPrice ? carPrice.givenPrice : product.dummyPriceActual;
//   } else if (type === "SparePart") {
//    product = await SparePart.findById(productId);
//    if (!product) {
//     return res.status(404).json({ message: "Spare part not found" });
//    }

//    const carPrice = carId
//     ? await SparePartPrice.findOne({ sparePartId: productId, carId })
//     : null;

//    price = carPrice ? carPrice.price : product.price;
//   } else {
//    return res.status(400).json({ message: "Invalid product type" });
//   }

//   let cart = await Cart.findOne({ userId });
//   if (!cart) {
//    cart = new Cart({ userId, items: [] });
//   }

//   const itemIndex = cart.items.findIndex(
//    (item) =>
//     item.productId.toString() === productId &&
//     item.subCategoryId.toString() === subCategoryId &&
//     item.type === type
//   );

//   if (itemIndex > -1) {
//    cart.items[itemIndex].quantity += quantity;
//    cart.items[itemIndex].totalPrice =
//     cart.items[itemIndex].quantity * cart.items[itemIndex].price;
//   } else {
//    const newItem = new CartItem({
//     productId: product._id,
//     subCategoryId: subCategoryId,
//     type,
//     quantity,
//     price,
//     totalPrice: quantity * price,
//    });

//    await newItem.save();
//    cart.items.push(newItem);
//   }

//   cart.calculateTotals();
//   await cart.save();

//   cart = await Cart.findOne({ userId }).populate("items.productId");
//   res.status(201).json(cart);
//  } catch (err) {
//   console.error("Error adding to cart:", err.message);
//   res.status(400).json({ message: err.message });
//  }
// };

//**************************************************************************************************************** */

// const applyCoupon = async (req, res) => {
//  const { userId } = req.params;
//  const { couponCode } = req.body;

//  try {
//   let cart = await Cart.findOne({ userId });
//   if (!cart) {
//    return res.status(404).json({ message: "Cart not found" });
//   }

//   const coupon = await CouponCode.findOne({ code: couponCode, isActive: true });
//   if (!coupon) {
//    return res.status(404).json({ message: "Invalid or expired coupon code" });
//   }

//   if (new Date() > new Date(coupon.expiryDate)) {
//    return res.status(400).json({ message: "Coupon code has expired" });
//   }

//   // If a coupon is already applied, remove it before applying the new one
//   if (cart.couponCode) {
//    cart.couponCode = null;
//    cart.couponDiscount = 0;
//    cart.cashbackAmount = 0; // Reset cashback if any
//    cart.calculateTotals(); // Recalculate totals without any coupon
//   }

//   let cashbackAmount = 0;

//   if (coupon.type === "discount") {
//    cart.couponCode = couponCode;
//    cart.couponDiscount = (cart.totalPrice * coupon.discountPercent) / 100;
//   } else if (coupon.type === "cashback") {
//    cashbackAmount = (cart.totalPrice * coupon.discountPercent) / 100;

//    let wallet = await Wallet.findOne({ userId });
//    if (!wallet) {
//     wallet = new Wallet({ userId, balance: 0 });
//    }

//    wallet.balance += cashbackAmount;
//    wallet.transactions.push({
//     amount: cashbackAmount,
//     description: `Cashback from coupon code: ${couponCode}`,
//    });

//    await wallet.save();

//    cart.couponCode = couponCode;
//    cart.couponDiscount = 0;
//    cart.cashbackAmount = cashbackAmount;
//   }

//   cart.calculateTotals(); // Recalculate totals with the new coupon
//   await cart.save();

//   res.status(200).json({
//    cart,
//    message:
//     coupon.type === "cashback"
//      ? `Cashback of ₹${cashbackAmount} applied to your wallet`
//      : "Discount applied",
//    cashbackAmount: coupon.type === "cashback" ? cashbackAmount : 0,
//   });
//  } catch (err) {
//   console.error("Error applying coupon:", err.message);
//   res.status(400).json({ message: err.message });
//  }
// };
// const applyCoupon = async (req, res) => {
//  try {
//   const { userId, couponCode } = req.body;

//   // Fetch the cart for the user
//   let cart = await Cart.findOne({ userId });

//   if (!cart) {
//    return res.status(404).json({ success: false, message: "Cart not found" });
//   }

//   // Check if the coupon code exists and is active
//   const coupon = await CouponCode.findOne({ code: couponCode, isActive: true });

//   if (!coupon) {
//    return res
//     .status(404)
//     .json({ success: false, message: "Invalid or expired coupon code" });
//   }

//   // Check if the coupon is applicable to the subcategory in the cart
//   // const isApplicable = cart.items.some(
//   //  (item) => item.subCategoryId.toString() === coupon.subCategory.toString()
//   // );
//   // if (!isApplicable) {
//   //  return res
//   //   .status(400)
//   //   .json({ success: false, message: "Coupon not applicable to this cart" });
//   // }

//   // Apply discount or cashback based on the coupon type
//   if (coupon.type === "discount") {
//    // Apply percentage-based discount to total cart price
//    cart.couponCode = coupon.code;
//    cart.couponDiscount = (cart.totalPrice * coupon.discountPercent) / 100;
//   } else if (coupon.type === "cashback") {
//    // Add cashback to user's wallet and reset cart coupon fields
//    const cashbackAmount = (cart.totalPrice * coupon.discountPercent) / 100;
//    await User.findByIdAndUpdate(userId, {
//     $inc: { walletBalance: cashbackAmount },
//    });

//    cart.couponCode = coupon.code;
//    cart.couponDiscount = 0; // No discount applied in the cart, cashback applied to wallet
//    cart.cashbackAmount = cashbackAmount;
//   }

//   // Calculate the new total price after applying coupon
//   cart.calculateTotals();
//   await cart.save();

//   return res.status(200).json({
//    success: true,
//    message: `Coupon applied successfully: ${
//     coupon.type === "discount" ? "Discount" : "Cashback"
//    }`,
//    cart,
//   });
//  } catch (error) {
//   console.error("Error applying coupon:", error);
//   return res.status(500).json({
//    success: false,
//    message: "Failed to apply coupon",
//    error: error.message,
//   });
//  }
// };

// Apply Coupon to Cart
const applyCoupon = async (req, res) => {
 const { userId } = req.params;
 const { couponCode } = req.body;

 try {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  const coupon = await CouponCode.findOne({ code: couponCode, isActive: true });
  if (!coupon) {
   return res.status(404).json({ message: "Invalid or expired coupon code" });
  }

  if (new Date() > new Date(coupon.expiryDate)) {
   return res.status(400).json({ message: "Coupon code has expired" });
  }

  let cashbackAmount = 0;

  if (coupon.type === "discount") {
   cart.couponCode = couponCode;
   cart.couponDiscount = (cart.totalPrice * coupon.discountPercent) / 100;
   cart.calculateTotals();
  } else if (coupon.type === "cashback") {
   cashbackAmount = (cart.totalPrice * coupon.discountPercent) / 100;

   let wallet = await Wallet.findOne({ userId });
   if (!wallet) {
    wallet = new Wallet({ userId, balance: 0 });
   }

   wallet.balance += cashbackAmount;
   wallet.transactions.push({
    amount: cashbackAmount,
    description: `Cashback from coupon code: ${couponCode}`,
   });

   await wallet.save();

   cart.couponCode = couponCode;
   cart.couponDiscount = 0;
   cart.calculateTotals();
  }

  await cart.save();

  // Return the response with an additional field for cashbackAmount if it was a cashback coupon
  res.status(200).json({
   cart,
   message:
    coupon.type === "cashback"
     ? `Cashback of ₹${cashbackAmount} applied to your wallet`
     : "Discount applied",
   cashbackAmount: coupon.type === "cashback" ? cashbackAmount : 0,
  });
 } catch (err) {
  console.error("Error applying coupon:", err.message);
  res.status(400).json({ message: err.message });
 }
};

// const applyCoupon = async (req, res) => {
//  const { userId } = req.params;
//  const { couponCode } = req.body;

//  try {
//   let cart = await Cart.findOne({ userId });
//   if (!cart) {
//    return res.status(404).json({ message: "Cart not found" });
//   }

//   const coupon = await CouponCode.findOne({ code: couponCode, isActive: true });
//   if (!coupon) {
//    return res.status(404).json({ message: "Invalid or expired coupon code" });
//   }

//   if (new Date() > new Date(coupon.expiryDate)) {
//    return res.status(400).json({ message: "Coupon code has expired" });
//   }

//   if (coupon.type === "discount") {
//    cart.couponCode = couponCode;
//    cart.couponDiscount = (cart.totalPrice * coupon.discountPercent) / 100;
//    cart.calculateTotals();
//   } else if (coupon.type === "cashback") {
//    const cashbackAmount = (cart.totalPrice * coupon.discountPercent) / 100;

//    let wallet = await Wallet.findOne({ userId });
//    if (!wallet) {
//     wallet = new Wallet({ userId, balance: 0 });
//    }

//    wallet.balance += cashbackAmount;
//    wallet.transactions.push({
//     amount: cashbackAmount,
//     description: `Cashback from coupon code: ${couponCode}`,
//    });

//    await wallet.save();

//    cart.couponCode = couponCode;
//    cart.couponDiscount = 0;
//    cart.calculateTotals();
//   }

//   await cart.save();
//   res.status(200).json(cart);
//  } catch (err) {
//   console.error("Error applying coupon:", err.message);
//   res.status(400).json({ message: err.message });
//  }
// };
const removeCoupon = async (req, res) => {
 const { userId } = req.params;

 try {
  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  cart.couponCode = null;
  cart.couponDiscount = 0;
  cart.cashback = 0;

  cart.calculateTotals();
  await cart.save();

  res.status(200).json(cart);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

// Update item quantity in the cart
const updateCartItem = async (req, res) => {
 const { userId } = req.params;
 const { productId, subCategoryId, quantity, couponCode, referralCode } =
  req.body;

 try {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
   (item) =>
    item.productId.toString() === productId &&
    item.subCategoryId.toString() === subCategoryId
  );

  if (itemIndex > -1) {
   if (quantity <= 0) {
    cart.items.splice(itemIndex, 1); // Remove item if quantity is 0 or less
   } else {
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].totalPrice = quantity * cart.items[itemIndex].price;
   }

   // Apply coupon discount
   if (couponCode) {
    const coupon = await CouponCode.findOne({
     code: couponCode,
     isActive: true,
    });
    if (coupon) {
     cart.couponDiscount = (cart.totalPrice * coupon.discountPercent) / 100;
    } else {
     cart.couponDiscount = 0;
    }
   }

   // Apply referral discount (example: 5% discount)
   if (referralCode) {
    cart.referralDiscount = cart.totalPrice * 0.05; // Example: 5% referral discount
   }

   cart.calculateTotals();
   await cart.save();

   return res.status(200).json(cart);
  } else {
   return res.status(404).json({ message: "Product not found in cart" });
  }
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const removeFromCart = async (req, res) => {
 const { userId } = req.params;
 const { productId, subCategoryId } = req.body;

 try {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
   (item) =>
    item.productId.toString() === productId &&
    item.subCategoryId.toString() === subCategoryId
  );

  if (itemIndex > -1) {
   cart.items.splice(itemIndex, 1); // Remove item

   // Reset coupon and referral discounts if applicable
   cart.couponDiscount = 0;
   cart.referralDiscount = 0;

   cart.calculateTotals();
   await cart.save();

   return res.status(200).json(cart);
  } else {
   return res.status(404).json({ message: "Product not found in cart" });
  }
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};
const getCart = async (req, res) => {
 const { userId } = req.params;

 try {
  // Fetch the cart and populate the user details
  const cart = await Cart.findOne({ userId })
   .populate({
    path: "userId",
    model: "User",
    select: "name mobile address1 address2 pincode landmark", // Select only the fields you want to include
   })
   .exec();

  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  const itemDetails = await Promise.all(
   cart.items.map(async (item) => {
    let details;
    let formattedDetails = {};

    if (item.type === "Product") {
     details = await Product.findById(item.productId)
      .populate("categoryId")
      .populate("subCategoryId")
      .exec();

     if (details) {
      formattedDetails = {
       categoryId: details.categoryId ? details.categoryId.toObject() : null,
       subCategoryId: details.subCategoryId
        ? details.subCategoryId.toObject()
        : null,
       productName: details.productName,
       productImage: details.productImage,
       productBannerImages: details.productBannerImages || [],
       highlights: details.highlights || [],
       tags: details.tags || [],
       offerTag: details.offerTag || [],
       includedService: details.includedService || [],
       additionalServices: details.additionalServices || [],
       stepsAfterBooking: details.stepsAfterBooking || [],
       ratings: details.ratings,
       dummyPriceMrp: details.dummyPriceMrp,
       dummyPriceActual: details.dummyPriceActual,
       maxQuantity: details.maxQuantity,
      };
     }
    } else if (item.type === "SparePart") {
     details = await SparePart.findById(item.productId)
      .populate("SubCategory")
      .exec();

     if (details) {
      formattedDetails = {
       spareName: details.spareName,
       image: details.image,
       price: details.price,
       mrp: details.mrp,
       highlights: details.highlights || [],
       SubCategory: details.SubCategory ? details.SubCategory.toObject() : null,
      };
     }
    }

    return {
     _id: item._id,
     productId: item.productId,
     subCategoryId: item.subCategoryId,
     type: item.type,
     quantity: item.quantity,
     price: item.price,
     totalPrice: item.totalPrice,
     productDetails: formattedDetails,
    };
   })
  );

  let cashbackAmount = 0;
  if (cart.couponCode) {
   const coupon = await CouponCode.findOne({
    code: cart.couponCode,
    isActive: true,
   });
   if (coupon && coupon.type === "cashback") {
    cashbackAmount = (cart.totalPrice * coupon.discountPercent) / 100;
   }
  }

  const cartResponse = {
   _id: cart._id,
   userId: cart.userId, // This will include the populated user details
   items: itemDetails,
   totalItems: cart.totalItems,
   totalPrice: cart.totalPrice,
   finalPrice: cart.finalPrice,
   discount: cart.discount,
   couponCode: cart.couponCode,
   couponDiscount: cart.couponDiscount,
   referralCode: cart.referralCode,
   referralDiscount: cart.referralDiscount,
   slotDiscount: cart.slotDiscount,
   cashbackAmount: cashbackAmount,
   createdAt: cart.createdAt,
   __v: cart.__v,
  };

  res.status(200).json({ cart: cartResponse });
 } catch (err) {
  console.error(err);
  res.status(400).json({ message: err.message });
 }
};

// const getCart = async (req, res) => {
//   const { userId } = req.params;

//   try {
//    // Fetch the cart without population
//    const cart = await Cart.findOne({ userId }).exec();

//    if (!cart) {
//     return res.status(404).json({ message: "Cart not found" });
//    }

//    // Fetch or calculate cashback amount
//    const cashbackAmount = cart.cashbackAmount || 0; // Adjust based on where/how it's stored

//    // Construct item details
//    const itemDetails = await Promise.all(
//     cart.items.map(async (item) => {
//      let details;
//      let formattedDetails = {};

//      if (item.type === "Product") {
//       details = await Product.findById(item.productId)
//        .populate("categoryId")
//        .populate("subCategoryId")
//        .exec();

//       if (details) {
//        formattedDetails = {
//         categoryId: details.categoryId ? details.categoryId.toObject() : null,
//         subCategoryId: details.subCategoryId
//          ? details.subCategoryId.toObject()
//          : null,
//         productName: details.productName,
//         productImage: details.productImage,
//         productBannerImages: details.productBannerImages || [],
//         highlights: details.highlights || [],
//         tags: details.tags || [],
//         offerTag: details.offerTag || [],
//         includedService: details.includedService || [],
//         additionalServices: details.additionalServices || [],
//         stepsAfterBooking: details.stepsAfterBooking || [],
//         ratings: details.ratings,
//         dummyPriceMrp: details.dummyPriceMrp,
//         dummyPriceActual: details.dummyPriceActual,
//         maxQuantity: details.maxQuantity,
//        };
//       }
//      } else if (item.type === "SparePart") {
//       details = await SparePart.findById(item.productId)
//        .populate("SubCategory")
//        .exec();

//       if (details) {
//        formattedDetails = {
//         spareName: details.spareName,
//         image: details.image,
//         price: details.price,
//         mrp: details.mrp,
//         highlights: details.highlights || [],
//         SubCategory: details.SubCategory ? details.SubCategory.toObject() : null,
//        };
//       }
//      }

//      return {
//       _id: item._id,
//       productId: item.productId,
//       subCategoryId: item.subCategoryId,
//       type: item.type,
//       quantity: item.quantity,
//       price: item.price,
//       totalPrice: item.totalPrice,
//       productDetails: formattedDetails,
//      };
//     })
//    );

//    // Manually update the cart items and include cashbackAmount
//    const cartResponse = {
//     _id: cart._id,
//     userId: cart.userId,
//     items: itemDetails,
//     totalItems: cart.totalItems,
//     totalPrice: cart.totalPrice,
//     finalPrice: cart.finalPrice,
//     discount: cart.discount,
//     couponCode: cart.couponCode,
//     couponDiscount: cart.couponDiscount,
//     referralCode: cart.referralCode,
//     referralDiscount: cart.referralDiscount,
//     slotDiscount: cart.slotDiscount,
//     cashbackAmount: cashbackAmount, // Add cashback amount here
//     createdAt: cart.createdAt,
//     __v: cart.__v,
//    };

//    // Respond with the manually constructed cart object
//    res.status(200).json({ cart: cartResponse });
//   } catch (err) {
//    console.error(err); // Debugging line for error
//    res.status(400).json({ message: err.message });
//   }
//  };

// const getCart = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId }).exec();

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     const itemDetails = await Promise.all(
//       cart.items.map(async (item) => {
//         let details;
//         let formattedDetails = {};

//         if (item.type === "Product") {
//           details = await Product.findById(item.productId)
//             .populate("categoryId")
//             .populate("subCategoryId")
//             .exec();

//           if (details) {
//             formattedDetails = {
//               categoryId: details.categoryId ? details.categoryId.toObject() : null,
//               subCategoryId: details.subCategoryId ? details.subCategoryId.toObject() : null,
//               productName: details.productName,
//               productImage: details.productImage,
//               productBannerImages: details.productBannerImages || [],
//               highlights: details.highlights || [],
//               tags: details.tags || [],
//               offerTag: details.offerTag || [],
//               includedService: details.includedService || [],
//               additionalServices: details.additionalServices || [],
//               stepsAfterBooking: details.stepsAfterBooking || [],
//               ratings: details.ratings,
//               dummyPriceMrp: details.dummyPriceMrp,
//               dummyPriceActual: details.dummyPriceActual,
//               maxQuantity: details.maxQuantity,
//             };
//           }
//         } else if (item.type === "SparePart") {
//           details = await SparePart.findById(item.productId)
//             .populate("SubCategory")
//             .exec();

//           if (details) {
//             formattedDetails = {
//               spareName: details.spareName,
//               image: details.image,
//               price: details.price,
//               mrp: details.mrp,
//               highlights: details.highlights || [],
//               SubCategory: details.SubCategory ? details.SubCategory.toObject() : null,
//             };
//           }
//         }

//         return {
//           _id: item._id,
//           productId: item.productId,
//           subCategoryId: item.subCategoryId,
//           type: item.type,
//           quantity: item.quantity,
//           price: item.price,
//           totalPrice: item.totalPrice,
//           productDetails: formattedDetails,
//         };
//       })
//     );

//     let cashbackAmount = 0;
//     if (cart.couponCode) {
//       const coupon = await CouponCode.findOne({ code: cart.couponCode, isActive: true });
//       if (coupon && coupon.type === "cashback") {
//         cashbackAmount = (cart.totalPrice * coupon.discountPercent) / 100;
//       }
//     }

//     const cartResponse = {
//       _id: cart._id,
//       userId: cart.userId,
//       items: itemDetails,
//       totalItems: cart.totalItems,
//       totalPrice: cart.totalPrice,
//       finalPrice: cart.finalPrice,
//       discount: cart.discount,
//       couponCode: cart.couponCode,
//       couponDiscount: cart.couponDiscount,
//       referralCode: cart.referralCode,
//       referralDiscount: cart.referralDiscount,
//       slotDiscount: cart.slotDiscount,
//       cashbackAmount: cashbackAmount,
//       createdAt: cart.createdAt,
//       __v: cart.__v,
//     };

//     res.status(200).json({ cart: cartResponse });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }
// };

// const getCart = async (req, res) => {
//  const { userId } = req.params;

//  try {
//   // Fetch the cart without population
//   const cart = await Cart.findOne({ userId }).exec();

//   if (!cart) {
//    return res.status(404).json({ message: "Cart not found" });
//   }

//   // Construct item details
//   const itemDetails = await Promise.all(
//    cart.items.map(async (item) => {
//     let details;
//     let formattedDetails = {};

//     if (item.type === "Product") {
//      details = await Product.findById(item.productId)
//       .populate("categoryId")
//       .populate("subCategoryId")
//       .exec();

//      if (details) {
//       formattedDetails = {
//        categoryId: details.categoryId ? details.categoryId.toObject() : null,
//        subCategoryId: details.subCategoryId
//         ? details.subCategoryId.toObject()
//         : null,
//        productName: details.productName,
//        productImage: details.productImage,
//        productBannerImages: details.productBannerImages || [],
//        highlights: details.highlights || [],
//        tags: details.tags || [],
//        offerTag: details.offerTag || [],
//        includedService: details.includedService || [],
//        additionalServices: details.additionalServices || [],
//        stepsAfterBooking: details.stepsAfterBooking || [],
//        ratings: details.ratings,
//        dummyPriceMrp: details.dummyPriceMrp,
//        dummyPriceActual: details.dummyPriceActual,
//        maxQuantity: details.maxQuantity,
//       };
//      }
//     } else if (item.type === "SparePart") {
//      details = await SparePart.findById(item.productId)
//       .populate("SubCategory")
//       .exec();

//      if (details) {
//       formattedDetails = {
//        spareName: details.spareName,
//        image: details.image,
//        price: details.price,
//        mrp: details.mrp,
//        highlights: details.highlights || [],
//        SubCategory: details.SubCategory ? details.SubCategory.toObject() : null,
//       };
//      }
//     }

//     return {
//      _id: item._id,
//      productId: item.productId,
//      subCategoryId: item.subCategoryId,
//      type: item.type,
//      quantity: item.quantity,
//      price: item.price,
//      totalPrice: item.totalPrice,
//      productDetails: formattedDetails,
//     };
//    })
//   );

//   // Manually update the cart items
//   const cartResponse = {
//    _id: cart._id,
//    userId: cart.userId,
//    items: itemDetails,
//    totalItems: cart.totalItems,
//    totalPrice: cart.totalPrice,
//    finalPrice: cart.finalPrice,
//    discount: cart.discount,
//    couponCode: cart.couponCode,
//    couponDiscount: cart.couponDiscount,
//    referralCode: cart.referralCode,
//    referralDiscount: cart.referralDiscount,
//    slotDiscount: cart.slotDiscount,
//    createdAt: cart.createdAt,
//    __v: cart.__v,
//   };

//   // Respond with the manually constructed cart object
//   res.status(200).json({ cart: cartResponse });
//  } catch (err) {
//   console.error(err); // Debugging line for error
//   res.status(400).json({ message: err.message });
//  }
// };

// Clear the cart
const clearCart = async (req, res) => {
 const { userId } = req.params;

 try {
  const cart = await Cart.findOneAndDelete({ userId });
  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  res.status(200).json({ message: "Cart cleared successfully" });
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const updateCartItemQuantity = async (req, res) => {
 const { userId } = req.params;
 const { productId, subCategoryId, quantity } = req.body;

 try {
  // Find the user's cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  // Find the index of the item to update
  const itemIndex = cart.items.findIndex(
   (item) =>
    item.productId.toString() === productId &&
    item.subCategoryId.toString() === subCategoryId
  );

  if (itemIndex > -1) {
   // If product exists in cart
   if (quantity > 0) {
    // Update the quantity if the new quantity is greater than 0
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].totalPrice = quantity * cart.items[itemIndex].price;
   } else {
    // Remove the item if the quantity is 0 or less
    cart.items.splice(itemIndex, 1);
   }

   // Recalculate the cart totals
   cart.calculateTotals();

   // Save the updated cart
   await cart.save();

   // Return the updated cart
   return res.status(200).json(cart);
  } else {
   return res.status(404).json({ message: "Product not found in cart" });
  }
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};
const bookSlot = async (req, res) => {
 const { userId } = req.params;
 const { slotId, city, date } = req.body;

 try {
  // Find the slot by ID
  const slot = await Slot.findById(slotId);
  if (!slot) {
   return res.status(404).json({ message: "Slot not found" });
  }

  // Count the number of available vendors in the selected city
  const vendorCount = await Vendor.countDocuments({
   city: city,
   isOnline: true,
   role: "vendor", // Ensure only vendors are counted
  });

  if (vendorCount === 0) {
   return res
    .status(400)
    .json({ message: "No vendors available in this city" });
  }

  // Update maxBookings for the slot if not already set
  if (slot.maxBookings === 0) {
   slot.maxBookings = vendorCount;
  }

  // Check if the slot is still available
  if (!slot.isAvailable()) {
   return res.status(400).json({ message: "Slot is fully booked" });
  }

  // Find the user's cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  // Update the cart with the selected slot, date, and apply the discount
  cart.slot = slot._id;
  cart.slotDate = date;
  cart.slotDiscount = (cart.totalPrice * slot.discount) / 100;

  // Recalculate the final price
  cart.calculateTotals();

  // Save the updated cart
  await cart.save();

  // Increment the slot's currentBookings
  slot.currentBookings += 1;
  await slot.save();

  // Return the updated cart
  console.log("cart:", cart);
  return res.status(200).json(cart);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};
// Apply Referral Code to Cart
const applyReferralCode = async (req, res) => {
 const { userId } = req.params;
 const { referralCode } = req.body;

 try {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
   return res.status(404).json({ message: "Cart not found" });
  }

  const referral = await Referral.findOne({
   code: referralCode,
   isActive: true,
  });
  if (!referral) {
   return res.status(404).json({ message: "Invalid or expired referral code" });
  }

  if (new Date() > new Date(referral.expiryDate)) {
   return res.status(400).json({ message: "Referral code has expired" });
  }

  cart.referralCode = referralCode;
  cart.referralDiscount = (cart.totalPrice * referral.discountPercent) / 100;
  cart.calculateTotals();

  await cart.save();
  res.status(200).json(cart);
 } catch (err) {
  console.error("Error applying referral code:", err.message);
  res.status(400).json({ message: err.message });
 }
};

module.exports = {
 addToCart,
 updateCartItem,
 removeFromCart,
 getCart,
 clearCart,
 updateCartItemQuantity,
 bookSlot,
 removeCoupon,
 applyCoupon,
 applyReferralCode,
};
