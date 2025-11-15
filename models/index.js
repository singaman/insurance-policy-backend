// Central model file — imports and exports all Mongoose models
const Account = require('./Account');
const Agent = require('./Agent');
const Policy = require('./Policy');
const PolicyCarrier = require('./PolicyCarrier');
const PolicyCategory = require('./PolicyCategory');
const ScheduledMessage = require('./Message');
const User = require('./User');

module.exports = {
    Account,
    Agent,
    Policy,
    PolicyCarrier,
    PolicyCategory,
    ScheduledMessage,
    User
};
