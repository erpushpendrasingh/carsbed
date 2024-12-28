const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const RefundAndPolicy = mongoose.model('Policy', policySchema);
module.exports = RefundAndPolicy;
