import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserDetail } from '../../domains/authentication/model/User';
import { Exeption } from '../../domains/exception/Exception';

export const createSalt = () => crypto.randomBytes(64).toString('base64');

export const createHashedPassword = (password: string) => {
  const salt = createSalt();
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('base64');
  return { salt, hash };
};

export const getHashedPassword = (password: string, salt: string) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('base64');
  return hash;
};

export const decodeToken = async (token: string, secret: string) => {
  let decoded;
  try {
    decoded = await jwt.verify(token, secret);
  } catch (ex) {
    throw new Exeption('Invalid Token', 401);
  }
  return decoded;
};

export const createTicket = (user: UserDetail) => {
  const ticketContent = user.toJSON();
  const ticket = jwt.sign(
    ticketContent,
    process.env.JWT_WEBSOCKET_SECRET ?? '',
    {
      expiresIn: '2m',
    },
  );
  return ticket;
};

export const createAccessToken = (user: any) => {
  const tokenContent = user.toJSON();
  tokenContent.type = 'access';

  const token = jwt.sign(tokenContent, process.env.JWT_SECRET ?? '', {
    expiresIn: '1h',
  });

  return token;
};

export const createRefreshToken = (user: any) => {
  const tokenContent = user.toJSON();
  tokenContent.type = 'refresh';

  const token = jwt.sign(tokenContent, process.env.JWT_SECRET ?? '', {
    expiresIn: '7d',
  });

  return token;
};
