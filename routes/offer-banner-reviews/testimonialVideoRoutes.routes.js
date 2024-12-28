const express = require("express");
const testimonialVideoRouter = express.Router();
const videoUpload = require("../../uploads/videoUpload");
const {
 getTestimonialVideos,
 createTestimonialVideo,
 updateTestimonialVideo,
 deleteTestimonialVideo,
} = require("../../controller/offer-banner-reviews-testimonials/testimonialVideo.controller");
// const {
//  getTestimonialVideos,

// } = require("../../controller/offer-banner-reviews-controller/testimonialVideoController");

testimonialVideoRouter.get("/", getTestimonialVideos);
testimonialVideoRouter.post(
 "/",
 videoUpload.single("videoUrl"),
 createTestimonialVideo
);
testimonialVideoRouter.patch(
 "/update/:id",
 videoUpload.single("videoUrl"),
 updateTestimonialVideo
);
testimonialVideoRouter.delete("/delete/:id", deleteTestimonialVideo);

module.exports = testimonialVideoRouter;
