/**
 * ReportSchedule Model
 * Automated report generation schedules and recurring reports
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const reportScheduleSchema = new mongoose.Schema(
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
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
    },
    scheduleName: {
      type: String,
      required: true,
      trim: true,
    },
    scheduleDescription: String,
    frequency: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'CUSTOM', 'ONCE'],
      required: true,
    },
    schedulePattern: {
      dayOfWeek: [Number], // 0-6 (Sun-Sat) for weekly
      dayOfMonth: Number, // 1-31 for monthly
      monthOfYear: Number, // 1-12 for annually
      time: String, // HH:MM format
      timezone: String,
      customCron: String,
    },
    executionSettings: {
      startDate: Date,
      endDate: Date,
      maxExecutions: Number,
      isActive: {
        type: Boolean,
        default: true,
      },
      retryOnFailure: Boolean,
      maxRetries: Number,
      timeoutMinutes: Number,
    },
    deliverySettings: {
      deliveryMethods: [
        {
          method: {
            type: String,
            enum: ['EMAIL', 'SMS', 'PORTAL', 'DATABASE', 'CLOUD_STORAGE', 'FTP'],
          },
          recipients: [
            {
              recipientId: mongoose.Schema.Types.ObjectId,
              recipientType: {
                type: String,
                enum: ['USER', 'ROLE', 'GROUP', 'EMAIL'],
              },
              recipientValue: String,
              isNotifiable: Boolean,
            },
          ],
          attachmentFormat: {
            type: String,
            enum: ['PDF', 'EXCEL', 'CSV', 'JSON', 'HTML'],
          },
        },
      ],
      emailTemplate: String,
      includeAttachment: Boolean,
    },
    filterParameters: [
      {
        parameterName: String,
        parameterValue: mongoose.Schema.Types.Mixed,
        isVariableParameter: Boolean,
        variableType: {
          type: String,
          enum: ['DATE_RANGE', 'DYNAMIC', 'STATIC'],
        },
      },
    ],
    notificationSettings: {
      notifyOnSuccess: Boolean,
      notifyOnFailure: Boolean,
      notifyRecipients: [String],
    },
    executionHistory: [
      {
        executionId: mongoose.Schema.Types.ObjectId,
        executionDate: Date,
        startTime: Date,
        endTime: Date,
        status: {
          type: String,
          enum: ['SUCCESS', 'FAILED', 'PARTIAL', 'PENDING', 'RUNNING'],
        },
        recordsProcessed: Number,
        errorMessage: String,
        reportUrl: String,
      },
    ],
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastModifiedBy: mongoose.Schema.Types.ObjectId,
    lastExecutionDate: Date,
    nextExecutionDate: Date,
    totalExecutions: {
      type: Number,
      default: 0,
    },
    successfulExecutions: {
      type: Number,
      default: 0,
    },
    failedExecutions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED', 'PAUSED'],
      default: 'ACTIVE',
      index: true,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware for code generation
reportScheduleSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('RSCH', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
reportScheduleSchema.index({ schoolId: 1, status: 1 });
reportScheduleSchema.index({ reportId: 1, schoolId: 1 });
reportScheduleSchema.index({ code: 1, schoolId: 1 });
reportScheduleSchema.index({ nextExecutionDate: 1, schoolId: 1 });

// Virtual: Success rate
reportScheduleSchema.virtual('successRate').get(function () {
  if (this.totalExecutions === 0) return 0;
  return Math.round((this.successfulExecutions / this.totalExecutions) * 100);
});

// Virtual: Failure rate
reportScheduleSchema.virtual('failureRate').get(function () {
  if (this.totalExecutions === 0) return 0;
  return Math.round((this.failedExecutions / this.totalExecutions) * 100);
});

// Virtual: Hours until next execution
reportScheduleSchema.virtual('hoursUntilNextExecution').get(function () {
  if (!this.nextExecutionDate) return null;
  const now = new Date();
  const timeDiff = this.nextExecutionDate - now;
  return Math.ceil(timeDiff / (1000 * 60 * 60));
});

module.exports = mongoose.model('ReportSchedule', reportScheduleSchema);
