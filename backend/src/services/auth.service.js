/**
 * Auth Service
 * Business logic for authentication and authorization
 */

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user/User.model');
const env = require('../config/environment');
const { AppError, AuthenticationError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - User object without password
   */
  async register(userData) {
    const { firstName, lastName, email, password, phone, role, schoolId } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      schoolId,
      status: 'ACTIVE',
    });

    await user.save();

    // Don't return password
    const userObj = user.toObject();
    delete userObj.password;

    logger.info('User registered successfully', { userId: user._id, email });

    return userObj;
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Tokens and user data
   */
  async login(email, password, schoolId) {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      logger.warn('Login attempt with inactive user', { userId: user._id });
      throw new AuthenticationError('Your account is not active');
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      throw new AuthenticationError('Account is locked. Try again later');
    }

    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      await user.incLoginAttempts();
      logger.warn('Failed login attempt', { userId: user._id });
      throw new AuthenticationError('Invalid email or password');
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.resetLoginAttempts();
    }
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    logger.info('User logged in successfully', { userId: user._id });

    // Don't return password
    const userObj = user.toObject();
    delete userObj.password;

    return {
      accessToken,
      refreshToken,
      user: userObj,
    };
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token from client
   * @returns {Promise<Object>} - New access token
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

      const user = await User.findById(decoded.userId);

      if (!user || user.status !== 'ACTIVE') {
        throw new AuthenticationError('User not found or inactive');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      logger.debug('Token refreshed', { userId: user._id });

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      logger.warn('Token refresh failed', { error: error.message });
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  /**
   * Logout user (invalidate refresh tokens)
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async logout(userId) {
    logger.info('User logged out', { userId });
    // In a production app, you would invalidate the refresh token in Redis
    // For now, we just log it
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<string>} - Reset token
   */
  async requestPasswordReset(email) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists (security best practice)
      logger.warn('Password reset requested for non-existent email', { email });
      return { success: true };
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: '15m',
    });

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    logger.info('Password reset token generated', { userId: user._id });

    // In production, send email with reset link
    return { resetToken };
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);

      const user = await User.findById(decoded.userId);

      if (!user || !user.passwordResetToken) {
        throw new AuthenticationError('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await bcryptjs.hash(newPassword, 12);

      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.lastPasswordChange = new Date();
      await user.save();

      logger.info('Password reset successfully', { userId: user._id });
    } catch (error) {
      logger.warn('Password reset failed', { error: error.message });
      throw new AuthenticationError('Invalid or expired reset token');
    }
  }

  /**
   * Generate access token
   * @param {Object} user - User document
   * @returns {string} - JWT token
   */
  generateAccessToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRE,
    });
  }

  /**
   * Generate refresh token
   * @param {Object} user - User document
   * @returns {string} - JWT token
   */
  generateRefreshToken(user) {
    const payload = {
      userId: user._id,
    };

    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });
  }

  /**
   * Verify token payload
   * @param {Object} payload - JWT payload
   * @returns {Promise<Object>} - User object
   */
  async verifyTokenPayload(payload) {
    const user = await User.findById(payload.userId);

    if (!user || user.status !== 'ACTIVE') {
      throw new AuthenticationError('User not found or inactive');
    }

    return user;
  }
}

module.exports = new AuthService();
