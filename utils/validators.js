const { StatusCodes } = require('http-status-codes');

/**
 * Validate scheduled message request body
 */
const validateScheduledMessage = (body) => {
    const { message, day, time } = body || {};

    if (!message || !day || !time) {
        return { valid: false, error: 'message, day, and time are required' };
    }

    const scheduledDateTime = new Date(`${day}T${time}`);
    if (isNaN(scheduledDateTime.getTime())) {
        return { valid: false, error: 'Invalid date or time format (use YYYY-MM-DD and HH:MM:SS)' };
    }

    return { valid: true, data: { message, day, time, scheduledDateTime } };
};

/**
 * Validate file upload
 */
const validateFileUpload = (file) => {
    if (!file) {
        return { valid: false, error: 'No file uploaded' };
    }
    return { valid: true, data: file };
};

/**
 * Validate local file path
 */
const validateLocalFilePath = (filePath) => {
    const fs = require('fs');
    const path = require('path');

    if (!filePath) {
        return { valid: false, error: 'filePath is required in JSON body or set FILE_PATH in .env' };
    }

    if (!fs.existsSync(filePath)) {
        return { valid: false, error: `File not found at path: ${filePath}` };
    }

    const ext = path.extname(filePath).toLowerCase();
    const allowed = ['.xlsx', '.xls', '.csv'];
    if (!allowed.includes(ext)) {
        return { valid: false, error: 'Only Excel and CSV files are allowed' };
    }

    return { valid: true, data: filePath };
};

module.exports = { validateScheduledMessage, validateFileUpload, validateLocalFilePath };