const axios = require("axios");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
require("dotenv").config();
// Email Configuration
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
 secure: true,
 host: "smtp.gmail.com",
 port: 465,
 auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  // user: "bankingfilelogin@gmail.com",
  // pass: "vrwy xvsq cpyv kajt", // Replace with your real password or use environment variables
 },
});

// TEST

// // Payment Configuration (Test Credentials)
// const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
// const MERCHANT_ID = "PGTESTPAYUAT86";
// const MERCHANT_BASE_URL =
//  "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
// const MERCHANT_STATUS_URL =
//  "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";
// const redirectUrl = "http://localhost:3000/status";
// const successUrl = "http://localhost:5173/payment-success";
// const failureUrl = "http://localhost:5173/payment-failure";

// LIVE

const MERCHANT_KEY = "124308a4-8f38-4188-a017-e7f32705e6dd";
const MERCHANT_ID = "CAREXPERTONLINE";
const MERCHANT_BASE_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
const MERCHANT_STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status";
const redirectUrl = "https://www.carexpert.org.in/status";
const successUrl = "https://www.carexpert.org.in/payment-success";
const failureUrl = "https://www.carexpert.org.in/payment-failure";

// Temporary store to hold booking details until payment status is confirmed
let bookingDetailsStore = {};

// Helper function to send email notifications to both User and Admin

// Convert Rupees to Paise Helper Function
const convertRupeesToPaise = (rupees) => {
 if (typeof rupees !== "number" || isNaN(rupees)) {
  throw new Error("Invalid input: amount must be a valid number");
 }
 return Math.round(rupees * 100);
};

// Initiate Payment Function
const initiatePayment = async (req, res) => {
 try {
  const {
   amount,
   mobileNumber,
   name,
   email,
   description,
   bookingDate,
   billingDetails,
  } = req.body;

  const orderId = uuidv4(); // Unique transaction ID

  // Convert the amount to a number and then to paise
  const amountInRupees = Number(amount);
  if (isNaN(amountInRupees)) {
   throw new Error("Amount provided is not a valid number");
  }
  const amountInPaise = convertRupeesToPaise(amountInRupees);

  // Payment payload
  const paymentPayload = {
   merchantId: MERCHANT_ID,
   merchantUserId: name,
   mobileNumber: mobileNumber.replace(/\D/g, ""), // Ensure only digits are passed
   amount: amountInPaise, // Amount in paise (1 INR = 100 paise)
   merchantTransactionId: orderId,
   redirectUrl: `${redirectUrl}/?id=${orderId}`, // Ensure this matches the approved URL
   redirectMode: "POST",
   paymentInstrument: {
    type: "PAY_PAGE",
   },
  };

  // Log payload to verify the data being sent
  console.log("Request Data Sent to PhonePe: ", paymentPayload);

  // Base64 encoding the payload
  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString(
   "base64"
  );

  // Generate checksum
  const keyIndex = 1;
  const string = payload + "/pg/v1/pay" + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  // Payment request options
  const option = {
   method: "POST",
   url: MERCHANT_BASE_URL,
   headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-VERIFY": checksum,
   },
   data: {
    request: payload,
   },
   timeout: 5000, // 5 seconds timeout
  };

  // Save booking details to temporary store
  bookingDetailsStore[orderId] = {
   name,
   email,
   mobile: mobileNumber,
   description,
   bookingDate,
   billingDetails,
  };

  // Retry logic for transient errors
  for (let attempt = 1; attempt <= 3; attempt++) {
   try {
    const response = await axios.request(option);
    console.log(
     "Redirect URL:",
     response.data.data.instrumentResponse.redirectInfo.url
    );

    // After initiating the payment, send email notifications to user and admin
    await sendEmailNotifications({
     name,
     email,
     mobile: mobileNumber,
     description,
     bookingDate,
     billingDetails,
    });

    // Return the response with the payment URL
    return res.status(200).json({
     msg: "OK",
     url: response.data.data.instrumentResponse.redirectInfo.url,
    });
   } catch (error) {
    console.log(
     `Attempt ${attempt} failed.`,
     error.response ? error.response.data : error.message
    );
    if (attempt === 3) {
     return res.status(500).json({
      error: "Failed to initiate payment after 3 attempts",
      details: error.response ? error.response.data : error.message,
     });
    }
   }
  }
 } catch (error) {
  console.error("Payment initiation error:", error.message);
  res.status(500).json({
   success: false,
   message: "Payment initiation failed",
   error: error.message,
  });
 }
};

