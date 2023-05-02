const redis = require("redis");

const redisClient = redis.createClient({
  url: 'redis://db-redis-node:6379'
});

module.exports = redisClient;
