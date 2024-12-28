const express = require("express");
const {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  updatePolicyById,
  deletePolicyById,
} = require("../../controller/company_profile/refundAndPolicy");
 
const refundAndPolicyRouter = express.Router();

// Create a new policy
refundAndPolicyRouter.post("/policies", createPolicy);

// Get all policies
refundAndPolicyRouter.get("/policies", getAllPolicies);

// Get a single policy by ID
refundAndPolicyRouter.get("/policies/:id", getPolicyById);

// Update a policy by ID
refundAndPolicyRouter.put("/policies/:id", updatePolicyById);

// Delete a policy by ID
refundAndPolicyRouter.delete("/policies/:id", deletePolicyById);

module.exports = refundAndPolicyRouter;
