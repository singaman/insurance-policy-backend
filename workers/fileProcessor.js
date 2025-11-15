const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Only execute worker logic when running inside a worker thread
if (parentPort) {
    // Connect to MongoDB (best-effort)
    mongoose.connect(process.env.MONGODB_URI).catch(err => {
        console.error('Worker MongoDB connect error:', err && err.message ? err.message : err);
    });

    const { parseCSV } = require('./parsers/csvParser');
    const { parseExcel } = require('./parsers/xlsxParser');
    const { processRecords } = require('../workers/recordProcessor');

    async function processFile(filePath) {
        const fileExtension = path.extname(filePath).toLowerCase();
        let records = [];

        if (fileExtension === '.csv') {
            records = await parseCSV(filePath);
        } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
            records = await parseExcel(filePath);
        } else {
            throw new Error('Unsupported file format: ' + fileExtension);
        }

        const result = await processRecords(records);
        return result;
    }

    (async () => {
        try {
            const result = await processFile(workerData.filePath);

            // Clean up uploaded file
            try { fs.unlinkSync(workerData.filePath); } catch (e) { /* ignore */ }

            parentPort.postMessage({ success: true, data: result });
        } catch (error) {
            parentPort.postMessage({ success: false, error: error.message });
        } finally {
            mongoose.connection.close();
        }
    })();
}