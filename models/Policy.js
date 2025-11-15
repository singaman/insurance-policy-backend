const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policyNumber: {
        type: String,
        required: true,
        unique: true
    },
    policyStartDate: {
        type: Date,
        required: true
    },
    policyEndDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PolicyCategory',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PolicyCarrier',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Policy', policySchema);