import koa, { Context } from 'koa';
import koaRouter from 'koa-router';

import dotenv from 'dotenv';
import logger from './configuration/log/logger';
import bodyParser from 'koa-bodyparser';
import securitySetup from './configuration/security/securitySetup';
import apiRouter from './domains/routes';
import mongooseConfig from './configuration/database/mongo/mongooseConfig';

dotenv.config();

const app = new koa();
const router = new koaRouter();
app.use(bodyParser());

mongooseConfig();
securitySetup(app);

router.use('/api', apiRouter.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});