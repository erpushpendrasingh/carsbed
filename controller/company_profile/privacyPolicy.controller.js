// const PrivacyPolicy = require("../../model/About-PrivacyPolicy-TermsConditions/privacyPolicy.model");

const PrivacyPolicy = require("../../model/company_profile/privacyPolicy.model");

const getPrivacyPolicies = async (req, res) => {
 try {
  const privacyPolicies = await PrivacyPolicy.find();
  res.json(privacyPolicies);
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

const createPrivacyPolicy = async (req, res) => {
 const { title, description } = req.body;

 const newPrivacyPolicy = new PrivacyPolicy({
  title,
  description,
 });

 try {
  const savedPrivacyPolicy = await newPrivacyPolicy.save();
  res.status(201).json(savedPrivacyPolicy);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const updatePrivacyPolicy = async (req, res) => {
 try {
  const privacyPolicy = await PrivacyPolicy.findById(req.params.id);
  if (!privacyPolicy) {
   return res.status(404).json({ message: "Privacy Policy not found" });
  }

  Object.assign(privacyPolicy, req.body);
  const updatedPrivacyPolicy = await privacyPolicy.save();
  res.json(updatedPrivacyPolicy);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const deletePrivacyPolicy = async (req, res) => {
 try {
  const privacyPolicy = await PrivacyPolicy.findById(req.params.id);
  if (!privacyPolicy) {
   return res.status(404).json({ message: "Privacy Policy not found" });
  }

  await privacyPolicy.deleteOne();
  res.status(204).json({ message: "Privacy Policy deleted successfully" });
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

module.exports = {
 getPrivacyPolicies,
 createPrivacyPolicy,
 updatePrivacyPolicy,
 deletePrivacyPolicy,
};
