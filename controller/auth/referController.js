const NewUser = require("../../model/auth/user");

// Complete purchase and reward referrer
exports.completePurchase = async (req, res) => {
 try {
  const { userId, serviceId } = req.body;

  const user = await NewUser.findById(userId);
  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  // Simulate service purchase completion
  // Normally you'd have a service model and more logic here...

  // Check if the user was referred
  if (user.referredBy) {
   const referrer = await NewUser.findById(user.referredBy);
   if (referrer) {
    referrer.coins += 100; // Add 100 coins to the referrer's account
    await referrer.save();
   }
  }

  res.status(200).json({
   success: true,
   message: "Purchase completed successfully, referrer rewarded if applicable",
  });
 } catch (error) {
  console.error("Error completing purchase:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to complete purchase" });
 }
};

// Admin: Add coins to a user's account
exports.addCoinsToUser = async (req, res) => {
 try {
  const { userId, coins } = req.body;

  const user = await NewUser.findById(userId);
  if (!user) {
   return res.status(404).json({ success: false, error: "User not found" });
  }

  user.coins += coins;
  await user.save();

  res.status(200).json({
   success: true,
   message: `${coins} coins added successfully to user`,
   user,
  });
 } catch (error) {
  console.error("Error adding coins to user:", error);
  res
   .status(500)
   .json({ success: false, error: "Failed to add coins to user" });
 }
};
