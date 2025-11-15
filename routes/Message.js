const express = require('express');
const router = express.Router();
const { createMessage, getMessages } = require('../controllers/MessageController');

// POST: Create a scheduled message
router.post('/messages', createMessage);

// GET: List all scheduled messages
router.get('/messages', getMessages);

module.exports = router;