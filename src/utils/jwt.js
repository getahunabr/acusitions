import logger from '#config/logger.js';
import jwtPkg from 'jsonwebtoken'; // default import for CommonJS
const { sign, verify } = jwtPkg;

const jwt_secret =
  process.env.JWT_SECRET || 'your secert key please change in production.';
const jwt_expires_in = '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return sign(payload, jwt_secret, { expiresIn: jwt_expires_in });
    } catch (error) {
      logger.error('Failed to Authenticate the token.', error);
      throw new Error('Failed to Authenticate the token.');
    }
  },
  verify: token => {
    try {
      return verify(token, jwt_secret);
    } catch (error) {
      logger.error('Failed to Authenticate Token', error);
      throw new Error('Failed to Authenticate Token');
    }
  },
};
