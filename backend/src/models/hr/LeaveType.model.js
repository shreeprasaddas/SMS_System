/**
 * LeaveType Model
 * Configuration for different types of leaves
 */

const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: String,
    leaveCategory: {
      type: String,
      enum: ['PAID', 'UNPAID', 'COMPENSATORY', 'SPECIAL'],
      required: true,
    },
    maxDaysPerYear: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDaysPerRequest: {
      type: Number,
      default: 30,
    },
    minGapBetweenRequests: {
      type: Number,
      default: 0,
    },
    requiresApproval: {
      type: Boolean,
      default: true,
    },
    applicableToDesignations: [String],
    carryForwardAllowed: {
      type: Boolean,
      default: false,
    },
    carryForwardDays: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'leaveTypes',
  }
);

// Indexes
leaveTypeSchema.index({ schoolId: 1, code: 1, unique: true });
leaveTypeSchema.index({ schoolId: 1, status: 1 });

module.exports = mongoose.model('LeaveType', leaveTypeSchema);
