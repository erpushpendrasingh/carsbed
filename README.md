### cupon code generation

Discount Type: Percentage or fixed amount.
Discount Value: The value of the discount.
Expiration Date: When the coupon becomes invalid.
Usage Limits: How many times a coupon can be used.
Applicable Services/Products: Specific services or products the coupon can be applied to.
Minimum Purchase Amount: Minimum amount required to use the coupon.
Customer Restrictions: Specific customers who can use the coupon (e.g., first-time users).
Geographical Restrictions: Specific locations where the coupon is valid.

### Time slots

Time Slot Creation:

Define available time slots based on the working hours of the garage and the availability of mechanics.
Time slots can be created in intervals (e.g., every 30 minutes).
Time Slot Booking:

Customers can select an available time slot when booking a service.
The system checks if the selected time slot is available and confirms the booking.
Time Slot Management:

Track booked and available time slots.
Allow rescheduling or cancellation of bookings.
Conflict Resolution:

Ensure no double-booking of mechanics or service bays.
Handle overlapping appointments and service durations.

`Explanation of the Code`
create_time_slots: Generates time slots based on working hours and interval duration.
is_time_slot_available: Checks if a time slot is available.
book_time_slot: Books a time slot if it is available and the mechanic is free.
is_mechanic_available: Checks if the mechanic is available for the selected time slot.
send_notification: Simulates sending a notification to the user.

To test the order creation and payment logic with Postman, follow these steps:

### 1. **Start Your Server**

Make sure your server is running. You can start it with the following command:

```bash
node app.js
```

Ensure that the database is connected and all necessary services are running.

### 2. **Set Booking Fee Using Postman**

Before testing order creation, make sure you have set the booking fee in the database.

**Endpoint:** `POST /api/admin/booking-fee`

**Steps:**

1. Open Postman.
2. Set the request method to `POST`.
3. Enter the URL: `http://localhost:3000/api/admin/booking-fee`.
4. Go to the `Body` tab, select `raw`, and then `JSON` from the dropdown.
5. Enter the following JSON data:

   ```json
   {
    "amount": 500 // Set this to any value you want for the booking fee
   }
   ```

6. Click `Send`.

**Expected Response:**

```json
{
 "message": "Booking fee updated successfully",
 "bookingFee": {
  "_id": "someObjectId",
  "amount": 500,
  "updatedAt": "2024-08-22T10:00:00.000Z",
  "__v": 0
 }
}
```

### 3. **Create an Order**

Now, let's create an order with the cart data you provided.

**Endpoint:** `POST /api/orders/:userId`

**Steps:**

1. Set the request method to `POST`.
2. Replace `:userId` with the actual `userId` from your database.
3. Enter the URL: `http://localhost:3000/api/orders/6687991b8b48547d2c3aa120`.
4. Go to the `Body` tab, select `raw`, and then `JSON`.
5. Enter the following JSON data:

   **For Booking Fee:**

   ```json
   {
    "paymentMethod": "Booking Fee",
    "serviceCharge": 0 // You can set this to any number if you have a service charge
   }
   ```

   **For Full Payment:**

   ```json
   {
    "paymentMethod": "Full Payment",
    "serviceCharge": 0 // You can set this to any number if you have a service charge
   }
   ```

   **For Cash on Delivery (COD):**

   ```json
   {
    "paymentMethod": "COD",
    "serviceCharge": 0 // You can set this to any number if you have a service charge
   }
   ```

6. Click `Send`.

**Expected Response:**

**For Booking Fee:**

```json
{
 "orderId": "someOrderId",
 "razorpayOrderId": "order_mock12345",
 "amount": 3500, // Example: if booking fee is 500, finalPrice - bookingFee = 3500
 "currency": "INR",
 "receipt": "receipt_someOrderId",
 "paymentMethod": "Booking Fee"
}
```

**For Full Payment:**

```json
{
 "orderId": "someOrderId",
 "razorpayOrderId": "order_mock12345",
 "amount": 3920, // Example: if finalPrice is 4000, 2% discount = 3920
 "currency": "INR",
 "receipt": "receipt_someOrderId",
 "paymentMethod": "Full Payment"
}
```

**For Cash on Delivery (COD):**

```json
{
 "orderId": "someOrderId",
 "razorpayOrderId": "order_mock12345",
 "amount": 4000, // No discount or extra charge
 "currency": "INR",
 "receipt": "receipt_someOrderId",
 "paymentMethod": "COD"
}
```

### 4. **Check the Database**

After creating the order, check your database to verify:

- The `Order` collection should have a new entry with the correct `finalPrice`, `paymentMethod`, and `bookingFee`.
- The cart for the user should be deleted (if your logic includes cart deletion after order creation).

### 5. **Mock Payment Callback (Optional)**

To simulate a payment callback:

**Endpoint:** `POST /api/orders/:orderId/payment/callback`

**Steps:**

