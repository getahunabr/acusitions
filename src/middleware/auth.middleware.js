import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

// Middleware to authenticate users using JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      logger.warn('Authentication failed: No token provided', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        path: req.path,
      });

      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is required',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;

    logger.debug('User authenticated successfully', {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    next();
  } catch (error) {
    logger.warn('Authentication failed: Invalid token', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      path: req.path,
    });

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

// Middleware to authorize users based on roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.error('Authorization check failed: User not authenticated');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User must be authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed: Insufficient permissions', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions to access this resource',
      });
    }

    logger.debug('User authorized successfully', {
      userId: req.user.id,
      role: req.user.role,
      path: req.path,
    });

    next();
  };
};

// Middleware to check if user owns the resource or is an admin
export const authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    logger.error('Authorization check failed: User not authenticated');
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'User must be authenticated',
    });
  }

  const resourceUserId = parseInt(req.params.id);
  const currentUserId = req.user.id;
  const isAdmin = req.user.role === 'admin';
  const isOwner = resourceUserId === currentUserId;

  if (!isOwner && !isAdmin) {
    logger.warn(
      'Authorization failed: User can only access their own resources',
      {
        userId: currentUserId,
        resourceUserId,
        userRole: req.user.role,
        path: req.path,
      }
    );

    return res.status(403).json({
      error: 'Forbidden',
      message: 'You can only access your own resources',
    });
  }

  logger.debug('User authorized for resource access', {
    userId: currentUserId,
    resourceUserId,
    role: req.user.role,
    isOwner,
    isAdmin,
  });

  next();
};
