const { StatusCodes } = require('http-status-codes');
const Message = require('../models/Message');

const createMessage = async (req, res, next) => {
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

        const Message = new Message({
            message,
            scheduledFor: scheduledDateTime,
            status: 'pending'
        });

        await Message.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: '⏰ Message scheduled successfully',
            data: {
                id: Message._id,
                message: Message.message,
                scheduledFor: Message.scheduledFor,
                status: Message.status
            }
        });

    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find()
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

module.exports = { createMessage, getMessages };