import Router from 'koa-router';
import logger from '../configuration/log/logger';
import authController from './authentication/api/authController';
import roomController from './localchat/api/roomController';
import chatController from './localchat/api/chatController';

const apiRouter = new Router();

apiRouter.use('/auth', authController.routes());
apiRouter.use('/room', roomController.routes());
apiRouter.use('/chat', chatController.routes());
logger.info('Router Loaded');

export default apiRouter;
