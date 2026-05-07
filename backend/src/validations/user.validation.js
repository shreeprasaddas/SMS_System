/**
 * User Validation
 * Joi schemas for user management endpoints
 */

const Joi = require('joi');

const createUserSchema = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
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
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  dateOfBirth: Joi.date(),
  profilePhoto: Joi.string().uri(),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string(),
    country: Joi.string(),
  }),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  phone: Joi.string(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  dateOfBirth: Joi.date(),
  profilePhoto: Joi.string().uri(),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string(),
    country: Joi.string(),
  }),
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
}).with('newPassword', 'confirmPassword');

const updateUserRoleSchema = Joi.object({
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
});

const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED').required(),
});

const listUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  role: Joi.string(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED'),
  search: Joi.string().trim(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  listUsersSchema,
};
