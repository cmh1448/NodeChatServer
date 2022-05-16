import { RouterContext } from 'koa-router';
import passport from 'passport';

export default {
  jwtAccess: passport.authenticate('jwt-access', { session: false }),
  jwtRefresh: passport.authenticate('jwt-refresh', { session: false }),
};
