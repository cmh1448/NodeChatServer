import Router from 'koa-router';
import logger from '../configuration/log/logger';
import authGuards from '../configuration/security/passport/authGuards';
import authController from './authentication/api/authController';

const apiRouter = new Router();
const authentication = new Router();

authentication.post('/register', authController.register);
authentication.post('/login', authController.login);
authentication.get('/userList', authController.userList);
authentication.get('/refresh', authGuards.jwtRefresh, authController.refresh);
authentication.get('/authTest', authGuards.jwtAccess, authController.authTest);

apiRouter.use('/auth', authentication.routes());
logger.info('Router Loaded');

export default apiRouter;
