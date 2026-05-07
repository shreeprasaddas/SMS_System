const mongoose = require('mongoose');

const schoolBenchmarkSchema = new mongoose.Schema(
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
    benchmarkType: {
      type: String,
      enum: ['DISTRICT_COMPARISON', 'NATIONAL_STANDARD', 'PEER_GROUP', 'HISTORICAL', 'CUSTOM'],
      required: true,
      indexed: true,
    },
    academicYear: {
      type: String,
      required: true,
      indexed: true,
    },
    comparisonPeriod: {
      startDate: Date,
      endDate: Date,
    },
    academicPerformance: {
      schoolAveragePercentage: Number,
      districtAveragePercentage: Number,
      nationalAveragePercentage: Number,
      peerGroupAveragePercentage: Number,
      schoolRank: Number,
      totalSchoolsCompared: Number,
      percentileRank: Number,
      performanceStatus: {
        type: String,
        enum: ['EXCEEDING', 'MEETING', 'APPROACHING', 'BELOW'],
      },
      subjectWiseComparison: [
        {
          subject: String,
          schoolPercentage: Number,
          districtPercentage: Number,
          nationalPercentage: Number,
          peerPercentage: Number,
          schoolRank: Number,
          strength: Boolean,
          needsImprovement: Boolean,
        },
      ],
    },
    attendanceBenchmark: {
      schoolAttendance: {
        type: Number,
        min: 0,
        max: 100,
      },
      districtStandard: {
        type: Number,
        min: 0,
        max: 100,
      },
      nationalStandard: {
        type: Number,
        min: 0,
        max: 100,
      },
      peerGroupAverage: {
        type: Number,
        min: 0,
        max: 100,
      },
      status: {
        type: String,
        enum: ['EXCEEDING', 'MEETING', 'APPROACHING', 'BELOW'],
      },
      comparisonAnalysis: String,
    },
    infrastructureBenchmark: {
      classroomRatio: Number,
      studentTeacherRatio: Number,
      computerLabPercentage: Number,
      libraryResourcePerStudent: Number,
      sportsFieldAvailability: Number,
      districtStandards: mongoose.Schema.Types.Mixed,
      nationalStandards: mongoose.Schema.Types.Mixed,
      adequacyStatus: {
        type: String,
        enum: ['EXCEEDING', 'ADEQUATE', 'NEEDS_IMPROVEMENT'],
      },
    },
    teacherQualityBenchmark: {
      qualifiedTeacherPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      teacherTrainingCoverage: {
        type: Number,
        min: 0,
        max: 100,
      },
      averageTeacherExperience: Number,
      postGraduatePercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      districtBenchmark: mongoose.Schema.Types.Mixed,
      nationalBenchmark: mongoose.Schema.Types.Mixed,
      status: {
        type: String,
        enum: ['EXCEEDING', 'MEETING', 'APPROACHING', 'BELOW'],
      },
    },
    studentOutcomesBenchmark: {
      passPercentage: Number,
      dropoutRate: Number,
      competitiveExamSuccessRate: Number,
      higherEducationEnrollmentRate: Number,
      skillCertificationRate: Number,
      districtComparison: mongoose.Schema.Types.Mixed,
      nationalComparison: mongoose.Schema.Types.Mixed,
      benchmarkStatus: {
        type: String,
        enum: ['EXCEEDING', 'MEETING', 'APPROACHING', 'BELOW'],
      },
    },
    financialBenchmark: {
      revenuePerStudent: Number,
      expenditurePerStudent: Number,
      teacherSalaryRatio: Number,
      infrastructureInvestmentPercentage: Number,
      districtNorms: mongoose.Schema.Types.Mixed,
      nationalNorms: mongoose.Schema.Types.Mixed,
      financialHealthStatus: {
        type: String,
        enum: ['STRONG', 'STABLE', 'CONCERNING', 'CRITICAL'],
      },
    },
    innovationBenchmark: {
      digitalLearningImplementation: {
        type: Number,
        min: 0,
        max: 100,
      },
      sustainabilityInitiatives: {
        type: Number,
        min: 0,
        max: 100,
      },
      communityEngagementPrograms: {
        type: Number,
        min: 0,
        max: 100,
      },
      skillDevelopmentPrograms: {
        type: Number,
        min: 0,
        max: 100,
      },
      innovationScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      peerComparison: {
        type: String,
        enum: ['LEADER', 'ABOVE_AVERAGE', 'AVERAGE', 'BELOW_AVERAGE'],
      },
    },
    strengths: [
      {
        area: String,
        description: String,
        percentageAboveBenchmark: Number,
        recommendation: String,
      },
    ],
    gaps: [
      {
        area: String,
        currentPerformance: Number,
        benchmarkTarget: Number,
        gap: Number,
        priority: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
        actionPlan: String,
        timeline: String,
      },
    ],
    trends: [
      {
        year: String,
        performance: Number,
        benchmarkValue: Number,
        trend: {
          type: String,
          enum: ['IMPROVING', 'DECLINING', 'STABLE'],
        },
      },
    ],
    overallBenchmarkScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    overallStatus: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'NEEDS_IMPROVEMENT'],
    },
    actionPlan: [
      {
        goal: String,
        currentMetric: Number,
        targetMetric: Number,
        strategies: [String],
        resourcesNeeded: [String],
        timeline: String,
        responsiblePerson: String,
        successIndicators: [String],
      },
    ],
    generationDetails: {
      generatedDate: {
        type: Date,
        default: Date.now,
      },
      generatedByUserId: mongoose.Schema.Types.ObjectId,
      benchmarkSourcesUsed: [String],
      dataQuality: {
        type: String,
        enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'],
      },
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

schoolBenchmarkSchema.index({ schoolId: 1, benchmarkType: 1 });
schoolBenchmarkSchema.index({ schoolId: 1, academicYear: 1 });
schoolBenchmarkSchema.index({ code: 1, schoolId: 1 });

schoolBenchmarkSchema.virtual('benchmarkHealth').get(function () {
  if (this.overallStatus === 'EXCELLENT') return 90;
  if (this.overallStatus === 'GOOD') return 75;
  if (this.overallStatus === 'AVERAGE') return 50;
  return 25;
});

schoolBenchmarkSchema.virtual('reportAgeDays').get(function () {
  return Math.floor((Date.now() - this.generationDetails.generatedDate) / (1000 * 60 * 60 * 24));
});

schoolBenchmarkSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('SchoolBenchmark').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `BENCH-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('SchoolBenchmark', schoolBenchmarkSchema);
