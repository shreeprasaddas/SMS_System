/**
 * User Routes
 * Protected user management endpoints
 */

const express = require('express');
const UserController = require('../controllers/user.controller');
const { validate } = require('../middleware/validation.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const {
  updateUserSchema,
  changePasswordSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} = require('../validations/user.validation');

const router = express.Router();

/**
 * Protected Routes (Authenticated Required)
 */

// Get all users (with pagination & filtering)
router.get('/', UserController.getUsers);

// Get user stats by role (admin only)
router.get('/stats/by-role', authorize(['ADMIN', 'PRINCIPAL']), UserController.getUserCountByRole);

// Get user by ID
router.get('/:userId', UserController.getUser);

// Update own profile or another user's profile (admin)
router.put('/:userId', validate(updateUserSchema), UserController.updateUser);

// Change password
router.post('/:userId/change-password', validate(changePasswordSchema), UserController.changePassword);

// Verify email
router.post('/:userId/verify-email', UserController.verifyEmail);

// Verify phone
router.post('/:userId/verify-phone', UserController.verifyPhone);

/**
 * Admin Only Routes
 */

// Update user role (admin only)
router.patch('/:userId/role', authorize(['ADMIN']), validate(updateUserRoleSchema), UserController.updateUserRole);

// Update user status (admin only)
router.patch('/:userId/status', authorize(['ADMIN']), validate(updateUserStatusSchema), UserController.updateUserStatus);

// Delete user (admin only)
router.delete('/:userId', authorize(['ADMIN']), UserController.deleteUser);

module.exports = router;
