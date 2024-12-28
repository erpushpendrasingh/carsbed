// const Policy = require('../models/Policy');

const RefundAndPolicy = require("../../model/company_profile/refundAndPolicy");

// const RefundAndPolicy = require("../../model/About-PrivacyPolicy-TermsConditions/refundAndPolicy");

// Create a new policy
exports.createPolicy = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newPolicy = new RefundAndPolicy({ title, description });
        await newPolicy.save();
        res.status(201).json({ message: 'Policy created successfully', policy: newPolicy });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all policies
exports.getAllPolicies = async (req, res) => {
    try {
        const policies = await RefundAndPolicy.find();
        res.status(200).json(policies);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get a single policy by ID
exports.getPolicyById = async (req, res) => {
    try {
        const policy = await RefundAndPolicy.findById(req.params.id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.status(200).json(policy);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a policy by ID
exports.updatePolicyById = async (req, res) => {
    try {
        const { title, description } = req.body;
        const policy = await RefundAndPolicy.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true, runValidators: true }
        );
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.status(200).json({ message: 'Policy updated successfully', policy });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a policy by ID
exports.deletePolicyById = async (req, res) => {
    try {
        const policy = await RefundAndPolicy.findByIdAndDelete(req.params.id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.status(200).json({ message: 'Policy deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
