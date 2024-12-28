const nodemailer = require("nodemailer");
const express = require("express");
const { FranchisesModel } = require("../../model/nodemailer/franchise");
const FranchiseRouter = express.Router();

const transporter = nodemailer.createTransport({
 secure: true,
 host: "smtp.gmail.com",
 port: 465,
 auth: {
  user: "bankingfilelogin@gmail.com",
  pass: "vrwy xvsq cpyv kajt",
 },
});

FranchiseRouter.post("/franchise", async (req, res) => {
 const { name, email, whatsappNumber, state, city, budget, interest } =
  req.body;
 console.log(req.body);

 const mailOptionsMain = {
  from: "bankingfilelogin@gmail.com",
  to: "bankingfilelogin@gmail.com",
  subject: "Franchise Application Form Submission",
  text: `Name: ${name}\nEmail: ${email}\nWhatsApp Number: ${whatsappNumber}\nState: ${state}\nCity: ${city}\nBudget: ${budget}\nInterest: ${interest}`,
 };

 // const mailOptionsCc = {
 //   from: "bankingfilelogin@gmail.com",
 //   to: email,
 //   subject: "Thank You for Franchise Application Form",
 //   text: `Dear ${name},\n\nThank you for contacting us. We have received your details as follows:\n\nName: ${name}\nEmail: ${email}\nWhatsApp Number: ${whatsappNumber}\nState: ${state}\nCity: ${city}\nBudget: ${budget}\nInterest: ${interest}\n\nWe will get back to you shortly.\n\nBest Regards,\nCar Expert Team`,
 // };

 try {
  await transporter.sendMail(mailOptionsMain);

  // await transporter.sendMail(mailOptionsCc);

  const franchise = new FranchisesModel({
   name,
   email,
   whatsappNumber,
   state,
   city,
   budget,
   interest,
  });
  await franchise.save();

  res.status(200).json({ message: "Emails sent successfully", franchise });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
 }
});

module.exports = FranchiseRouter;
