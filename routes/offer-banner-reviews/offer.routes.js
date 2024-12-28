const express = require("express");
const {
 createOffer,
 getOffers,
 getOfferById,
 updateOffer,
 deleteOffer,
} = require("../../controller/offer-banner-reviews-testimonials/offer.controller");

const offerRoutes = express.Router();

offerRoutes.post("/offers", createOffer);
offerRoutes.get("/offers", getOffers);
offerRoutes.get("/offers/:id", getOfferById);
offerRoutes.put("/offers/:id", updateOffer);
offerRoutes.delete("/offers/:id", deleteOffer);

module.exports = offerRoutes;
