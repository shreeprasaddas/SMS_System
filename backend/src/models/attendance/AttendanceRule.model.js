/**
 * AttendanceRule Model
 * School-level attendance policy rules
 */

const mongoose = require('mongoose');

const attendanceRuleSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Rule name is required'],
      trim: true,
      maxlength: [100, 'Rule name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    minimumAttendancePercentage: {
      type: Number,
      default: 75,
      min: [0, 'Minimum attendance cannot be less than 0%'],
      max: [100, 'Minimum attendance cannot exceed 100%'],
      required: true,
    },
    lateMarkAfter: {
      type: Number,
      default: 15,
      min: [0, 'Late mark minutes cannot be negative'],
      required: true,
    },
    autoMarkAbsentAfter: {
      type: Number,
      default: 4,
      min: [1, 'Auto mark absent hours must be at least 1'],
      required: true,
    },
    halfDayMarkAfter: {
      type: Number,
      default: 180,
      min: [0, 'Half day mark minutes cannot be negative'],
      required: true,
    },
    allowHolidayMarking: {
      type: Boolean,
      default: true,
    },
    allowLeaveMarking: {
      type: Boolean,
      default: true,
    },
    sendNotifications: {
      type: Boolean,
      default: true,
    },
    notificationThreshold: {
      type: Number,
      default: 20,
      min: [0, 'Threshold cannot be negative'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    applicableTo: {
      type: [String],
      enum: ['STUDENTS', 'TEACHERS', 'STAFF'],
      default: ['STUDENTS'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'attendance_rules',
    timestamps: false,
  }
);

// Ensure only one active rule per school
attendanceRuleSchema.index({ schoolId: 1, status: 1 });

// Pre-save middleware to update updatedAt
attendanceRuleSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AttendanceRule', attendanceRuleSchema);
