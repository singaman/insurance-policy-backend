module.exports = {
	// MongoDB collection names (follow Mongoose pluralization)
	COLLECTIONS: {
		USERS: 'users',
		POLICIES: 'policies',
		POLICY_CATEGORIES: 'policycategories',
		POLICY_CARRIERS: 'policycarriers',
		AGENTS: 'agents',
		ACCOUNTS: 'accounts',
		MESSAGES: 'Messages'
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

};
