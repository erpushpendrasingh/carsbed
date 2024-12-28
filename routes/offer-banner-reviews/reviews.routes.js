const express = require("express");
const reviewRoutes = express.Router();

const upload = require("../../middleware/upload");
const {
 getReviews,
 createReview,
 updateReview,
 deleteReview,
} = require("../../controller/offer-banner-reviews-testimonials/review.controller");

reviewRoutes.get("/", getReviews);
reviewRoutes.post("/", upload.array("images", 5), createReview);
reviewRoutes.put("/:id", upload.array("images", 5), updateReview);
reviewRoutes.delete("/:id", deleteReview);

module.exports = reviewRoutes;
