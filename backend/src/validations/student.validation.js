const Joi = require('joi');

exports.createStudentSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  dateOfBirth: Joi.date().iso().allow('', null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', '').allow('', null),
  classId: Joi.string().required(),
  rollNumber: Joi.number().required(),
  section: Joi.string().default('A').allow('', null),
  address: Joi.string().allow('', null),
  city: Joi.string().allow('', null),
  state: Joi.string().allow('', null),
  postalCode: Joi.string().allow('', null),
  parentName: Joi.string().allow('', null),
  parentPhone: Joi.string().allow('', null),
  parentEmail: Joi.string().email().allow('', null),
  admissionDate: Joi.date().iso().allow('', null),
  bloodGroup: Joi.string().allow('', null),
});

exports.updateStudentSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.string().email(),
  phone: Joi.string().allow('', null),
  dateOfBirth: Joi.date().iso().allow('', null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', '').allow('', null),
  classId: Joi.string(),
  rollNumber: Joi.number(),
  section: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  city: Joi.string().allow('', null),
  state: Joi.string().allow('', null),
  postalCode: Joi.string().allow('', null),
  parentName: Joi.string().allow('', null),
  parentPhone: Joi.string().allow('', null),
  parentEmail: Joi.string().email().allow('', null),
  admissionDate: Joi.date().iso().allow('', null),
  bloodGroup: Joi.string().allow('', null),
});

module.exports = exports;
