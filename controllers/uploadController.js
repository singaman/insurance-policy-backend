const path = require('path');
const fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const { spawnFileWorker } = require('../utils/workerRunner');

const uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'No file uploaded'
			});
		}

		spawnFileWorker(req.file.path, res);
	} catch (error) {
		console.error('Upload error:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: 'Upload failed',
			error: error.message
		});
	}
};

const uploadLocal = async (req, res) => {
	try {
		const providedPath = (req.body && req.body.filePath) || process.env.FILE_PATH;

		if (!providedPath) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'filePath is required in JSON body or set FILE_PATH in .env'
			});
		}

		if (!fs.existsSync(providedPath)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: `File not found at path: ${providedPath}`
			});
		}

		const ext = path.extname(providedPath).toLowerCase();
		const allowed = ['.xlsx', '.xls', '.csv'];
		if (!allowed.includes(ext)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'Only Excel and CSV files are allowed'
			});
		}

		// Ensure uploads dir exists
		const uploadsDir = path.join(process.cwd(), 'uploads');
		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
		}

		const destName = 'file-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
		const destPath = path.join(uploadsDir, destName);

		await fs.promises.copyFile(providedPath, destPath);

		spawnFileWorker(destPath, res);

	} catch (error) {
		console.error('Upload-local error:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: 'Upload (local) failed',
			error: error.message
		});
	}
};

module.exports = { uploadFile, uploadLocal };