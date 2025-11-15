/**
 * Log incoming requests with emoji prefix for visibility
 */
const requestLogger = (req, res, next) => {
	const start = Date.now();
	const originalSend = res.send;

	res.send = function (data) {
		const duration = Date.now() - start;
		const statusColor = res.statusCode < 400 ? '✅' : res.statusCode < 500 ? '⚠️ ' : '❌';
		console.log(`${statusColor} ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
		return originalSend.call(this, data);
	};

	next();
};

module.exports = requestLogger;
