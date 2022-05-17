import { RouterContext } from 'koa-router';
import passport from 'passport';
import logger from '../../../configuration/log/logger';
import User from '../model/User';
import {
  createHashedPassword,
  createAccessToken,
  createRefreshToken,
} from '../../../configuration/security/securityUtil';
import { Next } from 'koa';

const register = async (ctx: RouterContext) => {
  const { email, name, password } = ctx.request.body;
  const { salt, hash } = createHashedPassword(password);

  const user = new User({
    email: email,
    name: name,
    salt: salt,
    password: hash,
  });

  await user.save();
  const query = await User.findById(user._id).exec();
  ctx.body = {
    message: 'User created',
    user: query,
  };
};

const userList = async (ctx: RouterContext) => {
  const users = await User.find({}).exec();
  ctx.body = users;
};

const login = async (ctx: RouterContext, next: Next) => {
  await passport.authenticate(
    'local',
    { session: false },
    (err, user, info) => {
      logger.debug(user.email + ' is tying to login');
      if (err || !user) {
        ctx.status = 400;
        ctx.body = {
          message: 'Authentication Error',
          user: user,
        };
        logger.info(user.email + ' faced authentication error');
      } else {
        ctx
          .login(user)
          .catch((err) => {
            ctx.body = err;
          })
          .then(() => {
            ctx.body = {
              refreshToken: createRefreshToken(user),
              accessToken: createAccessToken(user),
              user: user,
            };
          });

        logger.info(user.email + 'is logged in');
      }
    },
  )(ctx, next);
};

const refresh = async (ctx: RouterContext) => {
  ctx.body = {
    message: 'Refresh Completed',
    accessToken: createAccessToken(ctx.state.user),
  };
};

const authTest = async (ctx: RouterContext) => {
  logger.debug('authTest');
  const user = ctx.state.user;

  ctx.body = {
    message: `hello ${user.name}, you are logged in and your role is ${user.role}`,
  };
};

export default {
  register,
  userList,
  login,
  authTest,
  refresh,
};
