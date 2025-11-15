const express = require('express');
const router = express.Router();

const uploadRoutes = require('./upload');
const policyRoutes = require('./policies');
const MessageRoutes = require('./Message');

router.use('/upload', uploadRoutes);
router.use('/policies', policyRoutes);
router.use('/Message', MessageRoutes);

module.exports = router;