const express = require('express');
const router = express.Router();

const uploadRoutes = require('./upload');
const policyRoutes = require('./policies');
const scheduledRoutes = require('./scheduled');

router.use('/upload', uploadRoutes);
router.use('/policies', policyRoutes);
router.use('/scheduled', scheduledRoutes);

module.exports = router;