const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists (safe for concurrent runs)
const uploadsDir = path.join(__dirname, '..', 'uploads');
try {
    fs.mkdirSync(uploadsDir, { recursive: true });
} catch (err) {
    // If this fails, multer will error later; log for visibility
    console.error('Failed to ensure uploads directory exists:', err && err.message ? err.message : err);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Only Excel and CSV files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = upload;