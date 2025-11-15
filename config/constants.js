module.exports = {
    // CPU Monitoring (read from .env or use defaults)
    CPU_THRESHOLD: parseInt(process.env.CPU_THRESHOLD) || 70,
    CPU_CHECK_INTERVAL: parseInt(process.env.CPU_CHECK_INTERVAL) || 30000,

    // Scheduler
    SCHEDULER_CRON: process.env.SCHEDULER_CRON || '* * * * *',

    // File upload
    ALLOWED_FILE_TYPES: ['.xlsx', '.xls', '.csv'],
    UPLOADS_DIR: 'uploads',

    // Message statuses
    MESSAGE_STATUS: {
        PENDING: 'pending',
        PROCESSING: 'processing',
        COMPLETED: 'completed',
        FAILED: 'failed'
    }
};