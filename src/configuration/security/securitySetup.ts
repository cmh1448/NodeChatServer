import passportConfig from './passport/passportConfig';
import logger from '../log/logger';
import passport from 'koa-passport';
import corsConfig from './cors/corsConfig';

export default (app: any) => {
  logger.info('Security Configured');

  app.use(passport.initialize());
  // app.use(passport.session());

  corsConfig(app);
  passportConfig();
};
