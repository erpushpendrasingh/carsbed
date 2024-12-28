const Wallet = require("../../model/refer-coupon-wallet/wallet.model");
const NewUser = require("../../model/auth/user");

// Get user's wallet balance
const getWalletBalance = async (req, res) => {
 const { userId } = req.params;

 try {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
   return res.status(404).json({ message: "Wallet not found" });
  }

  res.status(200).json(wallet);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

// Add a transaction to the user's wallet (e.g., cashback, referral bonus)
const addTransaction = async (req, res) => {
 const { userId } = req.params;
 const { amount, description } = req.body;

 try {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
   wallet = new Wallet({ userId, balance: 0 });
  }

  wallet.balance += amount;
  wallet.transactions.push({ amount, description });

  await wallet.save();
  res.status(200).json(wallet);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

// Admin: Deposit a welcome bonus into a user's wallet
const depositWelcomeBonus = async (req, res) => {
 const { userId, amount } = req.body;

 try {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
   wallet = new Wallet({ userId, balance: 0 });
  }

  const description = "Welcome Bonus";
  wallet.balance += amount;
  wallet.transactions.push({ amount, description });

  await wallet.save();
  res
   .status(200)
   .json({ success: true, message: "Welcome bonus deposited", wallet });
 } catch (err) {
  res.status(400).json({ success: false, message: err.message });
 }
};

// Automatically deposit referral coins when a user completes a purchase
const depositReferralCoins = async (referrerId, amount) => {
 try {
  let wallet = await Wallet.findOne({ userId: referrerId });
  if (!wallet) {
   wallet = new Wallet({ userId: referrerId, balance: 0 });
  }

  const description = "Referral Bonus";
  wallet.balance += amount;
  wallet.transactions.push({ amount, description });

  await wallet.save();
 } catch (err) {
  console.error("Error depositing referral coins:", err.message);
 }
};

// Function to handle complete purchase (Update as per your logic)
const completePurchase = async (req, res) => {
 const { userId, serviceId } = req.body;

 try {
  // Assuming purchase completion logic is here...

  // Check if the user was referred by someone
  const user = await NewUser.findById(userId);
  if (user.referredBy) {
   // Deposit referral bonus to the referrer's wallet
   await depositReferralCoins(user.referredBy, 100); // 100 coins as referral bonus
  }

  res.status(200).json({
   success: true,
   message: "Purchase completed, referral bonus awarded if applicable",
  });
 } catch (err) {
  res
   .status(500)
   .json({ success: false, message: "Failed to complete purchase" });
 }
};

module.exports = {
 getWalletBalance,
 addTransaction,
 depositWelcomeBonus,
 completePurchase,
};

// const Wallet = require("../../model/refer-coupon-wallet/wallet.model");

// // Get user's wallet balance
// const getWalletBalance = async (req, res) => {
//  const { userId } = req.params;

//  try {
//   let wallet = await Wallet.findOne({ userId });
//   if (!wallet) {
//    return res.status(404).json({ message: "Wallet not found" });
//   }

//   res.status(200).json(wallet);
//  } catch (err) {
//   res.status(400).json({ message: err.message });
//  }
// };

// // Add a transaction to the user's wallet (e.g., cashback)
// const addTransaction = async (req, res) => {
//  const { userId } = req.params;
//  const { amount, description } = req.body;

//  try {
//   let wallet = await Wallet.findOne({ userId });
//   if (!wallet) {
//    wallet = new Wallet({ userId, balance: 0 });
//   }

//   wallet.balance += amount;
//   wallet.transactions.push({ amount, description });

//   await wallet.save();
//   res.status(200).json(wallet);
//  } catch (err) {
//   res.status(400).json({ message: err.message });
//  }
// };

// module.exports = {
//  getWalletBalance,
//  addTransaction,
// };
