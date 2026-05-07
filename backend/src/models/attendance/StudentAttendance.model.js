/**
 * StudentAttendance Model
 * Student daily attendance records
 */

const mongoose = require('mongoose');
const { ATTENDANCE_STATUS } = require('../../../../shared/constants/status.js');

const studentAttendanceSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
      index: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: [true, 'Academic year is required'],
    },
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      default: ATTENDANCE_STATUS.PRESENT,
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked by teacher is required'],
    },
    isSync: {
      type: Boolean,
      default: false,
      index: true,
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
    collection: 'student_attendances',
    timestamps: false,
  }
);

// Compound index for efficient queries
studentAttendanceSchema.index({ schoolId: 1, student: 1, academicYear: 1 });
studentAttendanceSchema.index({ schoolId: 1, class: 1, date: 1 });
studentAttendanceSchema.index({ schoolId: 1, academicYear: 1, status: 1 });

// Pre-save middleware to update updatedAt
studentAttendanceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for calculating attendance percentage
studentAttendanceSchema.virtual('attendancePercentage').get(function () {
  if (!this._attendanceStats) return 0;
  const total = this._attendanceStats.totalDays;
  const present = this._attendanceStats.presentDays + this._attendanceStats.halfDayDays * 0.5;
  return total > 0 ? Math.round((present / total) * 100) : 0;
});

module.exports = mongoose.model('StudentAttendance', studentAttendanceSchema);
