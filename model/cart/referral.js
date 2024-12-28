const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refereeEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
