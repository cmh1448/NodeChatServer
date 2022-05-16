import Router from 'koa-router';
import logger from '../configuration/log/logger';
import {
  jwtAccess,
  jwtRefresh,
  roleAcess,
} from '../configuration/security/passport/authGuards';
import authController from './authentication/api/authController';
import { Role } from './authentication/model/User';

const apiRouter = new Router();
const authentication = new Router();

authentication.post('/register', authController.register);
authentication.post('/login', authController.login);
authentication.get('/userList', jwtAccess, authController.userList);
authentication.get('/refresh', jwtRefresh, authController.refresh);

authentication.get(
  '/authTest',
  ...roleAcess([Role.Admin]),
  authController.authTest,
);

apiRouter.use('/auth', authentication.routes());
logger.info('Router Loaded');

export default apiRouter;
