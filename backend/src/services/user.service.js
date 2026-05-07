/**
 * User Service
 * Business logic for user management
 */

const bcryptjs = require('bcryptjs');
const User = require('../models/user/User.model');
const { AppError, AuthorizationError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class UserService {
  /**
   * Get all users with pagination and filtering
   * @param {string} schoolId - School ID for multi-tenancy
   * @param {Object} filters - Filter options (page, limit, role, status, search)
   * @returns {Promise<Object>} - Paginated users list
   */
  async getUsers(schoolId, filters) {
    const { page = 1, limit = 10, role, status, search } = filters;

    // Build query
    const query = { schoolId };

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).select('-password'),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    logger.debug('Users retrieved', { schoolId, page, limit, total });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @param {string} schoolId - School ID for multi-tenancy
   * @returns {Promise<Object>} - User object
   */
  async getUserById(userId, schoolId) {
    const user = await User.findOne({ _id: userId, schoolId }).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {string} schoolId - School ID for multi-tenancy
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} - Updated user
   */
  async updateUser(userId, schoolId, updateData) {
    // Don't allow updating email or role via this endpoint
    if (updateData.email || updateData.role || updateData.password) {
      throw new ValidationError('Cannot update email, role, or password via this endpoint');
    }

    const user = await User.findOne({ _id: userId, schoolId });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update allowed fields
    const allowedFields = ['firstName', 'lastName', 'phone', 'gender', 'dateOfBirth', 'profilePhoto', 'address'];
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    user.updatedBy = userId;
    await user.save();

    logger.info('User updated', { userId, schoolId });

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return updatedUser;
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new ValidationError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 12);

    user.password = hashedPassword;
    user.lastPasswordChange = new Date();
    await user.save();

    logger.info('User password changed', { userId });
  }

  /**
   * Update user role (admin only)
   * @param {string} userId - User ID
   * @param {string} schoolId - School ID
   * @param {string} newRole - New role
   * @param {string} adminId - Admin user ID
   * @returns {Promise<Object>} - Updated user
   */
  async updateUserRole(userId, schoolId, newRole, adminId) {
    const user = await User.findOne({ _id: userId, schoolId });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.role = newRole;
    user.updatedBy = adminId;
    await user.save();

    logger.info('User role updated', { userId, newRole, updatedBy: adminId });

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return updatedUser;
  }

  /**
   * Update user status (admin only)
   * @param {string} userId - User ID
   * @param {string} schoolId - School ID
   * @param {string} newStatus - New status (ACTIVE, INACTIVE, SUSPENDED, ARCHIVED)
   * @param {string} adminId - Admin user ID
   * @returns {Promise<Object>} - Updated user
   */
  async updateUserStatus(userId, schoolId, newStatus, adminId) {
    const user = await User.findOne({ _id: userId, schoolId });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.status = newStatus;
    user.updatedBy = adminId;
    await user.save();

    logger.info('User status updated', { userId, newStatus, updatedBy: adminId });

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return updatedUser;
  }

  /**
   * Delete user (soft delete)
   * @param {string} userId - User ID
   * @param {string} schoolId - School ID
   * @param {string} adminId - Admin user ID
   * @returns {Promise<void>}
   */
  async deleteUser(userId, schoolId, adminId) {
    const user = await User.findOne({ _id: userId, schoolId });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Soft delete
    user.status = 'ARCHIVED';
    user.deletedAt = new Date();
    user.updatedBy = adminId;
    await user.save();

    logger.info('User deleted (soft)', { userId, deletedBy: adminId });
  }

  /**
   * Verify user email
   * @param {string} userId - User ID
   * @param {string} token - Verification token
   * @returns {Promise<void>}
   */
  async verifyEmail(userId, token) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.emailVerificationToken !== token) {
      throw new ValidationError('Invalid verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    logger.info('Email verified', { userId });
  }

  /**
   * Verify user phone
   * @param {string} userId - User ID
   * @param {string} token - OTP token
   * @returns {Promise<void>}
   */
  async verifyPhone(userId, token) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.phoneVerificationToken !== token) {
      throw new ValidationError('Invalid verification token');
    }

    user.isPhoneVerified = true;
    user.phoneVerificationToken = undefined;
    await user.save();

    logger.info('Phone verified', { userId });
  }

  /**
   * Get user count by role
   * @param {string} schoolId - School ID
   * @returns {Promise<Object>} - Count by role
   */
  async getUserCountByRole(schoolId) {
    const counts = await User.aggregate([
      { $match: { schoolId: require('mongoose').Types.ObjectId(schoolId), status: 'ACTIVE' } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const result = {};
    counts.forEach((item) => {
      result[item._id] = item.count;
    });

    return result;
  }
}

module.exports = new UserService();
