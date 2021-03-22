const { clearHash } = require('../services/cached');

const cleanCache = async (req, res, next) => {
	await next();
	// clear hashKey once new instance created
	clearHash(req.user.id);
};

module.exports = cleanCache;
