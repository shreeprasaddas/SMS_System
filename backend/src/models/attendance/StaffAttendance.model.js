/**
 * StaffAttendance Model
 * Staff/teacher daily attendance records with time tracking
 */

const mongoose = require('mongoose');
const { ATTENDANCE_STATUS } = require('../../../../shared/constants/status.js');

const staffAttendanceSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Staff member is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
      index: true,
    },
    timeIn: {
      type: Date,
    },
    timeOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      default: ATTENDANCE_STATUS.PRESENT,
      required: true,
    },
    workingHours: {
      type: Number,
      default: 0,
      min: 0,
      max: 24,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'staff_attendances',
    timestamps: false,
  }
);

// Compound indexes for efficient queries
staffAttendanceSchema.index({ schoolId: 1, user: 1, date: 1 }, { unique: true });
staffAttendanceSchema.index({ schoolId: 1, status: 1 });
staffAttendanceSchema.index({ schoolId: 1, approvalStatus: 1 });

// Pre-save middleware to update updatedAt and calculate working hours
staffAttendanceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  if (this.timeIn && this.timeOut) {
    const diffMs = this.timeOut - this.timeIn;
    this.workingHours = Math.round(diffMs / (1000 * 60 * 60) * 100) / 100;
  }

  next();
});

module.exports = mongoose.model('StaffAttendance', staffAttendanceSchema);
