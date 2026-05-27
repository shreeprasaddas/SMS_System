/**
 * GeneratedReport Model
 * Actual report instances with data, exports, and access tracking
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const generatedReportSchema = new mongoose.Schema(
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
      index: true,
    },
    reportName: String,
    reportType: String,
    generationDetails: {
      generatedDate: {
        type: Date,
        default: Date.now,
      },
      generatedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      generationDurationSeconds: Number,
      dataFetchTime: Number,
      processingTime: Number,
      renderingTime: Number,
    },
    dataSnapshot: {
      totalRecords: Number,
      filteredRecords: Number,
      aggregatedData: mongoose.Schema.Types.Mixed,
      summaryStatistics: {
        totalCount: Number,
        averageValue: Number,
        minValue: Number,
        maxValue: Number,
        medianValue: Number,
      },
    },
    reportData: [mongoose.Schema.Types.Mixed], // Raw report data rows
    exportFormats: [
      {
        format: {
          type: String,
          enum: ['PDF', 'EXCEL', 'CSV', 'JSON', 'HTML'],
        },
        fileUrl: String,
        fileName: String,
        fileSize: Number,
        generatedDate: Date,
        expiryDate: Date,
      },
    ],
    reportMetadata: {
      dateRange: {
        startDate: Date,
        endDate: Date,
      },
      appliedFilters: [
        {
          fieldName: String,
          operator: String,
          value: mongoose.Schema.Types.Mixed,
        },
      ],
      appliedGrouping: [String],
      appliedSorting: mongoose.Schema.Types.Mixed,
      totalPages: Number,
      rowsPerPage: Number,
    },
    distributionDetails: [
      {
        distributedDate: Date,
        distributedTo: {
          userId: mongoose.Schema.Types.ObjectId,
          userEmail: String,
          userRole: String,
        },
        distributionMethod: {
          type: String,
          enum: ['EMAIL', 'PORTAL', 'DOWNLOAD', 'PRINT'],
        },
        acknowledgmentStatus: {
          type: String,
          enum: ['PENDING', 'ACKNOWLEDGED', 'VIEWED', 'DOWNLOADED'],
        },
        viewedDate: Date,
      },
    ],
    accessLog: [
      {
        accessedByUserId: mongoose.Schema.Types.ObjectId,
        accessedDate: Date,
        accessType: {
          type: String,
          enum: ['VIEWED', 'DOWNLOADED', 'EXPORTED', 'SHARED', 'PRINTED'],
        },
        deviceInfo: String,
        ipAddress: String,
      },
    ],
    sharingDetails: {
      isPublic: Boolean,
      publicAccessCode: String,
      sharedWith: [
        {
          userId: mongoose.Schema.Types.ObjectId,
          userRole: String,
          accessLevel: {
            type: String,
            enum: ['VIEW', 'DOWNLOAD', 'EXPORT', 'SHARE'],
          },
          sharedDate: Date,
          expiryDate: Date,
        },
      ],
    },
    performance: {
      queryExecutionTime: Number,
      dataTransformationTime: Number,
      renderingTime: Number,
      totalGenerationTime: Number,
      cacheHit: Boolean,
      resourceUsage: {
        cpuPercent: Number,
        memoryMB: Number,
      },
    },
    status: {
      type: String,
      enum: ['GENERATING', 'READY', 'ARCHIVED', 'FAILED', 'EXPIRED'],
      default: 'READY',
      index: true,
    },
    errorDetails: {
      hasError: Boolean,
      errorCode: String,
      errorMessage: String,
      stackTrace: String,
    },
    retention: {
      expiryDate: Date,
      autoDelete: Boolean,
      archiveAfterDays: Number,
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
generatedReportSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('GREP', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
generatedReportSchema.index({ schoolId: 1, status: 1 });
generatedReportSchema.index({ reportId: 1, schoolId: 1 });
generatedReportSchema.index({ code: 1, schoolId: 1 });
generatedReportSchema.index({ 'generationDetails.generatedDate': -1, schoolId: 1 });

// Virtual: Total downloads
generatedReportSchema.virtual('totalDownloads').get(function () {
  return (this.accessLog || []).filter((log) => log.accessType === 'DOWNLOADED').length;
});

// Virtual: Total views
generatedReportSchema.virtual('totalViews').get(function () {
  return (this.accessLog || []).filter((log) => log.accessType === 'VIEWED').length;
});

// Virtual: Days since generation
generatedReportSchema.virtual('daysSinceGeneration').get(function () {
  const now = new Date();
  const timeDiff = now - this.generationDetails?.generatedDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Is expired
generatedReportSchema.virtual('isExpired').get(function () {
  if (!this.retention?.expiryDate) return false;
  return new Date() > this.retention.expiryDate;
});

module.exports = mongoose.model('GeneratedReport', generatedReportSchema);
