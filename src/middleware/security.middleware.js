import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    let limit;
    let message;
    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin request limit exceeded (20 per minutes) slow down.';
        break;
      case 'user':
        limit = 10;
        message = 'user request limit exceeded (10 per minutes) slow down.';
        break;
      case 'guest':
        limit = 5;
        message = 'guest request limit exceeded (5 per minutes) slow down.';
        break;
      default:
        limit = 5;
        message = 'Guest request limit exceeded (5 per minute). Slow down.';
    }
    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );
    const decision = await client.protect(req);
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('bot request is blocked', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        path: req.path,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated request is not Allowed.',
      });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield request blocked', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        path: req.path,
        method: req.method,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy.',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit Exceeded', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        path: req.path,
      });
      return res
        .status(429)
        .json({ error: 'Forbidden', message: 'Too Many Requests.' });
    }
    next();
  } catch (error) {
    console.error('Arcjet middleware Error:', error);
    res.status(500).json({
      error: 'internal server error',
      message: 'something went wrong with security middleware.',
    });
  }
};
export default securityMiddleware;
