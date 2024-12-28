const mongoose = require('mongoose');

const companyContactUsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please fill a valid mobile number'],
  },
}, { timestamps: true });

const CompanyContactUs = mongoose.model('CompanyContactUs', companyContactUsSchema);

module.exports = CompanyContactUs;
