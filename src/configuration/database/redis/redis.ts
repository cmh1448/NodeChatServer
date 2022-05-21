import redis from 'ioredis';
import logger from '../../log/logger';
import dotenv from 'dotenv';
import session from 'koa-session';
import redisStore from 'koa-redis';
import { DefaultState, DefaultContext } from 'koa';

dotenv.config();

const config = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

const redisClient = new redis(config);

redisClient.on('connect', () => {
  logger.info('Redis connected');
});

redisClient.on('error', (err) => {
  logger.error(err);
});

export default {
  client: redisClient,
  config: (app: import('koa')<DefaultState, DefaultContext>) => {
    app.keys = [process.env.REDIS_SECRET ?? ''];
    app.use(
      session(
        {
          store: redisStore({ client: redisClient }),
        },
        app,
      ),
    );
  },
};
