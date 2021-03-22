# Blogster

node
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

client.set('key', 'value');
client.get('key', function callback () {});

client.set('key', JSON.stringify(object));
client.get('key', (err, result) => JSON.parse(result) );

client.hset('masterKey', 'key', 'value');
client.hget('masterKey', 'key', function callback() {});

client.flushall();
client.set('key', JSON.stringify(object), 'EX', 10); => set expired time in second
