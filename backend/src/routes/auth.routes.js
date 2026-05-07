/**
 * Auth Routes
 * Public authentication endpoints
 */

const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} = require('../validations/auth.validation');

const router = express.Router();

/**
 * Public Routes (No Authentication Required)
 */

// Register new user
router.post('/register', validate(registerSchema), AuthController.register);

// Login user
router.post('/login', validate(loginSchema), AuthController.login);

// Refresh access token
router.post('/refresh-token', validate(refreshTokenSchema), AuthController.refreshToken);

// Request password reset
router.post(
  '/request-password-reset',
  validate(passwordResetRequestSchema),
  AuthController.requestPasswordReset
);

// Reset password with token
router.post('/reset-password', validate(passwordResetSchema), AuthController.resetPassword);

/**
 * Protected Routes (Authentication Required)
 */

// Get current user profile
router.get('/me', authenticate, AuthController.getCurrentUser);

// Logout user
router.post('/logout', authenticate, AuthController.logout);

module.exports = router;
