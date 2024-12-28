const Referral = require('../models/referral.model');

const getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrerId: req.user.id });
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReferral = async (req, res) => {
  const { refereeEmail } = req.body;
  try {
    const newReferral = new Referral({
      referrerId: req.user.id,
      refereeEmail,
    });

    await newReferral.save();
    res.status(201).json(newReferral);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getReferrals,
  createReferral,
};
