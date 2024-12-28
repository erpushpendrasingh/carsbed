// const TermsConditions = require("../../model/About-PrivacyPolicy-TermsConditions/termsConditions.model");

const TermsConditions = require("../../model/company_profile/termsConditions.model");

const getTermsConditions = async (req, res) => {
 try {
  const termsConditions = await TermsConditions.find();
  res.json(termsConditions);
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

const createTermsConditions = async (req, res) => {
 const { title, description } = req.body;

 const newTermsConditions = new TermsConditions({
  title,
  description,
 });

 try {
  const savedTermsConditions = await newTermsConditions.save();
  res.status(201).json(savedTermsConditions);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const updateTermsConditions = async (req, res) => {
 try {
  const termsConditions = await TermsConditions.findById(req.params.id);
  if (!termsConditions) {
   return res.status(404).json({ message: "Terms & Conditions not found" });
  }

  Object.assign(termsConditions, req.body);
  const updatedTermsConditions = await termsConditions.save();
  res.json(updatedTermsConditions);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const deleteTermsConditions = async (req, res) => {
 try {
  const termsConditions = await TermsConditions.findById(req.params.id);
  if (!termsConditions) {
   return res.status(404).json({ message: "Terms & Conditions not found" });
  }

  await termsConditions.deleteOne();
  res.status(204).json({ message: "Terms & Conditions deleted successfully" });
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

module.exports = {
 getTermsConditions,
 createTermsConditions,
 updateTermsConditions,
 deleteTermsConditions,
};
