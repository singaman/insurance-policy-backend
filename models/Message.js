const mongoose = require('mongoose');

const scheduledMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    scheduledFor: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    completedAt: {
        type: Date
    },
    error: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient querying
scheduledMessageSchema.index({ scheduledFor: 1, status: 1 });

module.exports = mongoose.model('ScheduledMessage', scheduledMessageSchema);