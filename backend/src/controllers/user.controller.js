/**
 * User Controller
 * HTTP request handlers for user management
 */

const userService = require('../services/user.service');
const responseHelper = require('../utils/responseHelper');
const logger = require('../utils/logger');

class UserController {
  /**
   * Get all users with pagination and filtering
   * GET /api/v1/users
   */
  static async getUsers(req, res, next) {
    try {
      const { page, limit, role, status, search } = req.query;

      const result = await userService.getUsers(req.user.schoolId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        role,
        status,
        search,
      });

      responseHelper.paginated(
        res,
        result.users,
        result.pagination,
        'Users retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /api/v1/users/:userId
   */
  static async getUser(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await userService.getUserById(userId, req.user.schoolId);

      responseHelper.success(res, { user }, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/v1/users/:userId
   */
  static async updateUser(req, res, next) {
    try {
      const { userId } = req.params;

      // Users can only update their own profile unless they're admin
      if (req.user.userId !== userId && req.user.role !== 'ADMIN') {
        return responseHelper.error(
          res,
          'You can only update your own profile',
          403
        );
      }

      const user = await userService.updateUser(userId, req.user.schoolId, req.body);

      responseHelper.success(res, { user }, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * POST /api/v1/users/:userId/change-password
   */
  static async changePassword(req, res, next) {
    try {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;

      // Users can only change their own password
      if (req.user.userId !== userId) {
        return responseHelper.error(
          res,
          'You can only change your own password',
          403
        );
      }

      await userService.changePassword(userId, currentPassword, newPassword);

      responseHelper.success(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user role (admin only)
   * PATCH /api/v1/users/:userId/role
   */
  static async updateUserRole(req, res, next) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const user = await userService.updateUserRole(userId, req.user.schoolId, role, req.user.userId);

      responseHelper.success(res, { user }, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user status (admin only)
   * PATCH /api/v1/users/:userId/status
   */
  static async updateUserStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      const user = await userService.updateUserStatus(
        userId,
        req.user.schoolId,
        status,
        req.user.userId
      );

      responseHelper.success(res, { user }, 'User status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user (admin only)
   * DELETE /api/v1/users/:userId
   */
  static async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;

      await userService.deleteUser(userId, req.user.schoolId, req.user.userId);

      responseHelper.success(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email
   * POST /api/v1/users/:userId/verify-email
   */
  static async verifyEmail(req, res, next) {
    try {
      const { userId } = req.params;
      const { token } = req.body;

      await userService.verifyEmail(userId, token);

      responseHelper.success(res, null, 'Email verified successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify phone
   * POST /api/v1/users/:userId/verify-phone
   */
  static async verifyPhone(req, res, next) {
    try {
      const { userId } = req.params;
      const { token } = req.body;

      await userService.verifyPhone(userId, token);

      responseHelper.success(res, null, 'Phone verified successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user count by role
   * GET /api/v1/users/stats/by-role
   */
  static async getUserCountByRole(req, res, next) {
    try {
      const counts = await userService.getUserCountByRole(req.user.schoolId);

      responseHelper.success(res, counts, 'User count retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
