const { StatusCodes } = require('http-status-codes');
const { User, Policy } = require('../../models');

// build populate array only for paths present in the Policy schema
const buildSafePopulate = (model, specs) => {
	const out = [];
	for (const [p, spec] of Object.entries(specs)) {
		if (model.schema && model.schema.path(p)) {
			out.push(Object.assign({ path: p }, spec));
		}
	}
	return out;
};

// escape user input for safe regex usage
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Search policies by username (firstName partial, case-insensitive) — matches whole words only
const searchByUsername = async (req, res, next) => {
	try {
		const username = (req.query.username || '').trim();
		if (!username) {
			return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'username query parameter is required' });
		}

		// match as whole word to avoid matching inside other words (e.g. "Kinnaman")
        const re = new RegExp('\\b' + escapeRegex(username) + '\\b', 'i');

		const users = await User.find({ firstName: re }).select('_id firstName email phone').lean();

		if (!users.length) {
			return res.status(StatusCodes.OK).json({ success: true, message: 'No policies found', data: [], count: 0 });
		}

		const userIds = users.map(u => u._id);

		const populateSpecs = {
			userId: { select: 'firstName email phone' },
			categoryId: { select: 'categoryName' },
			companyId: { select: 'companyName' },
			agentId: { select: 'agentName' }
		};
		const pops = buildSafePopulate(Policy, populateSpecs);

		let q = Policy.find({ userId: { $in: userIds } }).lean();
		if (pops.length) q = q.populate(pops);

		const policies = await q.exec();

		return res.status(StatusCodes.OK).json({ success: true, message: 'Policies retrieved', data: policies, count: policies.length });
	} catch (err) {
		next(err);
	}
};

module.exports = { searchByUsername };
