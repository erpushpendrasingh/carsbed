const express = require('express');
const { getReferrals, createReferral } = require('../../controller/cart/referral.controller');
// const { getReferrals, createReferral } = require('../controllers/referral.controller');

const referralRoutes = express.Router();

referralRoutes.get('/',  getReferrals);
referralRoutes.post('/create',  createReferral);

module.exports = referralRoutes;
