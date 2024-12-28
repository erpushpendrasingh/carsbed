const TestimonialVideo = require("../../model/offer-banner-reviews-testimonials/testimonialVideoSchema.model");

exports.getTestimonialVideos = async (req, res) => {
 try {
  const testimonialVideos = await TestimonialVideo.find();
  res.json(testimonialVideos);
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

exports.createTestimonialVideo = async (req, res) => {
 const { title, rating, review, description } = req.body;
 const videoUrl = req.file.location;

 const newTestimonialVideo = new TestimonialVideo({
  title,

  description,
  videoUrl,
 });

 try {
  const savedTestimonialVideo = await newTestimonialVideo.save();
  res.status(201).json(savedTestimonialVideo);
 } catch (err) {
  res.status(400).json({ message: err.message });
 }
};

exports.updateTestimonialVideo = async (req, res) => {
 try {
  const { title, description } = req.body;
  const file = req.file;

  const updateData = { title, description };
  if (file) {
   updateData.videoUrl = file.location; // URL of the uploaded file
  }

  const testimonialVideo = await TestimonialVideo.findByIdAndUpdate(
   req.params.id,
   updateData,
   {
    new: true,
    runValidators: true,
   }
  );

  if (!testimonialVideo) {
   return res
    .status(404)
    .json({ success: false, message: "Testimonial Video not found" });
  }

  res.status(200).json({ success: true, data: testimonialVideo });
 } catch (error) {
  console.error("Error updating testimonial video:", error);
  res
   .status(500)
   .json({ success: false, message: "Failed to update testimonial video" });
 }
};

// controller/offer-banner-reviews-testimonials/testimonialVideo.controller.js
exports.deleteTestimonialVideo = async (req, res) => {
 try {
  const testimonialVideo = await TestimonialVideo.findByIdAndDelete(
   req.params.id
  );

  if (!testimonialVideo) {
   return res.status(404).json({ success: false, error: "Video not found" });
  }

  res.status(200).json({ success: true, data: {} });
 } catch (error) {
  console.error("Error deleting Video:", error);
  res.status(500).json({ success: false, error: "Failed to delete Video" });
 }
};
