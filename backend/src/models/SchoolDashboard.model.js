const mongoose = require('mongoose');

const schoolDashboardSchema = new mongoose.Schema(
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
    dashboardType: {
      type: String,
      enum: ['PRINCIPAL', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT', 'FINANCE', 'ACADEMIC'],
      required: true,
      indexed: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    overallMetrics: {
      totalStudents: {
        type: Number,
        default: 0,
      },
      totalTeachers: {
        type: Number,
        default: 0,
      },
      totalClasses: {
        type: Number,
        default: 0,
      },
      averageAttendance: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      academicPerformanceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      schoolHealthScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
    keyPerformanceIndicators: [
      {
        metricName: String,
        metricValue: mongoose.Schema.Types.Mixed,
        targetValue: mongoose.Schema.Types.Mixed,
        status: {
          type: String,
          enum: ['ON_TRACK', 'AT_RISK', 'CRITICAL', 'EXCEEDED'],
        },
        trend: {
          type: String,
          enum: ['INCREASING', 'DECREASING', 'STABLE'],
        },
      },
    ],
    studentAnalytics: {
      totalEnrolled: {
        type: Number,
        default: 0,
      },
      activeStudents: {
        type: Number,
        default: 0,
      },
      droppedOut: {
        type: Number,
        default: 0,
      },
      averageGPA: {
        type: Number,
        default: 0,
      },
      passPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      performanceDistribution: {
        excellent: Number,
        good: Number,
        average: Number,
        belowAverage: Number,
        poor: Number,
      },
      topPerformers: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          gpa: Number,
          rank: Number,
        },
      ],
      atRiskStudents: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          riskFactor: String,
          riskScore: Number,
        },
      ],
    },
    teacherAnalytics: {
      totalTeachers: {
        type: Number,
        default: 0,
      },
      averagePerformanceRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      classesPerTeacher: {
        type: Number,
        default: 0,
      },
      teacherAttendancePercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      performanceBreakdown: {
        excellent: Number,
        good: Number,
        satisfactory: Number,
        needsImprovement: Number,
      },
      topPerformers: [
        {
          teacherId: mongoose.Schema.Types.ObjectId,
          teacherName: String,
          rating: Number,
          specialization: String,
        },
      ],
    },
    attendanceAnalytics: {
      studentAttendancePercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      teacherAttendancePercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      monthlyTrend: [
        {
          month: String,
          studentAttendance: Number,
          teacherAttendance: Number,
        },
      ],
      classWiseAttendance: [
        {
          classId: mongoose.Schema.Types.ObjectId,
          className: String,
          attendancePercentage: Number,
        },
      ],
      lowAttendanceAlerts: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          attendancePercentage: Number,
        },
      ],
    },
    academicAnalytics: {
      subjectWisePerformance: [
        {
          subjectId: mongoose.Schema.Types.ObjectId,
          subjectName: String,
          averageScore: Number,
          passPercentage: Number,
          topicDifficulty: [
            {
              topicName: String,
              averageScore: Number,
              studentsPassed: Number,
              studentsFailed: Number,
            },
          ],
        },
      ],
      classWisePerformance: [
        {
          classId: mongoose.Schema.Types.ObjectId,
          className: String,
          averageScore: Number,
          passPercentage: Number,
          examPerformance: [
            {
              examName: String,
              averageScore: Number,
              highestScore: Number,
              lowestScore: Number,
            },
          ],
        },
      ],
      performanceTrends: [
        {
          quarter: String,
          overallPercentage: Number,
          improvingClasses: Number,
          declineClasses: Number,
        },
      ],
    },
    revenueAnalytics: {
      totalFeeCollected: {
        type: Number,
        default: 0,
      },
      pendingFees: {
        type: Number,
        default: 0,
      },
      feeCollectionPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      expectedRevenue: {
        type: Number,
        default: 0,
      },
      monthlyCollection: [
        {
          month: String,
          collected: Number,
          expected: Number,
          percentage: Number,
        },
      ],
      classWiseFeeCollection: [
        {
          classId: mongoose.Schema.Types.ObjectId,
          className: String,
          collected: Number,
          pending: Number,
          collectionPercentage: Number,
        },
      ],
      defaultersList: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          totalPending: Number,
          daysOverdue: Number,
        },
      ],
    },
    alerts: [
      {
        alertType: String,
        severity: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
        message: String,
        actionRequired: String,
        createdDate: Date,
        resolvedDate: Date,
        status: {
          type: String,
          enum: ['ACTIVE', 'RESOLVED', 'ACKNOWLEDGED'],
        },
      },
    ],
    recommendations: [
      {
        area: String,
        recommendation: String,
        priority: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
        estimatedImpact: String,
      },
    ],
    generationDetails: {
      generatedDate: {
        type: Date,
        default: Date.now,
      },
      lastUpdatedDate: {
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

schoolDashboardSchema.index({ schoolId: 1, dashboardType: 1 });
schoolDashboardSchema.index({ schoolId: 1, academicYear: 1 });
schoolDashboardSchema.index({ code: 1, schoolId: 1 });

schoolDashboardSchema.virtual('daysSinceDateGeneration').get(function () {
  return Math.floor((Date.now() - this.generationDetails.generatedDate) / (1000 * 60 * 60 * 24));
});

schoolDashboardSchema.virtual('dashboardHealth').get(function () {
  const score = (
    (this.overallMetrics.averageAttendance +
      this.overallMetrics.academicPerformanceScore +
      this.overallMetrics.schoolHealthScore) /
    3
  ).toFixed(2);
  if (score >= 80) return 'EXCELLENT';
  if (score >= 60) return 'GOOD';
  if (score >= 40) return 'AVERAGE';
  return 'NEEDS_IMPROVEMENT';
});

schoolDashboardSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('SchoolDashboard').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `DASH-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('SchoolDashboard', schoolDashboardSchema);
