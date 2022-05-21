import Router from 'koa-router';
import logger from '../configuration/log/logger';
import authController from './authentication/api/authController';
import roomController from './localchat/api/roomController';

const apiRouter = new Router();

apiRouter.use('/auth', authController.routes());
apiRouter.use('/room', roomController.routes());

logger.info('Router Loaded');

export default apiRouter;