1. Replace `:orderId` with the actual `orderId` from the previous step.
2. Enter the URL: `http://localhost:3000/api/orders/someOrderId/payment/callback`.
3. Go to the `Body` tab, select `raw`, and then `JSON`.
4. Enter the following JSON data:

   ```json
   {
    "paymentId": "pay_mock12345",
    "razorpayOrderId": "order_mock12345",
    "status": "success"
   }
   ```

5. Click `Send`.

**Expected Response:**

```json
{
 "message": "Payment status updated",
 "order": {
  "_id": "someOrderId",
  "userId": "6687991b8b48547d2c3aa120",
  "totalPrice": 4000,
  "finalPrice": 3920,
  "paymentMethod": "Full Payment",
  "paymentStatus": "Paid",
  "orderStatus": "Confirmed",
  "bookingFee": 0,
  "balanceDue": 0,
  "serviceCharge": 0,
  "codAmount": 0,
  "createdAt": "2024-08-22T10:00:00.000Z",
  "__v": 0
 }
}
```

### Summary:

- **Set the booking fee** using the admin endpoint.
- **Create orders** using different payment methods and verify the amount is correctly calculated.
- **Check the database** to ensure everything is being stored correctly.
- **Simulate payment callbacks** to update the order status (optional).

If you encounter any issues during testing or if the results are not as expected, feel free to ask for further assistance!
Thank you for the clarification. Given your requirements, we will modify the logic as follows:

1. **Booking Fee:** If the user chooses the "Booking Fee" option, the booking fee will be subtracted from the total amount, and the balance will be due later.
2. **Full Payment:** If the user chooses "Full Payment," they will receive a 2% discount on the total amount.
3. **Cash on Delivery (COD):** If the user chooses COD, there is no discount or additional fees.

Here’s how you can implement this logic:

### Updated Order Creation Logic

```javascript
const createOrder = async (req, res) => {
 const { userId } = req.params;
 const { paymentMethod, serviceCharge } = req.body;

 try {
  // Fetch the cart
  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart || cart.totalItems === 0) {
   return res.status(400).json({ message: "Cart is empty" });
  }

  // Calculate final price including any service charge
  let finalPrice = cart.finalPrice + (serviceCharge || 0);

  // Retrieve the current booking fee from the database
  const bookingFeeDoc = await BookingFee.findOne();
  const bookingFee = bookingFeeDoc ? bookingFeeDoc.amount : 0;

  let balanceDue = 0;
  let codAmount = 0;

  if (paymentMethod === "Full Payment") {
   // Apply a 2% discount for full payment
   finalPrice = finalPrice * 0.98; // 2% discount
   balanceDue = 0;
  } else if (paymentMethod === "Booking Fee") {
   // Subtract the booking fee from the final price
   balanceDue = finalPrice - bookingFee;
  } else if (paymentMethod === "COD") {
   // No discount or additional fees for COD
   codAmount = finalPrice;
   balanceDue = finalPrice;
  }

  // Create and save the order in the database
  const order = new Order({
   userId,
   cart: cart.toObject(),
   totalPrice: cart.totalPrice,
   finalPrice, // This is the updated final price after applying discounts or fees
   paymentMethod,
   paymentStatus: "Pending",
   orderStatus: "Pending",
   bookingFee,
   balanceDue,
   serviceCharge,
   codAmount,
  });

  await order.save();

  // Set the amount for Razorpay without converting to paise (since you've asked not to do so)
  const amount = finalPrice;

  // Mock Razorpay order creation with the correct amount
  const razorpayOrder = {
   id: `order_${Math.random().toString(36).substr(2, 9)}`, // Mock order ID
   amount: amount, // Directly using the final amount without converting to paise
   currency: "INR",
   receipt: `receipt_${order._id}`,
   status: "created",
  };

  // Optionally, delete the cart after order creation
  await Cart.findOneAndDelete({ userId });

  // Respond with order details
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
```

### Explanation:

1. **Booking Fee:**

   - If the user selects "Booking Fee," the booking fee is subtracted from the total price. The remaining balance is set as `balanceDue`.

2. **Full Payment:**

   - If the user selects "Full Payment," a 2% discount is applied to the `finalPrice`.

3. **Cash on Delivery (COD):**
   - If the user selects COD, no discount or additional fee is applied, and the full `finalPrice` is set as `codAmount`.

### Testing with Postman:

1. **Create Order with "Booking Fee":**

   - Use Postman to create an order with `paymentMethod` set to `"Booking Fee"` and observe that the amount returned is the `finalPrice` minus the booking fee.

2. **Create Order with "Full Payment":**

   - Use Postman to create an order with `paymentMethod` set to `"Full Payment"` and ensure that the `finalPrice` is 2% less than the original `totalPrice`.

3. **Create Order with "COD":**
   - Use Postman to create an order with `paymentMethod` set to `"COD"` and verify that the amount returned is the full `finalPrice`.

This implementation adheres to your specified logic and should return the correct amount based on the selected payment method without converting to paise or multiplying by `100`.
