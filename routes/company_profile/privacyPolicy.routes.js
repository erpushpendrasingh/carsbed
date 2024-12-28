const express = require("express");
const {
 getPrivacyPolicies,
 createPrivacyPolicy,
 updatePrivacyPolicy,
 deletePrivacyPolicy,
} = require("../../controller/company_profile/privacyPolicy.controller");
const privacyPolicyRoutes = express.Router();

privacyPolicyRoutes.get("/", getPrivacyPolicies);
privacyPolicyRoutes.post("/", createPrivacyPolicy);
privacyPolicyRoutes.put("/:id", updatePrivacyPolicy);
privacyPolicyRoutes.delete("/:id", deletePrivacyPolicy);

module.exports = privacyPolicyRoutes;
