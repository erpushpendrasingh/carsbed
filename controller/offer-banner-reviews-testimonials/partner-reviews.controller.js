const PartnerReview = require("../../model/offer-banner-reviews-testimonials/partner-reviews.model");

const getPartnerReviews = async (req, res) => {
 try {
  const reviews = await PartnerReview.find();
  res.json(reviews);
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

const createPartnerReview = async (req, res) => {
 const { name, rating, review, description } = req.body;
 const images = req.files.map((file) => file.location);

 const newReview = new PartnerReview({
  name,
  rating,
  review,
  description,
  images,
 });

 try {
  const savedReview = await newReview.save();
  res.status(201).json(savedReview);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const updatePartnerReview = async (req, res) => {
 try {
  const review = await PartnerReview.findById(req.params.id);
  if (!review) {
   return res.status(404).json({ message: "Review not found" });
  }

  Object.assign(review, req.body);
  if (req.files) {
   review.images = req.files.map((file) => file.location);
  }

  const updatedReview = await review.save();
  res.json(updatedReview);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

const deletePartnerReview = async (req, res) => {
 try {
  const { id } = req.params;
  const review = await PartnerReview.findById(id);

  if (!review) {
   return res.status(404).json({ message: "Review not found" });
  }

  await review.deleteOne();
  res.status(204).json({ message: "Review deleted successfully" });
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

module.exports = {
 getPartnerReviews,
 createPartnerReview,
 updatePartnerReview,
 deletePartnerReview,
};
