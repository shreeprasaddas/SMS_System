/**
 * Validation Middleware
 * Validate request data using Joi schemas
 */

const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errorHelper');

/**
 * Validate request body, params, or query
 * @param {Object} schema - Joi validation schema
 * @param {string} source - 'body' (default), 'params', 'query'
 */
exports.validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      // Get data from specified source
      const dataToValidate = req[source];

      // Validate
      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false, // Get all errors, not just first
        stripUnknown: true, // Remove unknown fields
      });

      if (error) {
        // Format validation errors
        const formattedErrors = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
          type: detail.type,
        }));

        logger.warn('Validation failed', {
          source,
          errors: formattedErrors,
          data: dataToValidate,
        });

        throw new ValidationError('Validation failed', formattedErrors);
      }

      // Replace request data with validated data
      req[source] = value;

      logger.debug('Validation passed', { source });
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        return next(err);
      }

      logger.error('Validation error:', err);
      next(new ValidationError('Validation failed'));
    }
  };
};

/**
 * Validate multiple sources (body + params + query)
 */
exports.validateMulti = (schemas) => {
  return (req, res, next) => {
    try {
      const errors = [];

      // Validate each source if schema provided
      Object.entries(schemas).forEach(([source, schema]) => {
        if (!schema) return;

        const { error, value } = schema.validate(req[source], {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          const formattedErrors = error.details.map((detail) => ({
            field: `${source}.${detail.path.join('.')}`,
            message: detail.message,
            type: detail.type,
          }));
          errors.push(...formattedErrors);
        } else {
          req[source] = value;
        }
      });

      if (errors.length > 0) {
        logger.warn('Multi-source validation failed', { errors });
        throw new ValidationError('Validation failed', errors);
      }

      logger.debug('Multi-source validation passed');
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        return next(err);
      }

      logger.error('Multi-source validation error:', err);
      next(new ValidationError('Validation failed'));
    }
  };
};

/**
 * Custom validation function
 */
exports.validateCustom = (validationFn) => {
  return async (req, res, next) => {
    try {
      const result = await validationFn(req);

      if (result.error) {
        logger.warn('Custom validation failed', result.error);
        throw new ValidationError('Validation failed', result.error);
      }

      // Optionally attach validated data to request
      if (result.data) {
        req.validatedData = result.data;
      }

      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        return next(err);
      }

      logger.error('Custom validation error:', err);
      next(new ValidationError('Validation failed'));
    }
  };
};
