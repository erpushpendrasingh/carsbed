const express = require("express");
const partnerReviewRoutes = express.Router();

const upload = require("../../middleware/upload");
const {
 getPartnerReviews,
 createPartnerReview,
 updatePartnerReview,
 deletePartnerReview,
} = require("../../controller/offer-banner-reviews-testimonials/partner-reviews.controller");
// const {
//  getPartnerReviews,
//  createPartnerReview,
//  updatePartnerReview,
//  deletePartnerReview,
// } = require("../../controllers/partner-reviews.controller");

partnerReviewRoutes.get("/", getPartnerReviews);
partnerReviewRoutes.post("/", upload.array("images", 5), createPartnerReview);
partnerReviewRoutes.put("/:id", upload.array("images", 5), updatePartnerReview);
partnerReviewRoutes.delete("/:id", deletePartnerReview);

module.exports = partnerReviewRoutes;
