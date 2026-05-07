/**
 * Error Handler Middleware
 * Global error handling for all routes
 */

const logger = require('../utils/logger');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const env = require('../config/environment');

/**
 * Global error handler (MUST BE LAST MIDDLEWARE)
 * Handles all errors thrown in routes or middleware
 */
exports.errorHandler = (err, req, res, next) => {
  // Ensure err is an instance of Error
  if (!(err instanceof Error)) {
    err = new AppError(String(err), 500);
  }

  // Extract error details
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log error
  if (statusCode >= 500) {
    logger.error('Server error:', {
      message,
      statusCode,
      path: req.path,
      method: req.method,
      userId: req.user?.userId,
      stack: err.stack,
    });
  } else {
    logger.warn('Client error:', {
      message,
      statusCode,
      path: req.path,
      method: req.method,
      userId: req.user?.userId,
    });
  }

  // Handle validation errors
  if (err instanceof ValidationError) {
    return responseHelper.error(res, err.message, err.statusCode, err.details);
  }

  // Handle operational errors
  if (err.isOperational) {
    return responseHelper.error(res, err.message, statusCode, err.details);
  }

  // Handle unknown errors
  const response = {
    message: 'Internal server error',
    statusCode: 500,
  };

  // In development, include error details
  if (env.isDevelopment()) {
    response.error = {
      message: err.message,
      stack: err.stack,
      details: err,
    };
  }

  return res.status(500).json({
    success: false,
    message: response.message,
    ...(env.isDevelopment() && { error: response.error }),
  });
};

/**
 * 404 Not Found Handler
 * Handle requests to non-existent routes
 */
exports.notFoundHandler = (req, res, next) => {
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    userId: req.user?.userId,
  });

  return responseHelper.notFound(res, `${req.method} ${req.path} not found`);
};

/**
 * Async error wrapper
 * Wrap async route handlers to catch errors
 */
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
