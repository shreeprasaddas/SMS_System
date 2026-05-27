/**
 * Authentication Middleware
 * Verify JWT token and extract user information
 */

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { AuthenticationError } = require('../utils/errorHelper');
const env = require('../config/environment');

exports.authenticate = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('No authentication token provided');
      throw new AuthenticationError('Authentication token required');
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Validate schoolId is a valid ObjectId (prevents CastError in downstream queries)
    const mongoose = require('mongoose');
    if (decoded.schoolId && !mongoose.Types.ObjectId.isValid(decoded.schoolId)) {
      logger.warn('Invalid schoolId in token, user must re-login', { userId: decoded.userId, schoolId: decoded.schoolId });
      throw new AuthenticationError('Session contains invalid school reference. Please logout and login again.');
    }

    // Attach user to request
    req.user = decoded; // { userId, role, schoolId, email, iat, exp }
    logger.debug('User authenticated', { userId: decoded.userId, role: decoded.role });

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      logger.warn('Token expired');
      return next(new AuthenticationError('Token has expired'));
    }

    if (err instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid token:', err.message);
      return next(new AuthenticationError('Invalid token'));
    }

    if (err instanceof AuthenticationError) {
      return next(err);
    }

    next(new AuthenticationError('Authentication failed'));
  }
};

/**
 * Optional Authentication
 * Continue even if token is invalid (for public endpoints)
 */
exports.optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = decoded;
      logger.debug('Optional user authenticated', { userId: decoded.userId });
    }

    next();
  } catch (err) {
    // Silent fail for optional auth
    logger.debug('Optional auth failed:', err.message);
    next();
  }
};

/**
 * Refresh Token Handler
 * Check if token needs refresh and provide new one if needed
 */
exports.refreshTokenCheck = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // seconds

    // If token expires in less than 1 hour, attach refresh info
    if (expiresIn < 3600) {
      req.needsRefresh = true;
      logger.debug('Token refresh needed', { userId: decoded.userId });
    }

    next();
  } catch (err) {
    // Continue without refresh info
    next();
  }
};
