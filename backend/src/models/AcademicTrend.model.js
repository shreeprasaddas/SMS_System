/**
 * AcademicTrend Model
 * Historical academic performance trends, predictions, and comparative analysis
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const academicTrendSchema = new mongoose.Schema(
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
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    analysisStartDate: Date,
    analysisEndDate: Date,
    periodType: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'SEMESTER', 'ANNUAL'],
      required: true,
    },
    historicalPerformance: [
      {
        periodName: String,
        periodDate: Date,
        averageScore: Number,
        averagePercentage: Number,
        gradePoint: Number,
        subjectWisePerformance: [
          {
            subjectId: mongoose.Schema.Types.ObjectId,
            subjectName: String,
            score: Number,
            percentage: Number,
            grade: String,
            trend: {
              type: String,
              enum: ['UP', 'DOWN', 'STABLE'],
            },
          },
        ],
        classRank: Number,
        totalStudents: Number,
        percentileRank: Number,
      },
    ],
    trendMetrics: {
      overallTrend: {
        type: String,
        enum: ['IMPROVING', 'DECLINING', 'STABLE'],
        required: true,
      },
      trendStrength: Number, // 0-100
      consistencyIndex: Number, // How consistent is the trend
      volatilityIndex: Number, // Score fluctuation
      averageGrowthRate: Number, // Percentage points per period
      cumulativeImprovement: Number, // Total improvement over time
    },
    subjectSpecificTrends: [
      {
        subjectId: mongoose.Schema.Types.ObjectId,
        subjectName: String,
        trend: {
          type: String,
          enum: ['IMPROVING', 'DECLINING', 'STABLE'],
        },
        strengthAreas: [String],
        weaknessAreas: [String],
        predictedFuturePerformance: Number,
        recommendations: [String],
      },
    ],
    predictiveAnalysis: {
      predictedScoreNextPeriod: Number,
      predictedPercentageNextPeriod: Number,
      predictedGradeNextPeriod: String,
      confidenceLevel: Number, // 0-100
      predictionModel: String,
      factorsInfluencingPrediction: [String],
      riskOfGradeDropBelow: {
        isAtRisk: Boolean,
        riskPercentage: Number,
        criticalSubjects: [String],
      },
    },
    seasonalPatterns: [
      {
        season: String,
        averagePerformance: Number,
        patterns: String,
        seasonalFactors: [String],
      },
    ],
    comparativeAnalysis: {
      vsClassAverage: {
        currentDifference: Number,
        trend: {
          type: String,
          enum: ['WIDENING_GAP', 'NARROWING_GAP', 'STABLE_GAP'],
        },
        historicalComparison: [
          {
            period: String,
            studentScore: Number,
            classAverage: Number,
            difference: Number,
          },
        ],
      },
      vsSchoolAverage: {
        currentDifference: Number,
        trend: {
          type: String,
          enum: ['WIDENING_GAP', 'NARROWING_GAP', 'STABLE_GAP'],
        },
      },
      vsPeerGroup: {
        peerGroupRank: Number,
        peerGroupSize: Number,
        percentageAbovePeerAverage: Number,
      },
    },
    longitudinalAnalysis: {
      numberOfPeriodsAnalyzed: Number,
      longestImprovingStreak: Number, // Number of periods
      longestDecliningStreak: Number,
      averageRecoveryTime: Number, // Days to recover from low performance
      volatilityTrend: {
        type: String,
        enum: ['MORE_VOLATILE', 'STABLE', 'LESS_VOLATILE'],
      },
    },
    performanceTargets: [
      {
        targetPeriod: String,
        targetScore: Number,
        targetPercentage: Number,
        targetGrade: String,
        targetClassRank: Number,
        progressTowardsTarget: Number, // Percentage
        isAchievable: Boolean,
        timelineToAchieve: Number, // Number of periods
      },
    ],
    learningVelocity: {
      definition: 'Rate of improvement in performance',
      currentVelocity: Number, // Points per period
      trend: {
        type: String,
        enum: ['ACCELERATING', 'CONSTANT', 'DECELERATING'],
      },
      momentum: {
        type: String,
        enum: ['STRONG_POSITIVE', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'STRONG_NEGATIVE'],
      },
    },
    interventionImpact: [
      {
        interventionId: mongoose.Schema.Types.ObjectId,
        interventionPeriod: String,
        performanceBeforeIntervention: Number,
        performanceAfterIntervention: Number,
        improvementPercentage: Number,
        sustainability: {
          type: String,
          enum: ['SUSTAINED', 'DECLINING', 'TEMPORARY'],
        },
      },
    ],
    keyInsights: {
      summary: String,
      strengths: [String],
      concerns: [String],
      opportunities: [String],
      recommendations: [String],
      actionItems: [
        {
          item: String,
          priority: {
            type: String,
            enum: ['HIGH', 'MEDIUM', 'LOW'],
          },
          owner: String,
          deadline: Date,
        },
      ],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED', 'SUPERSEDED'],
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
academicTrendSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('ATREND', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
academicTrendSchema.index({ schoolId, studentId: 1 });
academicTrendSchema.index({ schoolId, 'trendMetrics.overallTrend': 1 });
academicTrendSchema.index({ code: 1, schoolId: 1 });

// Virtual: Trend health assessment
academicTrendSchema.virtual('trendHealthAssessment').get(function () {
  const metrics = this.trendMetrics;
  if (!metrics) return 'UNKNOWN';
  if (metrics.overallTrend === 'IMPROVING' && metrics.trendStrength > 70) return 'EXCELLENT';
  if (metrics.overallTrend === 'IMPROVING') return 'GOOD';
  if (metrics.overallTrend === 'STABLE' && metrics.trendStrength > 50) return 'STABLE';
  if (metrics.overallTrend === 'DECLINING' && metrics.volatilityIndex > 50) return 'CONCERNING';
  return 'CRITICAL';
});

// Virtual: Prediction accuracy
academicTrendSchema.virtual('predictionReliability').get(function () {
  const confidence = this.predictiveAnalysis?.confidenceLevel;
  if (!confidence) return 'UNKNOWN';
  if (confidence >= 80) return 'VERY_RELIABLE';
  if (confidence >= 70) return 'RELIABLE';
  if (confidence >= 60) return 'MODERATELY_RELIABLE';
  return 'UNRELIABLE';
});

module.exports = mongoose.model('AcademicTrend', academicTrendSchema);
