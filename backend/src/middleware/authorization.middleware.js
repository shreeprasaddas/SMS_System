/**
 * Authorization Middleware
 * Check if user has required roles for endpoint
 */

const logger = require('../utils/logger');
const { AuthorizationError } = require('../utils/errorHelper');

/**
 * Role-based authorization
 * @param {Array<string>} allowedRoles - Array of roles that can access this route
 */
exports.authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        logger.warn('No user found in request (not authenticated)');
        throw new AuthorizationError('Authentication required');
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Unauthorized access attempt', {
          userId: req.user.userId,
          userRole: req.user.role,
          allowedRoles,
          path: req.path,
        });
        throw new AuthorizationError('Your role does not have access to this resource');
      }

      logger.debug('Authorization granted', {
        userId: req.user.userId,
        role: req.user.role,
      });

      next();
    } catch (err) {
      if (err instanceof AuthorizationError) {
        return next(err);
      }
      next(new AuthorizationError('Authorization failed'));
    }
  };
};

/**
 * Check if user can perform action for specific resource
 * Useful for owner-based access control (e.g., student can only access own data)
 */
exports.checkOwnership = (resourceFieldName = 'userId') => {
  return (req, res, next) => {
    try {
      const resourceId = req.body[resourceFieldName] || req.params[resourceFieldName];
      const userId = req.user.userId;

      // SUPER_ADMIN and ADMIN can bypass ownership check
      if (['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
        return next();
      }

      if (resourceId !== userId) {
        logger.warn('Ownership check failed', {
          userId,
          attemptedResourceId: resourceId,
        });
        throw new AuthorizationError('You can only access your own resources');
      }

      logger.debug('Ownership verified', { userId, resourceId });
      next();
    } catch (err) {
      if (err instanceof AuthorizationError) {
        return next(err);
      }
      next(new AuthorizationError('Ownership verification failed'));
    }
  };
};

/**
 * Multi-tenancy enforcement
 * Ensure user can only access data from their school
 */
exports.enforceMultiTenancy = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    // Attach school ID to request for queries
    req.schoolId = req.user.schoolId;

    // If request body or params specify schoolId, verify it matches user's school
    const providedSchoolId = req.body.schoolId || req.params.schoolId || req.query.schoolId;

    if (providedSchoolId && providedSchoolId !== req.user.schoolId) {
      logger.warn('Multi-tenancy violation attempted', {
        userId: req.user.userId,
        userSchool: req.user.schoolId,
        attemptedSchool: providedSchoolId,
      });
      throw new AuthorizationError('Cannot access data from another school');
    }

    logger.debug('Multi-tenancy enforced', { schoolId: req.schoolId });
    next();
  } catch (err) {
    if (err instanceof AuthorizationError) {
      return next(err);
    }
    next(new AuthorizationError('Multi-tenancy check failed'));
  }
};

/**
 * Require specific permissions
 * Can be combined with role-based authorization
 */
exports.requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthorizationError('Authentication required');
      }

      // TODO: Implement permission lookup from user role
      // For now, using role-based access
      logger.debug('Permission check', {
        userId: req.user.userId,
        requiredPermission: permission,
      });

      next();
    } catch (err) {
      if (err instanceof AuthorizationError) {
        return next(err);
      }
      next(new AuthorizationError('Permission check failed'));
    }
  };
};
