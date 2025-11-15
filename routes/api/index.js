const express = require('express');
const router = express.Router();

// mount existing route modules under a single API surface
router.use('/upload', require('../upload'));
router.use('/policies', require('../policies'));
router.use('/Message', require('../Message'));

module.exports = router;
