import { Strategy as LocalStrategy } from 'passport-local';
import logger from '../../log/logger';
import passport from 'koa-passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User } from '../../../domains/authentication/model/User';
import { getHashedPassword } from '../securityUtil';

const verifyUser = async (email: string, password: string, done: any) => {
  logger.info('verifying user' + email);
  const user = await User.findOne({
    email: email,
  });
  logger.info(`User ${email} requested login`);
  if (!user) {
    return done(null, false, { message: '존재하지 않는 사용자입니다.' });
  }
  if (user.password === getHashedPassword(password, user.salt)) {
    return done(null, user);
  }
  return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
};

export default () => {
  passport.serializeUser((user: any, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email: string, done) => {
    const user = await User.findOne({
      email: email,
    });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      verifyUser,
    ),
  );

  passport.use(
    'jwt-access',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        logger.debug(
          `User ${payload.email} is trying to login with access token`,
        );
        if (payload.type !== 'access') {
          logger.debug('Invalid token type' + payload.type);
          return done(null, false, { message: '잘못된 토큰입니다.' });
        }

        logger.debug('Valid token type, verifying user');
        const found = await User.findOne({
          email: payload.email,
        });
        if (found) {
          return done(null, found);
        } else {
          return done(null, false, { message: '존재하지 않는 사용자입니다.' });
        }
      },
    ),
  );

  passport.use(
    'jwt-refresh',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        logger.debug(
          `User ${payload.email} is trying to login with refresh token`,
        );
        if (payload.type !== 'refresh') {
          logger.debug('Invalid token type' + payload.type);
          return done(null, false, { message: '잘못된 토큰입니다.' });
        }

        const found = await User.findOne({
          email: payload.email,
        });
        if (found) {
          return done(null, found);
        }
        return done(null, false, { message: '존재하지 않는 사용자입니다.' });
      },
    ),
  );
};
