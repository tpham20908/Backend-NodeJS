# Blogster

### Run

- brew services start redis
- npm run dev (run backend and frontend concurrently)

### Test

- npm run test

### Stop

- brew services stop redis
- Ctrl + C

### Test redis in Node Repl

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
