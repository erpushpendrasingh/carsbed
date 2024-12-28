const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Vendor = require("../../model/user/vendor.model");

// Allowed emails for password reset
const allowedEmails = [
 "bankingfilelogin@gmail.com",
 "carexpert810@gmail.com",
 "ank0810@gmail.com",
];

// Nodemailer configuration
const transporter = nodemailer.createTransport({
 secure: true,
 host: "smtp.gmail.com",
 port: 465,
 auth: {
  user: "bankingfilelogin@gmail.com",
  pass: "vrwy xvsq cpyv kajt", // Use App Password for security
 },
});

// Forgot password function
const forgotPassword = async (req, res) => {
 const { email } = req.body;

 try {
  // Check if the email is allowed
  if (!allowedEmails.includes(email)) {
   return res.status(403).json({ message: "Not authorized to reset password" });
  }

  // Check if the user exists in the database
  const user = await Vendor.findOne({ email });
  if (!user) {
   return res
    .status(404)
    .json({ message: "User with this email does not exist" });
  }

  // Generate a random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and store in the database
  const resetTokenHash = crypto
   .createHash("sha256")
   .update(resetToken)
   .digest("hex");

  // Set token and expiration in the user's document (expiration is now 2 minutes)
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = Date.now() + 120000; // Token expires in 2 minutes
  await user.save();

  // Debugging logs
  console.log("Reset token generated and stored:", resetToken);
  console.log("Hashed token stored in DB:", resetTokenHash);
  console.log("Token expiration time (timestamp):", user.resetPasswordExpires);

  // Create a reset URL
  const resetUrl = `https://admin.carexpert.org.in/reset-password/${resetToken}`;

  // Send the reset email
  const mailOptions = {
   from: '"Support Team" <bankingfilelogin@gmail.com>',
   to: email,
   subject: "Password Reset Request",
   html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>This link will expire in 2 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: "Password reset email sent successfully" });
 } catch (error) {
  console.error("Error in forgotPassword:", error);
  res
   .status(500)
   .json({ message: "Error sending email", error: error.message });
 }
};

const resetPassword = async (req, res) => {
 const { token } = req.params; // Get the reset token from the URL
 const { password } = req.body; // Get the new password from the request body

 try {
  // Hash the reset token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find the user with the matching reset token and ensure the token is not expired
  const user = await Vendor.findOne({
   resetPasswordToken: hashedToken,
   resetPasswordExpires: { $gt: Date.now() }, // Ensure token is valid
  });

  // If the user is not found or the token is expired
  if (!user) {
   return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Hash the new password before saving it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Hashed new password before saving:", hashedPassword); // Log the new hashed password

  // Update the password and clear reset token fields directly in the database
  await Vendor.updateOne(
   { _id: user._id },
   {
    password: hashedPassword,
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
   }
  );

  // Send a success response
  res.status(200).json({ message: "Password reset successfully" });
 } catch (error) {
  // Handle errors and send an error response
  console.error("Error in password reset:", error);
  res
   .status(500)
   .json({ message: "Error resetting password", error: error.message });
 }
};

module.exports = { forgotPassword, resetPassword };
