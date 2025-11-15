const { StatusCodes } = require('http-status-codes');
const ScheduledMessage = require('../models/Message');

const createScheduledMessage = async (req, res, next) => {
    try {
        const { message, day, time } = req.body;

        if (!message || !day || !time) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'message, day, and time are required'
            });
        }

        // Combine day and time into a Date object
        const scheduledDateTime = new Date(`${day}T${time}`);
        
        if (isNaN(scheduledDateTime.getTime())) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid date or time format (use YYYY-MM-DD and HH:MM:SS)'
            });
        }

        const scheduledMessage = new ScheduledMessage({
            message,
            scheduledFor: scheduledDateTime,
            status: 'pending'
        });

        await scheduledMessage.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: '⏰ Message scheduled successfully',
            data: {
                id: scheduledMessage._id,
                message: scheduledMessage.message,
                scheduledFor: scheduledMessage.scheduledFor,
                status: scheduledMessage.status
            }
        });

    } catch (error) {
        next(error);
    }
};

const getScheduledMessages = async (req, res, next) => {
    try {
        const messages = await ScheduledMessage.find()
            .sort({ scheduledFor: 1 })
            .lean();

        res.status(StatusCodes.OK).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { createScheduledMessage, getScheduledMessages };