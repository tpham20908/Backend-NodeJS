const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

// only cache when called
mongoose.Query.prototype.cache = function (option = {}) {
	this.useCache = true;
	this.hashKey = JSON.stringify(option.key || '');
	return this;
};

mongoose.Query.prototype.exec = async function () {
	if (!this.useCache) {
		return exec.apply(this, arguments);
	}

	const key = JSON.stringify(
		Object.assign({}, this.getQuery(), {
			collection: this.mongooseCollection.name,
		})
	);

	// Is there any cached data related to this query
	const cachedValue = await client.hget(this.hashKey, key);

	// if yes, then response to the request right away and return
	if (cachedValue) {
		const doc = JSON.parse(cachedValue);
		// convert redis string to MongoDB model instance before return
		const result = Array.isArray(doc)
			? doc.map((d) => new this.model(d))
			: new this.model(doc);
		return result;
	}

	// if no, response to the request and update cache server to store data
	const result = await exec.apply(this, arguments);
	client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10); // cache expires in 10s
	return result;
};

const clearHash = (hashKey) => {
	client.del(JSON.stringify(hashKey));
};

module.exports = { clearHash };
