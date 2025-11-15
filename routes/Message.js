const express = require('express');
const router = express.Router();
const { createScheduledMessage, getScheduledMessages } = require('../controllers/scheduledController');

// POST: Create a scheduled message
router.post('/messages', createScheduledMessage);

// GET: List all scheduled messages
router.get('/messages', getScheduledMessages);

module.exports = router;