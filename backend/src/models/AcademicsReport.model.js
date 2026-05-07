const mongoose = require('mongoose');

const academicsReportSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      indexed: true,
    },
    reportType: {
      type: String,
      enum: ['TERM_END', 'SEMESTER_END', 'ANNUAL', 'QUARTERLY', 'DIAGNOSTIC'],
      required: true,
      indexed: true,
    },
    academicYear: {
      type: String,
      required: true,
      indexed: true,
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
      term: String,
      semester: String,
    },
    overallPerformance: {
      totalStudents: Number,
      totalClasses: Number,
      averagePercentage: Number,
      passPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      failPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      gradeDistribution: {
        gradeA: Number,
        gradeB: Number,
        gradeC: Number,
        gradeD: Number,
        gradeF: Number,
      },
    },
    classWiseAnalysis: [
      {
        classId: mongoose.Schema.Types.ObjectId,
        className: String,
        totalStudents: Number,
        averageScore: Number,
        passPercentage: Number,
        topicWisePerformance: [
          {
            topic: String,
            averageScore: Number,
            difficulty: String,
            studentsImproving: Number,
            studentsFailing: Number,
          },
        ],
        teacherEffectiveness: {
          teacherId: mongoose.Schema.Types.ObjectId,
          teacherName: String,
          subjectId: mongoose.Schema.Types.ObjectId,
          subjectName: String,
          studentImproveRate: Number,
          conceptClarityScore: Number,
        },
      },
    ],
    subjectAnalysis: [
      {
        subjectId: mongoose.Schema.Types.ObjectId,
        subjectName: String,
        subjectCode: String,
        totalStudents: Number,
        averageScore: Number,
        highestScore: Number,
        lowestScore: Number,
        passPercentage: Number,
        performanceByClass: [
          {
            classId: mongoose.Schema.Types.ObjectId,
            className: String,
            classAverage: Number,
            classPassPercentage: Number,
          },
        ],
        conceptMastery: [
          {
            concept: String,
            masteryPercentage: Number,
            needsReinforcement: Boolean,
            studentsStruggling: Number,
          },
        ],
      },
    ],
    studentPerformanceTiers: {
      toppersList: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          classId: mongoose.Schema.Types.ObjectId,
          className: String,
          percentage: Number,
          rank: Number,
        },
      ],
      improvers: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          improvementPercentage: Number,
          previousPercentage: Number,
          currentPercentage: Number,
        },
      ],
      strugglers: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          percentage: Number,
          subjectsAtRisk: [String],
          interventionNeeded: Boolean,
        },
      ],
    },
    progressTrend: [
      {
        period: String,
        averagePercentage: Number,
        passPercentage: Number,
        comparisonWithPreviousPeriod: Number,
        trend: {
          type: String,
          enum: ['IMPROVING', 'DECLINING', 'STABLE'],
        },
      },
    ],
    learningOutcomes: {
      cognitiveObjectives: [
        {
          objective: String,
          achievementPercentage: Number,
          achievedCount: Number,
          partiallyAchievedCount: Number,
          notAchievedCount: Number,
        },
      ],
      skillDevelopment: [
        {
          skill: String,
          mastery: Number,
          students Demonstrating: Number,
        },
      ],
    },
    teacherPerformanceImpact: [
      {
        teacherId: mongoose.Schema.Types.ObjectId,
        teacherName: String,
        subjectsTeaching: [String],
        averageStudentPerformance: Number,
        studentImprovementRate: Number,
        effectiveness: {
          type: String,
          enum: ['HIGHLY_EFFECTIVE', 'EFFECTIVE', 'DEVELOPING', 'NEEDS_IMPROVEMENT'],
        },
      },
    ],
    improvementAreas: [
      {
        area: String,
        currentPerformance: Number,
        targetPerformance: Number,
        gap: Number,
        affectedStudents: Number,
        recommendedInterventions: [String],
        priority: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
      },
    ],
    recommendations: [
      {
        category: String,
        recommendation: String,
        targetClassess: [String],
        targetSubjects: [String],
        expectedOutcome: String,
        implementationTimeframe: String,
        resourcesNeeded: [String],
      },
    ],
    generationDetails: {
      generatedDate: {
        type: Date,
        default: Date.now,
      },
      generatedByUserId: mongoose.Schema.Types.ObjectId,
      dataSourcesUsed: [String],
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: {
          type: Date,
          default: Date.now,
        },
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

academicsReportSchema.index({ schoolId: 1, reportType: 1 });
academicsReportSchema.index({ schoolId: 1, academicYear: 1 });
academicsReportSchema.index({ code: 1, schoolId: 1 });

academicsReportSchema.virtual('reportQuality').get(function () {
  const score = this.overallPerformance.passPercentage;
  if (score >= 85) return 'EXCELLENT';
  if (score >= 70) return 'GOOD';
  if (score >= 50) return 'AVERAGE';
  return 'NEEDS_ATTENTION';
});

academicsReportSchema.virtual('reportAgeDays').get(function () {
  return Math.floor((Date.now() - this.generationDetails.generatedDate) / (1000 * 60 * 60 * 24));
});

academicsReportSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('AcademicsReport').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `AREP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('AcademicsReport', academicsReportSchema);
