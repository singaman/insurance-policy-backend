const {
    Agent,
    User,
    Account,
    PolicyCategory,
    PolicyCarrier,
    Policy
} = require('../models');

function parseDate(dateString) {
    if (!dateString) return null;
    const parts = String(dateString).split('/');
    if (parts.length === 3) {
        return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    return new Date(dateString);
}

const safeSet = (obj) => {
    const out = {};
    for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (v !== undefined && v !== null && v !== '') out[k] = v;
    }
    return out;
};

const norm = (v) => (typeof v === 'string' ? v.trim() : v);

async function processRecords(records) {
    const stats = {
        agents: 0,
        users: 0,
        accounts: 0,
        categories: 0,
        carriers: 0,
        policies: 0,
        errors: 0
    };

    for (const record of records) {
        try {
            const agentName = norm(record.agent);
            const agent = await Agent.findOneAndUpdate(
                { agentName },
                { $set: safeSet({ agentName }) },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            if (agent) stats.agents++;

            const email = norm(record.email);
            const firstName = norm(record.firstname) || null;
            const phone = norm(record.phone) || null;

            const userQuery = email ? { email: email.toLowerCase() } : (firstName && phone ? { firstName, phone } : null);
            let user = null;
            if (userQuery) {
                const userUpdateDoc = safeSet({
                    firstName,
                    dob: record.dob ? parseDate(record.dob) : undefined,
                    address: norm(record.address),
                    phone,
                    state: norm(record.state),
                    zipCode: norm(record.zip),
                    gender: norm(record.gender),
                    userType: norm(record.userType)
                });

                user = await User.findOneAndUpdate(
                    userQuery,
                    { 
                        $set: userUpdateDoc,
                        $setOnInsert: { email: email ? email.toLowerCase() : undefined }
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }

            if (user) stats.users++;

            const accountName = norm(record.account_name);
            const account = await Account.findOneAndUpdate(
                { accountName },
                { $set: safeSet({ accountName }) },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            if (account) stats.accounts++;

            const categoryName = norm(record.category_name);
            const category = await PolicyCategory.findOneAndUpdate(
                { categoryName },
                { $set: safeSet({ categoryName }) },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            if (category) stats.categories++;

            const companyName = norm(record.company_name);
            const carrier = await PolicyCarrier.findOneAndUpdate(
                { companyName },
                { $set: safeSet({ companyName }) },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            if (carrier) stats.carriers++;

            if (!agent || !category || !carrier || !user) {
                throw new Error('Missing required reference for policy: ' + JSON.stringify({ agent: !!agent, user: !!user, category: !!category, carrier: !!carrier }));
            }

            const policyNumber = norm(record.policy_number) || null;
            const policyUpdate = safeSet({
                policyNumber,
                policyStartDate: record.policy_start_date ? parseDate(record.policy_start_date) : undefined,
                policyEndDate: record.policy_end_date ? parseDate(record.policy_end_date) : undefined,
                userId: user._id,
                categoryId: category._id,
                companyId: carrier._id,
                agentId: agent._id
            });

            const policy = await Policy.findOneAndUpdate(
                { policyNumber },
                { $set: policyUpdate },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            if (policy) stats.policies++;
        } catch (error) {
            console.error('Error processing record:', error && error.message ? error.message : error);
            stats.errors++;
        }
    }

    return stats;
}

module.exports = { processRecords };
