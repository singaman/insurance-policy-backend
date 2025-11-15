const express = require('express');
const router = express.Router();
const { searchByUsername, getAggregatedPolicies } = require('../controllers/policySearch');

// Add search by username
router.get('/search', searchByUsername);

// Aggregated policies grouped by user
router.get('/aggregated', getAggregatedPolicies);

module.exports = router;