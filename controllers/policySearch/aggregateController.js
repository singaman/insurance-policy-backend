const { StatusCodes } = require('http-status-codes');
const { User, Policy } = require('../../models');

// Aggregated policies grouped by user
const getAggregatedPolicies = async (req, res, next) => {
	try {
		const username = (req.query.username || '').trim();
		let matchStage = null;

		if (username) {
			// Find matching users first name or complete name
			const re = new RegExp(username, 'i');
			const users = await User.find({ firstName: re }).select('_id').lean();

			if (!users.length) {
				return res.status(StatusCodes.OK).json({ success: true, message: 'No users found for given username', data: [], count: 0 });
			}

			const userIds = users.map(u => u._id);
			matchStage = { $match: { userId: { $in: userIds } } };
		}

		const pipeline = [];

		if (matchStage) pipeline.push(matchStage);

		pipeline.push(
			{ $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
			{ $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
			{ $lookup: { from: 'policycategories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
			{ $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
			{ $lookup: { from: 'policycarriers', localField: 'companyId', foreignField: '_id', as: 'carrier' } },
			{ $unwind: { path: '$carrier', preserveNullAndEmptyArrays: true } },
			{
				$group: {
					_id: '$user._id',
					userName: { $first: '$user.firstName' },
					userEmail: { $first: '$user.email' },
					totalPolicies: { $sum: 1 },
					policies: {
						$push: {
							policyNumber: '$policyNumber',
							startDate: '$policyStartDate',
							endDate: '$policyEndDate',
							category: '$category.categoryName',
							carrier: '$carrier.companyName'
						}
					},
					categories: { $addToSet: '$category.categoryName' },
					carriers: { $addToSet: '$carrier.companyName' }
				}
			},
			{
				$project: {
					_id: 0,
					userId: '$_id',
					userName: 1,
					userEmail: 1,
					totalPolicies: 1,
					policies: 1,
					categories: 1,
					carriers: 1
				}
			}
		);

		const results = await Policy.aggregate(pipeline);
		return res.status(StatusCodes.OK).json({ success: true, message: 'Aggregated policies retrieved', data: results, count: results.length });
	} catch (err) {
		next(err);
	}
};

module.exports = { getAggregatedPolicies };
