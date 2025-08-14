const Redis = require("ioredis");

const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
};

// Only add authentication for production environment
if (process.env.NODE_DEV_ENV === "production") {
  redisConfig.username = "default";
  redisConfig.password = process.env.REDIS_PASSWORD;
}

const redis = new Redis(redisConfig);

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.log("Redis error: ", err);
});

module.exports = redis;
