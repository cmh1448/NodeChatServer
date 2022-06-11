import koa, { Context } from 'koa';
import koaRouter from 'koa-router';

import dotenv from 'dotenv';
import logger from './configuration/log/logger';
import bodyParser from 'koa-bodyparser';
import securitySetup from './configuration/security/securitySetup';
import apiRouter from './domains/routes';
import mongooseConfig from './configuration/database/mongo/mongooseConfig';
import { exeptionHandler } from './domains/exception/Exception';
import redis from './configuration/database/redis/redis';
import { WebsocketListener } from './domains/localchat/server/WebsocketListener';

//Environment Setup
dotenv.config();
const app = new koa();
const router = new koaRouter();

//Middleware Setup
app.use(exeptionHandler);
app.use(bodyParser());

//Database Setup
mongooseConfig();
redis.config(app);

//Security Setup
securitySetup(app);

//Router Setup
router.use('/api', apiRouter.routes());
app.use(router.routes()).use(router.allowedMethods());

//Server Setup
app.listen(5000, () => {
  logger.info('Server is running on port 3000');
});
const websocketListener = new WebsocketListener(app);
