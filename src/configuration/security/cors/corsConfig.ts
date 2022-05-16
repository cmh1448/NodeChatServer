import cors from '@koa/cors';
import koa from 'koa';
import logger from '../../log/logger';

export default (app: koa) => {
  let corsOptions = {
    origin: process.env.CLIENT_HOST,
    credentials: true,
  };

  app.proxy = true;
  app.use(cors(corsOptions));
  logger.info('Cors Setup Completed');
};