// Email Sending Function
const sendEmailNotifications = async (bookingDetails) => {
 const { name, email, mobile, description, bookingDate, billingDetails } =
  bookingDetails;

 // Format the booking date using moment.js
 const formattedDate = moment(bookingDate).format("MMMM Do YYYY, h:mm A");

 // HTML Email template for user confirmation
 const userEmailTemplate = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
      <div style="text-align: center; background-color: #f5f5f5; padding: 20px;">
        <h2 style="color: #4CAF50;">Namaskar ${name},</h2>
        <h4>Booking Confirmation</h4>
      </div>
      <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd;">
        <p>Thank you for your booking. We have received the following details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Mobile:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${mobile}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Booking Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Billing Details:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${JSON.stringify(
             billingDetails,
             null,
             2
            )}</td>
          </tr>
        </table>
        <p>We will contact you shortly.</p>
        <p style="color: #4CAF50;"><strong>Car Expert Team</strong></p>
      </div>
    </div>`;

 // HTML Email template for admin notification
 const adminEmailTemplate = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
      <div style="text-align: center; background-color: #f5f5f5; padding: 20px;">
        <h2>New Booking Request</h2>
      </div>
      <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd;">
        <p>New booking details are as follows:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Mobile:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${mobile}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Booking Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Description:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${description}</td>
          </tr>
        </table>
      </div>
    </div>`;

 try {
  // Send email to admin
  await transporter.sendMail({
   from: "bankingfilelogin@gmail.com",
   to: "bankingfilelogin@gmail.com",
   subject: "New Booking Request",
   html: adminEmailTemplate,
  });

  // Send email to user
  await transporter.sendMail({
   from: "bankingfilelogin@gmail.com",
   to: email,
   subject: "Booking Confirmation",
   html: userEmailTemplate,
  });

  console.log("Emails sent successfully");
 } catch (error) {
  console.error("Error sending email:", error);
 }
};

// Check Payment Status Function
// Check Payment Status Function
// const checkPaymentStatus = async (req, res) => {
//  const merchantTransactionId = req.query.id;

//  console.log("merchantTransactionId:", merchantTransactionId);

//  const keyIndex = 1;
//  const string =
//   `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
//  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//  const checksum = sha256 + "###" + keyIndex;

//  const option = {
//   method: "GET",
//   url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
//   headers: {
//    accept: "application/json",
//    "Content-Type": "application/json",
//    "X-VERIFY": checksum,
//    "X-MERCHANT-ID": MERCHANT_ID,
//   },
//   timeout: 5000, // 5 seconds timeout
//  };

//  try {
//   const response = await axios.request(option);
//   if (response.data.success === true) {
//    // Payment successful, send email notifications
//    const bookingDetails = bookingDetailsStore[merchantTransactionId];
//    if (bookingDetails) {
//     await sendEmailNotifications(bookingDetails);
//     // Remove booking details from store after sending email
//     delete bookingDetailsStore[merchantTransactionId];
//    }
//    return res.redirect(successUrl); // Redirect to PaymentSuccess page
//   } else {
//    return res.redirect(failureUrl); // Redirect to PaymentFailure page
//   }
//  } catch (error) {
//   console.log("Error in payment status check", error.message);
//   return res.status(500).json({
//    error: "Failed to check payment status",
//    details: error.message,
//   });
//  }
// };
const checkPaymentStatus = async (req, res) => {
 const merchantTransactionId = req.query.id;

 if (!merchantTransactionId) {
  return res.status(400).json({ error: "Transaction ID is required" });
 }

 console.log("merchantTransactionId:", merchantTransactionId);

 // Generate checksum for verification
 const keyIndex = 1;
 const string =
  `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
 console.log("string:", string);
 const sha256 = crypto.createHash("sha256").update(string).digest("hex");
 console.log("sha256:", sha256);
 const checksum = sha256 + "###" + keyIndex;
 console.log("checksum:", checksum);
 const option = {
  method: "GET",
  url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
  headers: {
   accept: "application/json",
   "Content-Type": "application/json",
   "X-VERIFY": checksum,
   "X-MERCHANT-ID": MERCHANT_ID,
  },
  timeout: 5000, // 5 seconds timeout
 };
 console.log("checksum:", checksum);
 try {
  // Make the request to the payment gateway
  const response = await axios.request(option);
  console.log("response:", response);
  // Check if payment was successful
  if (response.data.success === true) {
   const bookingDetails = bookingDetailsStore[merchantTransactionId];
   console.log("bookingDetails:", bookingDetails);
   if (bookingDetails) {
    // Send email notifications if booking details exist
    await sendEmailNotifications(bookingDetails);
    // Remove booking details from store after email is sent
    delete bookingDetailsStore[merchantTransactionId];
   }

   // Instead of redirecting, return a JSON response that the frontend can handle
   return res.json({
    success: true,
    message: "Payment successful",
    redirectUrl: successUrl,
   });
  } else {
   // Return a JSON response for payment failure
   return res.json({
    success: false,
    message: "Payment failed",
    redirectUrl: failureUrl,
   });
  }
 } catch (error) {
  // Handle the error gracefully and return a meaningful response
  console.log("Error in payment status check", error);

  // Return a detailed error response
  return res.status(500).json({
   error: "Failed to check payment status",
   details: error.message,
  });
 }
};
module.exports = { initiatePayment, checkPaymentStatus };
