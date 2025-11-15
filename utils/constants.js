module.exports = {
	// MongoDB collection names (follow Mongoose pluralization)
	COLLECTIONS: {
		USERS: 'users',
		POLICIES: 'policies',
		POLICY_CATEGORIES: 'policycategories',
		POLICY_CARRIERS: 'policycarriers',
		AGENTS: 'agents',
		ACCOUNTS: 'accounts',
		SCHEDULED_MESSAGES: 'scheduledmessages'
	},

	// Message statuses
	MESSAGE_STATUS: {
		PENDING: 'pending',
		PROCESSING: 'processing',
		COMPLETED: 'completed',
		FAILED: 'failed'
	},

	// File upload
	ALLOWED_FILE_TYPES: ['.xlsx', '.xls', '.csv'],
	UPLOADS_DIR: 'uploads',

	// Cron schedule (from services/scheduler.js)
	SCHEDULER_CRON: '* * * * *' // every minute
};
