const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HRStaff',
      required: true
    },
    staffName: String,
    designation: String,
    attendanceDate: {
      type: Date,
      required: true
    },
    attendanceStatus: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'EARLY_LEAVE', 'ON_LEAVE', 'WEEKEND', 'HOLIDAY'],
      required: true
    },
    checkInTime: Date,
    checkOutTime: Date,
    workingHours: {
      type: Number,
      min: 0
    },
    department: String,
    remarks: String,
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    markedByName: String,
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    auditLog: [{
      action: String,
      performedBy: mongoose.Schema.Types.ObjectId,
      timestamp: {
        type: Date,
        default: Date.now
      },
      changes: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Pre-save middleware: auto-generate code
staffAttendanceSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('StaffAttendance').countDocuments({ schoolId: this.schoolId });
    this.code = `ATTD-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
staffAttendanceSchema.index({ schoolId: 1, staffId: 1, attendanceDate: 1 });
staffAttendanceSchema.index({ schoolId: 1, attendanceStatus: 1 });
staffAttendanceSchema.index({ schoolId: 1, attendanceDate: 1 });

module.exports = mongoose.model('StaffAttendance', staffAttendanceSchema);
