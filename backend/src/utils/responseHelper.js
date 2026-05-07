/**
 * Response Helper
 * Standardized response formatting for all endpoints
 */

const { HTTP_STATUS } = require('../config/constants');

const responseHelper = {
  /**
   * 200 - Success Response
   */
  success: (res, data, message = 'Success') => {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
    });
  },

  /**
   * 201 - Created Response
   */
  created: (res, data, message = 'Created successfully') => {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data,
    });
  },

  /**
   * 200 - Paginated Response
   */
  paginated: (res, data, { page = 1, limit = 20, total = 0 }) => {
    const totalPages = Math.ceil(total / limit);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  },

  /**
   * 200 - No Content (for delete operations)
   */
  noContent: (res, message = 'Operation completed') => {
    return res.status(200).json({
      success: true,
      message,
      data: null,
    });
  },

  /**
   * 400 - Bad Request / Validation Error
   */
  error: (res, message, statusCode = HTTP_STATUS.BAD_REQUEST, errors = null) => {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  },

  /**
   * 401 - Unauthorized
   */
  unauthorized: (res, message = 'Unauthorized') => {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message,
    });
  },

  /**
   * 403 - Forbidden / Access Denied
   */
  forbidden: (res, message = 'Access denied') => {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message,
    });
  },

  /**
   * 404 - Not Found
   */
  notFound: (res, message = 'Resource not found') => {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message,
    });
  },

  /**
   * 409 - Conflict
   */
  conflict: (res, message = 'Resource already exists') => {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message,
    });
  },

  /**
   * 500 - Internal Server Error
   */
  serverError: (res, message = 'Internal server error', error = null) => {
    const response = {
      success: false,
      message,
    };

    if (process.env.NODE_ENV !== 'production' && error) {
      response.error = error.message;
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  },

  /**
   * Bulk Operations Response
   */
  bulk: (res, results, message = 'Bulk operation completed') => {
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return res.status(HTTP_STATUS.OK).json({
      success: failed === 0,
      message,
      results: {
        total: results.length,
        successful,
        failed,
        data: results,
      },
    });
  },
};

module.exports = responseHelper;
