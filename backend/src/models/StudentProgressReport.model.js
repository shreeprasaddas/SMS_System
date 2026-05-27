/**
 * StudentProgressReport Model
 * Academic progress, performance metrics, and behavioral tracking for parent viewing
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const studentProgressReportSchema = new mongoose.Schema(
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
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParentProfile',
      index: true,
    },
    reportingPeriod: {
      academicYear: {
        type: String,
        required: true,
      },
      semester: {
        type: String,
        enum: ['SEMESTER_1', 'SEMESTER_2', 'TERM_1', 'TERM_2', 'TERM_3', 'ANNUAL'],
        required: true,
      },
      startDate: Date,
      endDate: Date,
    },
    academicPerformance: {
      grades: [
        {
          subjectId: mongoose.Schema.Types.ObjectId,
          subjectName: String,
          grade: String, // A+, A, B+, B, C, D, E
          marks: Number,
          maxMarks: Number,
          percentage: Number,
          remarks: String,
        },
      ],
      cumulativeGPA: Number,
      classRank: Number,
      totalStudentsInClass: Number,
      averagePercentage: Number,
      overallGrade: String,
    },
    attendance: {
      totalWorkingDays: Number,
      presentDays: Number,
      absentDays: Number,
      onLeaveCount: Number,
      attendancePercentage: Number,
      minimumRequired: Number,
      isCompliant: Boolean,
      remarks: String,
    },
    behavioralNotes: {
      conduct: {
        type: String,
        enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'NEEDS_IMPROVEMENT', 'POOR'],
      },
      sportsParticipation: String,
      culturalActivities: String,
      disciplinaryRecords: [
        {
          date: Date,
          type: String,
          description: String,
          severity: {
            type: String,
            enum: ['MINOR', 'MODERATE', 'SEVERE'],
          },
          action: String,
        },
      ],
      positiveAchievements: [String],
      generalComments: String,
    },
    academicStrengths: [
      {
        area: String,
        description: String,
      },
    ],
    areasForImprovement: [
      {
        area: String,
        description: String,
        suggestions: [String],
      },
    ],
    extracurricularActivities: [
      {
        activityName: String,
        participationLevel: {
          type: String,
          enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
        },
        achievements: [String],
      },
    ],
    overallPerformance: {
      rating: {
        type: String,
        enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'NEEDS_IMPROVEMENT', 'POOR'],
      },
      summary: String,
      recommendations: [String],
      parentalEngagementSuggestions: [String],
    },
    reportGeneration: {
      generatedDate: {
        type: Date,
        default: Date.now,
      },
      generatedByTeacherId: mongoose.Schema.Types.ObjectId,
      generatedByTeacherName: String,
      classTeacherId: mongoose.Schema.Types.ObjectId,
      publishedDate: Date,
    },
    parentViewingDetails: {
      hasBeenViewed: Boolean,
      viewedDate: Date,
      viewedByParentId: mongoose.Schema.Types.ObjectId,
      downloadCount: {
        type: Number,
        default: 0,
      },
      lastDownloadDate: Date,
    },
    nextReportSchedule: {
      scheduledDate: Date,
      remarks: String,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'REVISED'],
      default: 'DRAFT',
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
studentProgressReportSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('SPRPT', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
studentProgressReportSchema.index({ schoolId: 1, studentId: 1 });
studentProgressReportSchema.index({ schoolId: 1, parentId: 1 });
studentProgressReportSchema.index({ schoolId: 1, 'reportingPeriod.academicYear': 1 });
studentProgressReportSchema.index({ code: 1, schoolId: 1 });

// Virtual: Academic performance status
studentProgressReportSchema.virtual('academicStatus').get(function () {
  const avg = this.academicPerformance?.averagePercentage;
  if (!avg) return 'UNKNOWN';
  if (avg >= 80) return 'EXCELLENT';
  if (avg >= 70) return 'GOOD';
  if (avg >= 60) return 'AVERAGE';
  if (avg >= 50) return 'NEEDS_IMPROVEMENT';
  return 'CRITICAL';
});

// Virtual: Attendance compliance status
studentProgressReportSchema.virtual('attendanceStatus').get(function () {
  return this.attendance?.isCompliant ? 'COMPLIANT' : 'NON_COMPLIANT';
});

// Virtual: Days since report generation
studentProgressReportSchema.virtual('daysSinceGeneration').get(function () {
  if (!this.reportGeneration?.generatedDate) return null;
  const now = new Date();
  const timeDiff = now - this.reportGeneration.generatedDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Report readiness for parent
studentProgressReportSchema.virtual('isReadyForParent').get(function () {
  return this.status === 'PUBLISHED' && this.reportGeneration?.publishedDate;
});

module.exports = mongoose.model('StudentProgressReport', studentProgressReportSchema);
