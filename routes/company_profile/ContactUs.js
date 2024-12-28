const express = require('express');
const { createCompanyContact, getAllCompanyContacts, getCompanyContactById, updateCompanyContactById, deleteCompanyContactById } = require('../../controller/company_profile/ContactUS');
 

const router = express.Router();

// Route to create a new company contact record
router.post('/companycontact', createCompanyContact);

// Route to get all company contacts
router.get('/companycontacts', getAllCompanyContacts);

// Route to get a single company contact by ID
router.get('/companycontact/:id', getCompanyContactById);

// Route to update a company contact by ID
router.put('/companycontact/:id', updateCompanyContactById);

// Route to delete a company contact by ID
router.delete('/companycontact/:id', deleteCompanyContactById);

module.exports = router;
