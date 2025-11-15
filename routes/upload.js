const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadFile, uploadLocal } = require('../controllers/uploadController');

// Regular multipart file upload
router.post('/', upload.single('file'), uploadFile);

// Local-path upload: POST /api/upload/local with JSON { filePath }
router.post('/local', express.json(), uploadLocal);

module.exports = router;