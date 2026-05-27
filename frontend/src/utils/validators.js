import Joi from 'joi';

// Helper to format Joi validation errors for react-hook-form or general forms
export const validateSchema = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (!error) return { errors: null, value };

  const errors = {};
  error.details.forEach((detail) => {
    const path = detail.path.join('.');
    errors[path] = detail.message;
  });

  return { errors, value: null };
};

// Common Joi Schemas
export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
    }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
});

export const studentSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
    }),
  dateOfBirth: Joi.date().max('now').required().messages({
    'date.max': 'Date of birth cannot be in the future',
    'any.required': 'Date of birth is required',
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  classId: Joi.string().required().messages({
    'string.empty': 'Class assignment is required',
  }),
  rollNumber: Joi.string().required().messages({
    'string.empty': 'Roll number is required',
  }),
  guardianName: Joi.string().required().messages({
    'string.empty': 'Guardian name is required',
  }),
  guardianPhone: Joi.string()
    .pattern(/^[0-9+\-\s()]*$/)
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid phone number',
      'string.empty': 'Guardian phone number is required',
    }),
});

export const teacherSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string().required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  qualification: Joi.string().required(),
  designation: Joi.string().required(),
  joiningDate: Joi.date().required(),
  salary: Joi.number().min(0).required(),
});
