const Joi = require('joi');

/**
 * Book Validations
 */
exports.createBookSchema = Joi.object().keys({
  title: Joi.string().min(3).max(200).required(),
  authors: Joi.array().items(Joi.string()).min(1).required(),
  isbn: Joi.string().required(),
  publisher: Joi.string().required(),
  publishedDate: Joi.date(),
  edition: Joi.string(),
  category: Joi.string()
    .valid('FICTION', 'NON_FICTION', 'ACADEMIC', 'REFERENCE', 'SCIENCE', 'HISTORY', 'ARTS', 'MATHEMATICS', 'SPORTS', 'GENERAL')
    .default('GENERAL'),
  language: Joi.string()
    .valid('ENGLISH', 'HINDI', 'SPANISH', 'FRENCH', 'GERMAN', 'OTHER')
    .default('ENGLISH'),
  totalCopies: Joi.number().min(1).required(),
  location: Joi.object().keys({
    shelf: Joi.string(),
    rack: Joi.string(),
    section: Joi.string()
  }),
  condition: Joi.string()
    .valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR')
    .default('GOOD'),
  acquisitionDate: Joi.date().required(),
  acquisitionCost: Joi.number().required(),
  pages: Joi.number(),
  description: Joi.string().max(2000),
  tags: Joi.array().items(Joi.string()),
  coverImageURL: Joi.string()
});

exports.updateBookSchema = Joi.object().keys({
  title: Joi.string().min(3).max(200),
  authors: Joi.array().items(Joi.string()).min(1),
  edition: Joi.string(),
  condition: Joi.string().valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
  tags: Joi.array().items(Joi.string()),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED')
});

exports.bookFilterSchema = Joi.object().keys({
  category: Joi.string()
    .valid('FICTION', 'NON_FICTION', 'ACADEMIC', 'REFERENCE', 'SCIENCE', 'HISTORY', 'ARTS', 'MATHEMATICS', 'SPORTS', 'GENERAL'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
  search: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Library Member Validations
 */
exports.registerMemberSchema = Joi.object().keys({
  userId: Joi.string().required(),
  userName: Joi.string().required(),
  membershipType: Joi.string()
    .valid('STUDENT', 'TEACHER', 'STAFF', 'PARENT')
    .required(),
  expiryDate: Joi.date().required(),
  maxBooksAllowed: Joi.number().min(1).default(5)
});

exports.memberFilterSchema = Joi.object().keys({
  membershipType: Joi.string().valid('STUDENT', 'TEACHER', 'STAFF', 'PARENT'),
  status: Joi.string().valid('ACTIVE', 'SUSPENDED', 'EXPIRED', 'INACTIVE'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Book Issue Validations
 */
exports.issueBookSchema = Joi.object().keys({
  bookId: Joi.string().required(),
  userId: Joi.string().required(),
  dueDate: Joi.date().required(),
  issueType: Joi.string().valid('NORMAL', 'REFERENCE', 'RUSH').default('NORMAL')
});

exports.issueFilterSchema = Joi.object().keys({
  status: Joi.string().valid('ISSUED', 'RETURNED', 'OVERDUE', 'LOST', 'DAMAGED'),
  overdue: Joi.boolean(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Book Return Validations
 */
exports.returnBookSchema = Joi.object().keys({
  bookConditionOnReturn: Joi.string()
    .valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'LOST', 'DAMAGED')
    .required(),
  remarks: Joi.string()
});

/**
 * Book Reservation Validations
 */
exports.reserveBookSchema = Joi.object().keys({
  bookId: Joi.string().required(),
  userName: Joi.string().required(),
  userRole: Joi.string().required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').default('MEDIUM'),
  reason: Joi.string()
});

exports.reservationFilterSchema = Joi.object().keys({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'READY_FOR_PICKUP', 'CANCELLED', 'EXPIRED', 'FULFILLED'),
  userId: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Library Fine Validations
 */
exports.createFineSchema = Joi.object().keys({
  bookIssueId: Joi.string().required(),
  userId: Joi.string().required(),
  userName: Joi.string().required(),
  fineType: Joi.string()
    .valid('OVERDUE', 'DAMAGED', 'LOST', 'OTHER')
    .required(),
  amount: Joi.number().min(0).required(),
  description: Joi.string()
});

exports.payFineSchema = Joi.object().keys({
  paidAmount: Joi.number().min(0).required(),
  paymentMethod: Joi.string()
    .valid('CASH', 'ONLINE', 'BANK_TRANSFER', 'CHEQUE', 'OTHER')
    .required()
});

exports.fineFilterSchema = Joi.object().keys({
  status: Joi.string().valid('PENDING', 'PAID', 'PARTIAL', 'WAIVED', 'CANCELLED'),
  userId: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

module.exports = exports;
