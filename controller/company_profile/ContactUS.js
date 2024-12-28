// const CompanyContactUs = require("../../model/About-PrivacyPolicy-TermsConditions/ContactUS");

const CompanyContactUs = require("../../model/company_profile/ContactUs");

// const CompanyContactUs = require("../../model/About-PrivacyPolicy-TermsConditions/");

// Create a new company contact record
exports.createCompanyContact = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const newContact = new CompanyContactUs({ email, mobile });
    await newContact.save();
    res.status(201).json({ message: 'Company contact information created successfully', contact: newContact });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all company contacts
exports.getAllCompanyContacts = async (req, res) => {
  try {
    const contacts = await CompanyContactUs.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single company contact by ID
exports.getCompanyContactById = async (req, res) => {
  try {
    const contact = await CompanyContactUs.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Company contact information not found' });
    res.status(200).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a company contact by ID
exports.updateCompanyContactById = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const contact = await CompanyContactUs.findByIdAndUpdate(
      req.params.id,
      { email, mobile },
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ message: 'Company contact information not found' });
    res.status(200).json({ message: 'Company contact information updated successfully', contact });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a company contact by ID
exports.deleteCompanyContactById = async (req, res) => {
  try {
    const contact = await CompanyContactUs.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Company contact information not found' });
    res.status(200).json({ message: 'Company contact information deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
