const nodemailer = require("nodemailer");
const express = require("express");
const { BookingModel } = require("../../model/nodemailer/CarBookingService");
const BookingRouter = express.Router();
const moment = require("moment"); // To format the date

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
 secure: true,
 host: "smtp.gmail.com",
 port: 465,
 auth: {
  user: "bankingfilelogin@gmail.com",
  pass: "vrwy xvsq cpyv kajt",
 },
});

// Define the booking route
BookingRouter.post("/book", async (req, res) => {
 const { name, email, mobile, description, bookingDate, billingDetails } =
  req.body;

 // Format the booking date using moment.js
 const formattedDate = moment(bookingDate).format("MMMM Do YYYY, h:mm A");

 // HTML Email template for user confirmation
 const userEmailTemplate = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
      <div style="text-align: center; background-color: #f5f5f5; padding: 20px;">
        <img src="https://yourlogo.com/logo.png" alt="Company Logo" style="width: 150px;">
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

  // Save booking details in the database
  const booking = new BookingModel({
   name,
   email,
   mobile,
   description,
   bookingDate,
   billingDetails,
  });
  await booking.save();

  res.status(200).json({ message: "Emails sent successfully" });
 } catch (error) {
  console.error("Error sending email:", error);
  res.status(500).json({ message: "Error sending emails" });
 }
});

module.exports = BookingRouter;

// const nodemailer = require("nodemailer");
// const express = require("express");
// const { BookingModel } = require("../../model/nodemailer/CarBookingService");
// const BookingRouter = express.Router();

// const transporter = nodemailer.createTransport({
//  secure: true,
//  host: "smtp.gmail.com",
//  port: 465,
//  auth: {
//   user: "bankingfilelogin@gmail.com",
//   pass: "vrwy xvsq cpyv kajt",
//  },
// });

// BookingRouter.post("/book", async (req, res) => {
//  const { name, email, mobile, description, bookingDate, billingDetails } =
//   req.body;

//  // Updated email contents based on the new structure
//  const mailOptionsAdmin = {
//   from: "bankingfilelogin@gmail.com",
//   to: "bankingfilelogin@gmail.com",
//   subject: "New Booking Request",
//   text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nDescription: ${description}\nBooking Date: ${bookingDate}\nBilling Details: ${billingDetails}`,
//  };

//  const mailOptionsUser = {
//   from: "bankingfilelogin@gmail.com",
//   to: email,
//   subject: "Booking Confirmation",
//   text: `Dear ${name},\n\nThank you for your booking. We have received the following details:\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nDescription: ${description}\nBooking Date: ${bookingDate}\nBilling Details: ${billingDetails}\n\nWe will contact you shortly.\n\nBest Regards,\nCar Expert Team`,
//  };

//  try {
//   // Send emails to admin and user
//   await transporter.sendMail(mailOptionsAdmin);
//   await transporter.sendMail(mailOptionsUser);

//   // Save booking details in the database
//   const booking = new BookingModel({
//    name,
//    email,
//    mobile,
//    description,
//    bookingDate,
//    billingDetails,
//   });
//   await booking.save();

//   // Respond with success message
//   res
//    .status(200)
//    .json({ message: "Booking request sent successfully", booking });
//  } catch (error) {
//   console.error(error);
//   res.status(500).json({ error: "Internal Server Error" });
//  }
// });

// module.exports = BookingRouter;

// // const nodemailer = require("nodemailer");
// // const express = require("express");
// // const { BookingModel } = require("../../model/nodemailer/CarBookingService");
// // const BookingRouter = express.Router();

// // const transporter = nodemailer.createTransport({
// //  secure: true,
// //  host: "smtp.gmail.com",
// //  port: 465,
// //  auth: {
// //   user: "bankingfilelogin@gmail.com",
// //   pass: "vrwy xvsq cpyv kajt",
// //  },
// // });

// // BookingRouter.post("/book", async (req, res) => {
// //  const {
// //   Service,
// //   carModel,
// //   Price,
// //   name,
// //   mobile,
// //   email,
// //   address,
// //   city,
// //   date,
// //   time,
// //  } = req.body;

// //  const mailOptionsAdmin = {
// //   from: "bankingfilelogin@gmail.com",
// //   to: "bankingfilelogin@gmail.com",
// //   subject: "New Booking Request",
// //   text: `Service: ${Service}\nPrice: ${Price}\nName: ${name}\nMobile: ${mobile}\nCar Model: ${carModel}\nEmail: ${email}\nAddress: ${address}\nCity: ${city}\nDate: ${date}\nTime: ${time}`,
// //  };

// //  const mailOptionsUser = {
// //   from: "bankingfilelogin@gmail.com",
// //   to: email,
// //   subject: "Booking Confirmation",
// //   text: `Dear ${name},\n\nThank you for your booking. We have received the following details:\n\nService: ${Service}\nPrice: ${Price}\nName: ${name}\nMobile: ${mobile}\nCar Model: ${carModel}\nEmail: ${email}\nAddress: ${address}\nCity: ${city}\nDate: ${date}\nTime: ${time}\n\nWe will contact you shortly.\n\nBest Regards,\nCar Expert Team`,
// //  };

// //  try {
// //   await transporter.sendMail(mailOptionsAdmin);
// //   await transporter.sendMail(mailOptionsUser);

// //   const booking = new BookingModel({
// //    Service,
// //    carModel,
// //    Price,
// //    name,
// //    mobile,
// //    email,
// //    address,
// //    city,
// //    date,
// //    time,
// //   });
// //   await booking.save();

// //   res
// //    .status(200)
// //    .json({ message: "Booking request sent successfully", booking });
// //  } catch (error) {
// //   console.error(error);
// //   res.status(500).json({ error: "Internal Server Error" });
// //  }
// // });

// // module.exports = BookingRouter;
