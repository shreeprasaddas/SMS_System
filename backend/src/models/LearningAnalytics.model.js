/**
 * LearningAnalytics Model
 * Student learning patterns, engagement, study habits, and behavioral analytics
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const learningAnalyticsSchema = new mongoose.Schema(
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
    academicYear: {
      type: String,
      required: true,
      index: true,
    },
    analysisDate: {
      type: Date,
      default: Date.now,
    },
    studyPatterns: {
      averageStudyHoursPerDay: Number,
      preferredStudyTime: {
        type: String,
        enum: ['EARLY_MORNING', 'MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'],
      },
      studySessionFrequency: {
        type: String,
        enum: ['DAILY', 'ALTERNATE_DAYS', 'WEEKLY', 'IRREGULAR'],
      },
      averageSessionDuration: Number, // in minutes
      consistencyScore: Number, // 0-100
      studyBreakPatterns: String,
      subjectsPreferredOrder: [String],
      learningResourcesUsed: [
        {
          resourceType: {
            type: String,
            enum: ['TEXTBOOK', 'NOTES', 'ONLINE_VIDEOS', 'PRACTICE_PAPERS', 'COACHING_MATERIALS', 'PEERS'],
          },
          frequency: {
            type: String,
            enum: ['ALWAYS', 'OFTEN', 'SOMETIMES', 'RARELY', 'NEVER'],
          },
        },
      ],
    },
    engagementMetrics: {
      classAttendancePercentage: Number,
      participationScore: Number, // 0-100
      assignmentSubmissionRate: Number,
      onTimeSubmissionPercentage: Number,
      homeworkCompletionRate: Number,
      labWorkEngagement: Number,
      projectInvolvement: {
        type: String,
        enum: ['ACTIVE', 'PASSIVE', 'COOPERATIVE', 'NON_PARTICIPATING'],
      },
      classActivityParticipation: Number,
      subjectEngagementBySubject: [
        {
          subjectId: mongoose.Schema.Types.ObjectId,
          engagementScore: Number,
          participationLevel: {
            type: String,
            enum: ['VERY_HIGH', 'HIGH', 'MODERATE', 'LOW', 'VERY_LOW'],
          },
        },
      ],
    },
    learningBehavior: {
      dominantLearningStyle: {
        type: String,
        enum: ['VISUAL', 'AUDITORY', 'READING_WRITING', 'KINESTHETIC', 'MIXED'],
      },
      paceOfLearning: {
        type: String,
        enum: ['FAST', 'MODERATE', 'SLOW'],
      },
      conceptRetentionScore: Number,
      applicationAbility: Number,
      problemSolvingApproach: {
        type: String,
        enum: ['SYSTEMATIC', 'INTUITIVE', 'ANALYTICAL', 'CREATIVE'],
      },
      collaborationPreference: {
        type: String,
        enum: ['INDEPENDENT', 'SMALL_GROUP', 'LARGE_GROUP', 'FLEXIBLE'],
      },
      feedbackReceptiveness: {
        type: String,
        enum: ['VERY_RECEPTIVE', 'RECEPTIVE', 'MODERATE', 'RESISTANT'],
      },
    },
    progressTracking: {
      overallProgressTrend: {
        type: String,
        enum: ['IMPROVING', 'STABLE', 'DECLINING'],
      },
      monthlyProgressData: [
        {
          month: String,
          averageScore: Number,
          subjectsImproved: Number,
          subjectsDeclined: Number,
          strengthsGained: [String],
          weknessesIdentified: [String],
        },
      ],
      skillDevelopmentAreas: [
        {
          skillName: String,
          currentProficiency: Number,
          targetProficiency: Number,
          developmentPlan: String,
        },
      ],
      strongSubjects: [String],
      weakSubjects: [String],
      improvementRate: Number, // percentage per month
    },
    risksAndChallenges: {
      identifiedRisks: [
        {
          riskType: {
            type: String,
            enum: ['ACADEMIC', 'BEHAVIORAL', 'ATTENDANCE', 'ENGAGEMENT', 'EMOTIONAL', 'SOCIO_ECONOMIC'],
          },
          riskLevel: {
            type: String,
            enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
          },
          description: String,
          detectedDate: Date,
          interventionRequired: Boolean,
        },
      ],
      dropoutRisk: {
        isAtRisk: Boolean,
        riskScore: Number, // 0-100
        riskFactors: [String],
      },
      emotionalWellbeing: {
        stressLevel: {
          type: String,
          enum: ['HIGH', 'MODERATE', 'LOW'],
        },
        motivationTrend: {
          type: String,
          enum: ['INCREASING', 'STABLE', 'DECREASING'],
        },
        confidenceLevel: {
          type: String,
          enum: ['VERY_HIGH', 'HIGH', 'MODERATE', 'LOW', 'VERY_LOW'],
        },
      },
    },
    interventionHistory: [
      {
        interventionId: mongoose.Schema.Types.ObjectId,
        interventionType: {
          type: String,
          enum: ['REMEDIAL', 'ENRICHMENT', 'COUNSELING', 'MENTORING', 'TUTORING', 'PARENT_ENGAGEMENT'],
        },
        startDate: Date,
        endDate: Date,
        status: {
          type: String,
          enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DISCONTINUED'],
        },
        outcome: String,
        effectiveness: Number, // 0-100
      },
    ],
    recommendations: [
      {
        recommendationType: String,
        description: String,
        priority: {
          type: String,
          enum: ['HIGH', 'MEDIUM', 'LOW'],
        },
        targetDate: Date,
        status: {
          type: String,
          enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        },
      },
    ],
    comparativeAnalysis: {
      classAverageComparison: Number, // percentage above/below class average
      schoolAverageComparison: Number,
      peerGroupPerformance: Number,
      trend: {
        type: String,
        enum: ['ABOVE_AVERAGE', 'AVERAGE', 'BELOW_AVERAGE'],
      },
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
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
learningAnalyticsSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('LANA', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
learningAnalyticsSchema.index({ schoolId: 1, studentId: 1 });
learningAnalyticsSchema.index({ schoolId: 1, academicYear: 1 });
learningAnalyticsSchema.index({ code: 1, schoolId: 1 });
learningAnalyticsSchema.index({ 'risksAndChallenges.dropoutRisk.isAtRisk': 1, schoolId: 1 });

// Virtual: Overall learning health
learningAnalyticsSchema.virtual('overallLearningHealth').get(function () {
  const engagement = this.engagementMetrics?.participationScore || 0;
  const study = this.studyPatterns?.consistencyScore || 0;
  const progress = this.progressTracking?.overallProgressTrend === 'IMPROVING' ? 85 : 50;
  const health = Math.round((engagement + study + progress) / 3);
  
  if (health >= 80) return 'EXCELLENT';
  if (health >= 70) return 'GOOD';
  if (health >= 60) return 'AVERAGE';
  if (health >= 50) return 'BELOW_AVERAGE';
  return 'CRITICAL';
});

// Virtual: Days since analysis
learningAnalyticsSchema.virtual('daysSinceAnalysis').get(function () {
  if (!this.analysisDate) return null;
  const now = new Date();
  const timeDiff = now - this.analysisDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('LearningAnalytics', learningAnalyticsSchema);
