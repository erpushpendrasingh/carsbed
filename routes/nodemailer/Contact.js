const nodemailer = require("nodemailer");
const express = require("express");
const { ContactsModel } = require("../../model/nodemailer/Contact");
const ContactRouter = express.Router();

const transporter = nodemailer.createTransport({
 secure: true,
 host: "smtp.gmail.com",
 port: 465,
 auth: {
  user: "bankingfilelogin@gmail.com",
  pass: "vrwy xvsq cpyv kajt",
 },
});

ContactRouter.post("/contact", async (req, res) => {
 const { name, email, mobile, description } = req.body;
 console.log(req.body);

 const mailOptionsMain = {
  from: "bankingfilelogin@gmail.com",
  to: "bankingfilelogin@gmail.com",
  subject: "Contact Form Submission",
  text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nDescription: ${description}`,
 };

 const mailOptionsCc = {
  from: "bankingfilelogin@gmail.com",
  to: email,
  subject: "Thank You for Contacting Us",
  text: `Dear ${name},\n\nThank you for contacting us. We have received your details as follows:\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nDescription: ${description}\n\nWe will get back to you shortly.\n\nBest Regards,\nCar Expert Team`,
 };

 try {
  await transporter.sendMail(mailOptionsMain);

  // await transporter.sendMail(mailOptionsCc);

  const contact = new ContactsModel({
   name,
   email,
   mobile,
   description,
  });
  await contact.save();

  res.status(200).json({ message: "Emails sent successfully", contact });
 } catch (error) {
  console.error("Error occurred:", error);
  res.status(500).json({ error: "Internal Server Error" });
 }
});

module.exports = ContactRouter;
