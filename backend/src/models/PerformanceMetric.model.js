/**
 * PerformanceMetric Model
 * Individual assessment scores, competencies, and performance tracking
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const performanceMetricSchema = new mongoose.Schema(
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
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    subjectName: String,
    assessmentType: {
      type: String,
      enum: ['CLASS_TEST', 'UNIT_TEST', 'PERIODICAL', 'TERMINAL', 'PRACTICAL', 'PROJECT', 'ASSIGNMENT', 'QUIZ', 'INTERNAL', 'EXTERNAL'],
      required: true,
      index: true,
    },
    assessmentDate: {
      type: Date,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    assessmentDetails: {
      assessmentId: mongoose.Schema.Types.ObjectId,
      assessmentName: String,
      totalMarks: Number,
      passingMarks: Number,
      marksObtained: {
        type: Number,
        required: true,
      },
      percentage: Number,
      grade: String, // A+, A, B+, B, C, D, E
      feedback: String,
    },
    competencies: [
      {
        competencyId: mongoose.Schema.Types.ObjectId,
        competencyName: String,
        competencyCategory: {
          type: String,
          enum: ['KNOWLEDGE', 'UNDERSTANDING', 'APPLICATION', 'ANALYSIS', 'SYNTHESIS', 'EVALUATION'],
        },
        scoredMarks: Number,
        maxMarks: Number,
        proficiencyLevel: {
          type: String,
          enum: ['NOVICE', 'DEVELOPING', 'PROFICIENT', 'ADVANCED'],
        },
        remarks: String,
      },
    ],
    performanceIndicators: {
      conceptUnderstanding: Number, // 0-100
      problemSolvingAbility: Number,
      creativeThinking: Number,
      communicationSkills: Number,
      timeManagement: Number,
      accuracy: Number,
      consistency: Number,
    },
    comparisonMetrics: {
      classAverage: Number,
      classRank: Number,
      totalStudentsInClass: Number,
      percentileRank: Number,
      standardDeviation: Number,
      aboveAverage: Boolean,
    },
    trendAnalysis: {
      previousAssessmentScore: Number,
      scoreChange: Number,
      improvement: Boolean,
      improvementPercentage: Number,
      consistencyIndex: Number,
    },
    teacherObservations: {
      strengths: [String],
      areasForImprovement: [String],
      suggestedInterventions: [String],
      motivationLevel: {
        type: String,
        enum: ['VERY_HIGH', 'HIGH', 'MODERATE', 'LOW', 'VERY_LOW'],
      },
      effortLevel: {
        type: String,
        enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE'],
      },
      participationLevel: {
        type: String,
        enum: ['VERY_ACTIVE', 'ACTIVE', 'MODERATE', 'PASSIVE', 'NON_PARTICIPATIVE'],
      },
    },
    statusTracking: {
      isImproving: Boolean,
      requiresIntervention: Boolean,
      interventionType: {
        type: String,
        enum: ['REMEDIAL', 'ENRICHMENT', 'SUPPORT', 'MENTORING', 'NONE'],
      },
      interventionStatus: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_REQUIRED'],
      },
    },
    reviewDetails: {
      reviewedByTeacherId: mongoose.Schema.Types.ObjectId,
      reviewedDate: Date,
      parentNotifiedDate: Date,
      parentResponse: String,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'REVIEWED', 'ARCHIVED'],
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
performanceMetricSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('PMETRIC', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  // Calculate percentage if not provided
  if (!this.assessmentDetails?.percentage && this.assessmentDetails?.marksObtained) {
    this.assessmentDetails.percentage = Math.round(
      (this.assessmentDetails.marksObtained / this.assessmentDetails.totalMarks) * 100
    );
  }
  next();
});

// Indexes
performanceMetricSchema.index({ schoolId: 1, studentId: 1 });
performanceMetricSchema.index({ schoolId: 1, subjectId: 1 });
performanceMetricSchema.index({ schoolId: 1, assessmentType: 1 });
performanceMetricSchema.index({ code: 1, schoolId: 1 });
performanceMetricSchema.index({ assessmentDate: -1, schoolId: 1 });

// Virtual: Performance status
performanceMetricSchema.virtual('performanceStatus').get(function () {
  const percentage = this.assessmentDetails?.percentage;
  if (!percentage) return 'UNKNOWN';
  if (percentage >= 80) return 'EXCELLENT';
  if (percentage >= 70) return 'GOOD';
  if (percentage >= 60) return 'AVERAGE';
  if (percentage >= 50) return 'BELOW_AVERAGE';
  return 'POOR';
});

// Virtual: Days since assessment
performanceMetricSchema.virtual('daysSinceAssessment').get(function () {
  if (!this.assessmentDate) return null;
  const now = new Date();
  const timeDiff = now - this.assessmentDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Grade status
performanceMetricSchema.virtual('gradeStatus').get(function () {
  const percentage = this.assessmentDetails?.percentage;
  if (!percentage) return 'N/A';
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'D';
});

module.exports = mongoose.model('PerformanceMetric', performanceMetricSchema);
