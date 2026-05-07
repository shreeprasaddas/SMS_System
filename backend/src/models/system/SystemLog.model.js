/**
 * SystemLog Model
 * Represents system activity logs and audit trails
 */

const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'UPLOAD', 'DOWNLOAD', 'ACCESS', 'FAILED_LOGIN', 'PERMISSION_DENIED', 'SYSTEM_ERROR'],
    required: true,
  },
  module: {
    type: String,
    enum: ['STUDENT', 'TEACHER', 'CLASS', 'EXAM', 'ASSIGNMENT', 'ATTENDANCE', 'GRADE', 'FEE', 'HR', 'PAYROLL', 'LIBRARY', 'TRANSPORT', 'HOSTEL', 'COMMUNICATION', 'REPORTS', 'ADMIN', 'SYSTEM'],
    required: true,
  },
  entityType: {
    type: String,
    trim: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  entityName: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  ipAddress: {
    type: String,
    trim: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PARTIAL'],
    default: 'SUCCESS',
  },
  errorMessage: {
    type: String,
    trim: true,
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  duration: {
    type: Number, // in milliseconds
    min: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
systemLogSchema.index({ schoolId: 1, timestamp: -1 });
systemLogSchema.index({ schoolId: 1, userId: 1, timestamp: -1 });
systemLogSchema.index({ schoolId: 1, action: 1 });
systemLogSchema.index({ schoolId: 1, module: 1 });
systemLogSchema.index({ schoolId: 1, status: 1 });
systemLogSchema.index({ schoolId: 1, entityId: 1 });

module.exports = mongoose.model('SystemLog', systemLogSchema);
