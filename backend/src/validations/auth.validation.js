/**
 * Auth Validation
 * Joi schemas for authentication endpoints
 */

const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).optional().allow(''),
  phone: Joi.string().optional().allow(''),
  role: Joi.string()
    .valid(
      'ADMIN',
      'PRINCIPAL',
      'VICE_PRINCIPAL',
      'TEACHER',
      'STUDENT',
      'PARENT',
      'LIBRARIAN',
      'ACCOUNTANT',
      'TRANSPORT_MANAGER',
      'HOSTEL_MANAGER',
      'HR_MANAGER'
    )
    .required(),
  schoolId: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const passwordResetRequestSchema = Joi.object({
  email: Joi.string().email().required().lowercase(),
});

const passwordResetSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
}).with('password', 'confirmPassword');

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
};
