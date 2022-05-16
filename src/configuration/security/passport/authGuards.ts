import { Next } from 'koa';
import { RouterContext } from 'koa-router';
import passport from 'passport';
import { Role, UserDetail } from '../../../domains/authentication/model/User';
import { Exception } from '../../../domains/exception/Exception';
import logger from '../../log/logger';

export default {
  jwtAccess: passport.authenticate('jwt-access', { session: false }),
  jwtRefresh: passport.authenticate('jwt-refresh', { session: false }),
  roleAccess: (permitedRoles: Role[]) => {
    return passport.authenticate(
      'jwt-access',
      { session: false },
      (err, user: UserDetail, info) => {
        if (!permitedRoles.includes(user.role)) {
          throw Exception('Not Permited Role', 401);
        }
      },
    );
  },
};
