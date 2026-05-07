/**
 * Error Helper
 * Custom error class for application errors
 */

const logger = require('./logger');

class AppError extends Error {
  constructor(message, statusCode = 400, code = 'ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    this.timestamp = new Date();

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Validation Error
 */
class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * Authorization Error
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * Authentication Error
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * Not Found Error
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details = null) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

/**
 * Conflict Error
 */
class ConflictError extends AppError {
  constructor(message = 'Resource already exists', details = null) {
    super(message, 409, 'CONFLICT', details);
  }
}

/**
 * Server Error
 */
class ServerError extends AppError {
  constructor(message = 'Internal server error', originalError = null) {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
    this.originalError = originalError;
  }
}

/**
 * Handle error logging
 */
const handleError = (error) => {
  if (error.isOperational) {
    logger.warn('Operational error:', {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    });
  } else {
    logger.error('Unhandled error:', {
      message: error.message,
      stack: error.stack,
    });
  }

  return error;
};

module.exports = {
  AppError,
  ValidationError,
  AuthorizationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
  ServerError,
  handleError,
};
