import { Next } from 'koa';
import { IMiddleware, RouterContext } from 'koa-router';
import passport from 'passport';
import { Role, UserDetail } from '../../../domains/authentication/model/User';
import { Exeption } from '../../../domains/exception/Exception';
import logger from '../../log/logger';

const checkRole = (permitedRoles: Role[]) => {
  return async (ctx: RouterContext, next: Next) => {
    const user = ctx.state.user;
    if (user) {
      if (permitedRoles.includes(user.role)) {
        await next();
      } else {
        throw new Exeption('Forbidden', 403);
      }
    } else {
      throw new Exeption('Unauthorized', 401);
    }
  };
};

export const jwtAccess = passport.authenticate('jwt-access', {
  session: false,
});

export const jwtRefresh = passport.authenticate('jwt-refresh', {
  session: false,
});

export function roleAcess(permitedRoles: Role[]): IMiddleware[] {
  return [jwtAccess, checkRole(permitedRoles)];
}
