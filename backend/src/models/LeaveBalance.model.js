/**
 * Leave Balance Model
 * Schema for tracking leave balances per employee/student per year
 */

const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userRole: {
      type: String,
      enum: ['TEACHER', 'STAFF', 'STUDENT', 'PRINCIPAL', 'ADMIN'],
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      index: true,
    },
    leaveTypeCode: {
      type: String,
      enum: ['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'STUDY', 'SABBATICAL', 'EMERGENCY', 'HALF_DAY', 'SPECIAL'],
      required: true,
      index: true,
    },
    leaveTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
    },
    allocatedDays: {
      type: Number,
      required: true,
    },
    usedDays: {
      type: Number,
      default: 0,
    },
    remainingDays: {
      type: Number,
    },
    pendingApprovalDays: {
      type: Number,
      default: 0,
    },
    carriedForwardDays: {
      type: Number,
      default: 0,
    },
    encashedDays: {
      type: Number,
      default: 0,
    },
    forfeittedDays: {
      type: Number,
      default: 0,
    },
    balanceCalculationDate: {
      type: Date,
      default: () => new Date(),
    },
    allocationDate: {
      type: Date,
      default: () => new Date(),
    },
    leaveUtilization: {
      jan: { type: Number, default: 0 },
      feb: { type: Number, default: 0 },
      mar: { type: Number, default: 0 },
      apr: { type: Number, default: 0 },
      may: { type: Number, default: 0 },
      jun: { type: Number, default: 0 },
      jul: { type: Number, default: 0 },
      aug: { type: Number, default: 0 },
      sep: { type: Number, default: 0 },
      oct: { type: Number, default: 0 },
      nov: { type: Number, default: 0 },
      dec: { type: Number, default: 0 },
    },
    history: [
      {
        leaveId: mongoose.Schema.Types.ObjectId,
        daysUsed: Number,
        fromDate: Date,
        toDate: Date,
        status: String,
        deductionDate: Date,
      },
    ],
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: () => new Date() },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate code
leaveBalanceSchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('LEAVB', this.schoolId);
  }
  // Calculate remaining days
  this.remainingDays = this.allocatedDays + this.carriedForwardDays - this.usedDays - this.forfeittedDays - this.encashedDays;
  next();
});

// Virtual: utilization percentage
leaveBalanceSchema.virtual('utilizationPercentage').get(function () {
  if (this.allocatedDays === 0) return 0;
  return ((this.usedDays / this.allocatedDays) * 100).toFixed(2);
});

// Virtual: is balance critical
leaveBalanceSchema.virtual('isCritical').get(function () {
  return this.remainingDays <= 2;
});

// Virtual: total available days
leaveBalanceSchema.virtual('totalAvailableDays').get(function () {
  return this.allocatedDays + this.carriedForwardDays;
});

// Compound index
leaveBalanceSchema.index({ schoolId: 1, userId: 1 });
leaveBalanceSchema.index({ schoolId: 1, academicYear: 1 });
leaveBalanceSchema.index({ userId: 1, leaveTypeCode: 1, academicYear: 1 });

leaveBalanceSchema.set('toJSON', { virtuals: true });
leaveBalanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
