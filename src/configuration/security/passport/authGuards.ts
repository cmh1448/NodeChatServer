import { Next } from 'koa';
import { IMiddleware, RouterContext } from 'koa-router';
import passport from 'passport';
import { Role, UserDetail } from '../../../domains/authentication/model/User';
import { Exception } from '../../../domains/exception/Exception';
import logger from '../../log/logger';

const checkRole = (permitedRoles: Role[]) => {
  return async (ctx: RouterContext, next: Next) => {
    const user = ctx.state.user;
    if (user) {
      if (permitedRoles.includes(user.role)) {
        await next();
      } else {
        ctx.throw(
          Exception('You are not authorized to access this resource', 401),
        );
      }
    } else {
      ctx.throw(Exception('You are not logged in', 401));
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
