/**
 * AnalyticsReport Model
 * Comprehensive analytics reports including predictions and recommendations
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const analyticsReportSchema = new mongoose.Schema(
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
    reportType: {
      type: String,
      enum: [
        'STUDENT_PERFORMANCE_SUMMARY',
        'LEARNING_ANALYTICS_REPORT',
        'ACADEMIC_TREND_ANALYSIS',
        'COMPARATIVE_ANALYSIS',
        'PREDICTION_REPORT',
        'INTERVENTION_EFFECTIVENESS',
        'CLASS_ANALYTICS',
        'SUBJECT_ANALYTICS',
        'DISTRICT_ANALYTICS',
      ],
      required: true,
      index: true,
    },
    reportScope: {
      scopeType: {
        type: String,
        enum: ['INDIVIDUAL_STUDENT', 'CLASS', 'GRADE', 'SUBJECT', 'SCHOOL', 'DISTRICT'],
        required: true,
      },
      scopeId: mongoose.Schema.Types.ObjectId,
      scopeName: String,
    },
    reportPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      academicYear: {
        type: String,
        required: true,
      },
      semester: String,
    },
    generationDetails: {
      generatedDate: {
        type: Date,
        default: Date.now,
      },
      generatedByUserId: mongoose.Schema.Types.ObjectId,
      dataSourcesUsed: [String],
      lastUpdatedDate: Date,
      updateFrequency: {
        type: String,
        enum: ['REAL_TIME', 'DAILY', 'WEEKLY', 'MONTHLY', 'MANUAL'],
      },
      processingTimeSeconds: Number,
      recordsProcessed: Number,
    },
    summaryMetrics: {
      keyPerformanceIndicators: [
        {
          kpiName: String,
          kpiValue: Number,
          targetValue: Number,
          status: {
            type: String,
            enum: ['ON_TRACK', 'AT_RISK', 'EXCEEDED'],
          },
          percentageToTarget: Number,
        },
      ],
      topPerformers: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          score: Number,
          grade: String,
        },
      ],
      bottomPerformers: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          score: Number,
          grade: String,
        },
      ],
      averagePerformance: Number,
      medianPerformance: Number,
      standardDeviation: Number,
    },
    detailedAnalysis: {
      academicSection: {
        overallPerformance: String,
        strengths: [String],
        weaknesses: [String],
        trends: [String],
      },
      behavioralSection: {
        attendanceAnalysis: String,
        engagementAnalysis: String,
        conductAnalysis: String,
      },
      skillDevelopmentSection: {
        developedSkills: [String],
        skillsInProgress: [String],
        skillGaps: [String],
      },
    },
    predictions: {
      futurePerformancePrediction: {
        nextPeriodAverageScore: Number,
        nextPeriodAverageGrade: String,
        predictionConfidence: Number,
        factorsAffectingPrediction: [String],
      },
      riskPredictions: [
        {
          riskType: {
            type: String,
            enum: ['ACADEMIC_FAILURE', 'DROPOUT', 'BEHAVIORAL_ISSUE', 'ENGAGEMENT_DECLINE'],
          },
          atRiskCount: Number,
          percentageAtRisk: Number,
          riskFactors: [String],
        },
      ],
      opportunityAnalysis: [
        {
          opportunityType: String,
          studentCount: Number,
          description: String,
          actionable: Boolean,
        },
      ],
    },
    recommendations: {
      studentLevelRecommendations: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          recommendationType: {
            type: String,
            enum: ['ENRICHMENT', 'REMEDIAL', 'INTERVENTION', 'MONITORING', 'COUNSELING'],
          },
          specificRecommendations: [String],
          priority: {
            type: String,
            enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
          },
          expectedOutcome: String,
        },
      ],
      teacherRecommendations: [
        {
          teacherName: String,
          subjectId: mongoose.Schema.Types.ObjectId,
          recommendations: [String],
          implementationStrategy: String,
        },
      ],
      parentalEngagementRecommendations: [String],
      schoolLevelRecommendations: [String],
    },
    actionItems: [
      {
        actionId: mongoose.Schema.Types.ObjectId,
        actionDescription: String,
        actionOwner: String,
        targetDate: Date,
        priority: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
        expectedImpact: String,
        status: {
          type: String,
          enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        },
      },
    ],
    visualizations: {
      chartTypes: [String], // pie, bar, line, scatter, etc
      chartUrls: [String],
      infographicUrl: String,
    },
    distribution: {
      distributedTo: [
        {
          userId: mongoose.Schema.Types.ObjectId,
          userRole: String,
          distributionDate: Date,
          viewedDate: Date,
          downloadedDate: Date,
        },
      ],
      accessLevel: {
        type: String,
        enum: ['CONFIDENTIAL', 'RESTRICTED', 'INTERNAL', 'PUBLIC'],
      },
      expiryDate: Date,
    },
    qualityMetrics: {
      dataAccuracy: Number, // 0-100
      completeness: Number,
      relevance: Number,
      timeliness: Number,
      overallQualityScore: Number,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
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
analyticsReportSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('AREPORT', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
analyticsReportSchema.index({ schoolId: 1, reportType: 1 });
analyticsReportSchema.index({ schoolId: 1, 'reportPeriod.academicYear': 1 });
analyticsReportSchema.index({ code: 1, schoolId: 1 });
analyticsReportSchema.index({ createdAt: -1, schoolId: 1 });

// Virtual: Report age in days
analyticsReportSchema.virtual('reportAgeDays').get(function () {
  if (!this.generationDetails?.generatedDate) return null;
  const now = new Date();
  const timeDiff = now - this.generationDetails.generatedDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Is current/recent
analyticsReportSchema.virtual('isCurrent').get(function () {
  return this.reportAgeDays <= 7;
});

// Virtual: Quality assessment
analyticsReportSchema.virtual('qualityAssessment').get(function () {
  const score = this.qualityMetrics?.overallQualityScore || 0;
  if (score >= 90) return 'EXCELLENT';
  if (score >= 80) return 'GOOD';
  if (score >= 70) return 'ACCEPTABLE';
  if (score >= 60) return 'NEEDS_IMPROVEMENT';
  return 'POOR';
});

module.exports = mongoose.model('AnalyticsReport', analyticsReportSchema);
