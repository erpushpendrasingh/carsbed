const express = require("express");
const {
 getTermsConditions,
 createTermsConditions,
 updateTermsConditions,
 deleteTermsConditions,
} = require("../../controller/company_profile/termsConditions.controller");
const termsConditionsRoutes = express.Router();

termsConditionsRoutes.get("/", getTermsConditions);
termsConditionsRoutes.post("/", createTermsConditions);
termsConditionsRoutes.put("/:id", updateTermsConditions);
termsConditionsRoutes.delete("/:id", deleteTermsConditions);

module.exports = termsConditionsRoutes;
