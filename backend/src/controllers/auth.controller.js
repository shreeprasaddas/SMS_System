/**
 * Auth Controller
 * HTTP request handlers for authentication
 */

const authService = require('../services/auth.service');
const responseHelper = require('../utils/responseHelper');
const logger = require('../utils/logger');

class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  static async register(req, res, next) {
    try {
      const { firstName, lastName, email, password, phone, role, schoolId } = req.body;

      const user = await authService.register({
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        schoolId,
      });

      responseHelper.created(res, { user }, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      responseHelper.success(
        res,
        {
          accessToken: result.accessToken,
          user: result.user,
        },
        'Login successful'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh-token
   */
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshToken(refreshToken);

      responseHelper.success(res, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  static async logout(req, res, next) {
    try {
      const userId = req.user.userId;

      await authService.logout(userId);

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      responseHelper.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   * POST /api/v1/auth/request-password-reset
   */
  static async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;

      const result = await authService.requestPasswordReset(email);

      // Always return success for security
      responseHelper.success(
        res,
        null,
        'If email exists, a password reset link has been sent'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with token
   * POST /api/v1/auth/reset-password
   */
  static async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;

      await authService.resetPassword(token, password);

      responseHelper.success(res, null, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  static async getCurrentUser(req, res, next) {
    try {
      const user = await authService.verifyTokenPayload(req.user);

      responseHelper.success(res, { user }, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
