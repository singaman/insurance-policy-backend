const { StatusCodes } = require('http-status-codes');
const { User, Policy } = require('../models');

// helper: build populate array only for paths present in the Policy schema
const buildSafePopulate = (model, specs) => {
	// specs: { pathName: { select: '...' }, ... }
	const out = [];
	for (const [p, spec] of Object.entries(specs)) {
		if (model.schema && model.schema.path(p)) {
			out.push(Object.assign({ path: p }, spec));
		}
	}
	return out;
};

const searchPolicies = async (req, res) => {
    try {
		const { username } = req.query;
		if (!username) {
			return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Username is required' });
		}

		// Find user by first name
		const users = await User.find({ 
            firstName: { $regex: username, $options: 'i' } 
        });

        if (users.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }
		const userIds = users.map(user => user._id);

		const populateSpecs = {
			userId: { select: 'firstName email phone' },
			categoryId: { select: 'categoryName' },
			companyId: { select: 'companyName' },
			agentId: { select: 'agentName' }
		};
		const pops = buildSafePopulate(Policy, populateSpecs);

		let q = Policy.find({ userId: { $in: userIds } });
		if (pops.length) q = q.populate(pops);

		const policies = await q.exec();

		return res.status(StatusCodes.OK).json({ success: true, count: policies.length, data: policies });
	} catch (error) {
		console.error('Search error:', error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Search failed', error: error.message });
	}
};

module.exports = {
	searchPolicies
};
