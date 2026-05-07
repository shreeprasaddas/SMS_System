/**
 * LeaveBalance Model
 * Employee leave balance tracking
 */

const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    totalAllottedDays: {
      type: Number,
      required: true,
    },
    usedDays: {
      type: Number,
      default: 0,
    },
    approvedDays: {
      type: Number,
      default: 0,
    },
    pendingDays: {
      type: Number,
      default: 0,
    },
    balanceDays: Number,
    carryForwardDays: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'leaveBalances',
  }
);

// Indexes
leaveBalanceSchema.index({ schoolId: 1, employee: 1, leaveType: 1, academicYear: 1 });
leaveBalanceSchema.index({ schoolId: 1, employee: 1, academicYear: 1 });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
