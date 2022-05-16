import Router from 'koa-router';
import logger from '../configuration/log/logger';
import authGuards from '../configuration/security/passport/authGuards';
import authController from './authentication/api/authController';
import { Role } from './authentication/model/User';

const apiRouter = new Router();
const authentication = new Router();

authentication.post('/register', authController.register);
authentication.post('/login', authController.login);
authentication.get('/userList', authGuards.jwtAccess, authController.userList);
authentication.get('/refresh', authGuards.jwtRefresh, authController.refresh);

authentication.get(
  '/authTest',
  authGuards.roleAccess([Role.Admin]),
  authController.authTest,
);

apiRouter.use('/auth', authentication.routes());
logger.info('Router Loaded');

export default apiRouter;
