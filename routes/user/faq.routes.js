// routes/faqRoutes.js
const express = require("express");
const {
 createFAQ,
 getFAQs,
 getFAQById,
 updateFAQ,
 deleteFAQ,
} = require("../../controller/userControllers/faq.controller");
const faqRoutes = express.Router();

faqRoutes.post("/faqs", createFAQ);
faqRoutes.get("/faqs", getFAQs);
faqRoutes.get("/faqs/:id", getFAQById);
faqRoutes.put("/faqs/:id", updateFAQ);
faqRoutes.delete("/faqs/:id", deleteFAQ);

module.exports = faqRoutes;
