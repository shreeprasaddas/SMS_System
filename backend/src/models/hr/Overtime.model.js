/**
 * Overtime Model
 * Overtime and additional working hours tracking
 */

const mongoose = require('mongoose');

const overtimeSchema = new mongoose.Schema(
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
    workDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    hoursWorked: {
      type: Number,
      required: true,
      min: 0.5,
    },
    reason: {
      type: String,
      enum: ['EVENT', 'EXAM_DUTY', 'ADMINISTRATIVE', 'EMERGENCY', 'OTHER'],
      required: true,
    },
    description: String,
    overtimeType: {
      type: String,
      enum: ['PAID', 'COMPENSATORY'],
      default: 'COMPENSATORY',
    },
    ratePerHour: Number,
    totalOvertimeAmount: {
      type: Number,
      default: 0,
    },
    approvedHours: Number,
    status: {
      type: String,
      enum: ['SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'],
      default: 'SUBMITTED',
    },
    approvedDate: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: String,
    remarks: String,
    attachments: [
      {
        url: String,
        fileName: String,
        uploadedDate: Date,
        _id: false,
      },
    ],
    payrollMonth: String,
    payrollYear: Number,
    submittedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'overtimes',
  }
);

// Indexes
overtimeSchema.index({ schoolId: 1, employee: 1, workDate: 1 });
overtimeSchema.index({ schoolId: 1, status: 1 });
overtimeSchema.index({ schoolId: 1, payrollMonth: 1, payrollYear: 1 });

module.exports = mongoose.model('Overtime', overtimeSchema);
