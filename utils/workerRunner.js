const { Worker } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const { StatusCodes } = require('http-status-codes');

/**
 * Spawn a worker thread to process a file.
 * @param {string} filePath - path to file to process
 * @param {object} res - express response object
 */
const spawnFileWorker = (filePath, res) => {
	const worker = new Worker(path.join(__dirname, '../workers/fileProcessor.js'), {
		workerData: { filePath }
	});

	const cleanAndRespond = (success, payload) => {
		// best-effort file cleanup
		try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

		if (success) {
			return res.status(StatusCodes.OK).json({
				success: true,
				message: '✅ File processed successfully',
				data: payload
			});
		} else {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: '❌ File processing failed',
				error: payload
			});
		}
	};

	worker.on('message', (message) => {
		if (message && message.success) {
			cleanAndRespond(true, message.data);
		} else {
			cleanAndRespond(false, message?.error || 'Unknown error');
		}
	});

	worker.on('error', (error) => {
		console.error('🚨 Worker error:', error);
		cleanAndRespond(false, error.message || 'Worker crashed');
	});

	worker.on('exit', (code) => {
		if (code !== 0) console.warn(`⚠️  Worker exited with code ${code}`);
	});
};

module.exports = { spawnFileWorker };
