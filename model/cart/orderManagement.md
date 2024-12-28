Sure! Below is a structured version of the code that includes the updated model, routes, and controller logic based on the requirements you provided.

### 1. **Order Model (`models/Order.js`)**

```javascript
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  bookingFee: {
    type: Number,
    default: 0,
  },
  balanceDue: {
    type: Number,
    default: 0,
  },
  serviceCharge: {
    type: Number,
    default: 0,
  },
  codAmount: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    required: true,
  },
  refundAmount: {
    type: Number,
    default: 0,
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
  },
  trackingStatus: {
    type: String,
    default: "ordered",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
```

### 2. **Routes (`routes/orderRoutes.js`)**

```javascript
const express = require("express");
const router = express.Router();

const {
  createOrder,
  paymentCallback,
  cancelOrder,
  getAllOrders,
  updateOrderAddress,
  getOrderDetails,
  cancelAndRefundOrder,
} = require("../controllers/orderController");

// Order routes
router.post("/orders", createOrder);
router.put("/orders/:orderId/address", updateOrderAddress);
router.get("/orders/:orderId/details", getOrderDetails);
router.put("/orders/:orderId/cancel", cancelAndRefundOrder);
router.post("/orders/:orderId/payment-callback", paymentCallback);
router.get("/orders", getAllOrders);

module.exports = router;
```

### 3. **Order Controller (`controllers/orderController.js`)**

```javascript
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const BookingFee = require("../models/BookingFee");

// Create a new order
const createOrder = async (req, res) => {
  const { userId } = req.params;
  const { paymentMethod, serviceCharge } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.totalItems === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let finalPrice = cart.finalPrice + (serviceCharge || 0);

    const bookingFeeDoc = await BookingFee.findOne();
    const bookingFee = bookingFeeDoc ? bookingFeeDoc.amount : 0;

    let balanceDue = 0;
    let codAmount = 0;

    if (paymentMethod === "Full Payment") {
      finalPrice = finalPrice * 0.98; // Apply 2% discount
      balanceDue = 0;
    } else if (paymentMethod === "Booking Fee") {
      balanceDue = finalPrice - bookingFee;
    } else if (paymentMethod === "COD") {
      codAmount = finalPrice;
      balanceDue = finalPrice;
    }

    const order = new Order({
      userId,
      cart: cart.toObject(),
      totalPrice: cart.totalPrice,
      finalPrice,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      bookingFee,
      balanceDue,
      serviceCharge,
      codAmount,
      address: cart.address, // Assuming address is stored in the cart
    });

    await order.save();

    const razorpayOrder = {
      id: `order_${Math.random().toString(36).substr(2, 9)}`, // Mock order ID
      amount: finalPrice,
      currency: "INR",
      receipt: `receipt_${order._id}`,
      status: "created",
    };

    // Optionally, delete the cart after order creation
    // await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      paymentMethod: order.paymentMethod,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order address
const updateOrderAddress = async (req, res) => {
  const { orderId } = req.params;
  const { newAddress } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.address = newAddress;
    await order.save();

    res.status(200).json({ message: "Order address updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get order details with populated data
const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate("cart.items.productId")
      .populate("slot")
      .populate("userId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel and refund an order
const cancelAndRefundOrder = async (req, res) => {
  const { orderId } = req.params;
  const { refundAmount } = req.body;

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
    order.refundAmount = refundAmount;

    await order.save();

    res.status(200).json({ message: "Order cancelled and refunded", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mock payment callback
const paymentCallback = async (req, res) => {
  const { orderId } = req.params;
  const { paymentId, razorpayOrderId, status } = req.body;

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

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("cart.items.productId")
      .populate("slot")
      .populate("userId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  paymentCallback,
  cancelOrder: cancelAndRefundOrder,
  getAllOrders,
  updateOrderAddress,
  getOrderDetails,
  cancelAndRefundOrder,
};
```

### 4. **Additional Models (`models/Cart.js`, `models/BookingFee.js`)**

You might already have these models, but for completeness:

**Cart Model (`models/Cart.js`):**

```javascript
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalItems: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type:

 Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
```

**Booking Fee Model (`models/BookingFee.js`):**

```javascript
const mongoose = require("mongoose");

const bookingFeeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BookingFee", bookingFeeSchema);
```

### 5. **Server Setup (`server.js`)**

Ensure that you have your server set up to use the routes:

```javascript
const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

// Database connection
mongoose.connect("mongodb://localhost:27017/yourdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use routes
app.use("/api", orderRoutes);

const PORT = process.env.PORT || 8900;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Summary:

- **Order Model:** Updated to include fields for refund handling and structured cart data.
- **Order Routes and Controller:** Implemented endpoints to handle order creation, address update, order detail retrieval, cancellation, and refunds.
- **Additional Models:** Provided Cart and BookingFee models to handle associated data.

This structure should give you a comprehensive solution for your order management system in the backend. Let me know if you have any further questions!