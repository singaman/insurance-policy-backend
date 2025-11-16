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

        // ? Simple storage - no scheduling logic
        const newMessage = new Message({
            message,
            day,
            time
        });

        await newMessage.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Message stored successfully',
            data: {
                id: newMessage._id,
                message: newMessage.message,
                day: newMessage.day,
                time: newMessage.time,
                createdAt: newMessage.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find()
            .sort({ createdAt: -1 })
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
