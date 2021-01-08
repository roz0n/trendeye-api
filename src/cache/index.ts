import redis, { ClientOpts } from "redis";

const redisOptions: ClientOpts = {
  db: 0,
  port: Number(process.env.REDIS_PORT) || 6379,
};

const cache = redis.createClient(redisOptions);

export default cache;
