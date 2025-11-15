const { searchByUsername } = require('./searchController');
const { getAggregatedPolicies } = require('./aggregateController');

module.exports = {
	searchByUsername,
	getAggregatedPolicies
};
