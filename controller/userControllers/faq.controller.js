// controllers/faqController.js

const FAQ = require("../../model/user/faq.model");

// Create a new FAQ
exports.createFAQ = async (req, res) => {
 try {
  const { question, answer, category } = req.body;
  const newFAQ = new FAQ({ question, answer, category });
  await newFAQ.save();
  res.status(201).json(newFAQ);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

// Get all FAQs
exports.getFAQs = async (req, res) => {
 try {
  const faqs = await FAQ.find();
  res.status(200).json(faqs);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

// Get a single FAQ by ID
exports.getFAQById = async (req, res) => {
 try {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) return res.status(404).json({ message: "FAQ not found" });
  res.status(200).json(faq);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

// Update an FAQ by ID
exports.updateFAQ = async (req, res) => {
 try {
  const { question, answer, category } = req.body;
  const updatedFAQ = await FAQ.findByIdAndUpdate(
   req.params.id,
   { question, answer, category },
   { new: true, runValidators: true }
  );
  if (!updatedFAQ) return res.status(404).json({ message: "FAQ not found" });
  res.status(200).json(updatedFAQ);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

// Delete an FAQ by ID
exports.deleteFAQ = async (req, res) => {
 try {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) return res.status(404).json({ message: "FAQ not found" });

  await FAQ.findByIdAndDelete(req.params.id);
  res.status(204).json({ message: "FAQ deleted" });
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};
