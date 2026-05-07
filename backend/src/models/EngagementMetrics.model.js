const mongoose = require('mongoose');

const engagementMetricsSchema = new mongoose.Schema(
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
    entityType: {
      type: String,
      enum: ['STUDENT', 'TEACHER', 'PARENT', 'CLASS', 'SCHOOL'],
      required: true,
      indexed: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      indexed: true,
    },
    entityName: String,
    academicYear: {
      type: String,
      required: true,
      indexed: true,
    },
    studentEngagement: {
      attendanceScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      classParticipationScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      assignmentSubmissionRate: {
        type: Number,
        min: 0,
        max: 100,
      },
      homeworkCompletionRate: {
        type: Number,
        min: 0,
        max: 100,
      },
      projectCompletionRate: {
        type: Number,
        min: 0,
        max: 100,
      },
      practicalLabEngagement: {
        type: Number,
        min: 0,
        max: 100,
      },
      cocurricularParticipation: {
        type: Number,
        min: 0,
        max: 100,
      },
      clubMemberships: Number,
      eventParticipation: Number,
      sportsParticipation: Number,
      culturalParticipation: Number,
      disciplinaryIssues: Number,
      positiveReports: Number,
      overallEngagementScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      engagementTrend: {
        type: String,
        enum: ['HIGHLY_ENGAGED', 'ENGAGED', 'MODERATELY_ENGAGED', 'DISENGAGED', 'AT_RISK'],
      },
    },
    teacherEngagement: {
      lessonPlanPreparation: {
        type: Number,
        min: 0,
        max: 100,
      },
      classroomEffectiveness: {
        type: Number,
        min: 0,
        max: 100,
      },
      studentFeedbackScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      professionalDevelopmentHours: Number,
      trainingPrograms Attended: Number,
      certificationCompleted: Number,
      innovativeTeachingMethods: {
        type: Number,
        min: 0,
        max: 100,
      },
      parentCommunicationScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      extracurricularInvolvement: {
        type: Number,
        min: 0,
        max: 100,
      },
      attendanceRegularity: {
        type: Number,
        min: 0,
        max: 100,
      },
      commitmentScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      overallEngagementScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      engagementTrend: {
        type: String,
        enum: ['HIGHLY_COMMITTED', 'COMMITTED', 'MODERATELY_ENGAGED', 'NEEDS_SUPPORT'],
      },
    },
    parentEngagement: {
      parentTeacherMeetingAttendance: Number,
      communicationFrequency: {
        type: Number,
        min: 0,
        max: 100,
      },
      academicSupportAtHome: {
        type: Number,
        min: 0,
        max: 100,
      },
      schoolEventParticipation: Number,
      volunteerHours: Number,
      committeeMemberships: Number,
      feedbackProvision: {
        type: Number,
        min: 0,
        max: 100,
      },
      overallEngagementScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      engagementLevel: {
        type: String,
        enum: ['HIGHLY_ENGAGED', 'ENGAGED', 'MODERATELY_ENGAGED', 'LOW_ENGAGEMENT'],
      },
    },
    monthlyEngagementData: [
      {
        month: String,
        engagementScore: Number,
        activities: Number,
        participationRate: Number,
        feedback: String,
      },
    ],
    engagementActivities: [
      {
        activityName: String,
        activityType: String,
        participationDate: Date,
        participationLevel: {
          type: String,
          enum: ['ACTIVE', 'PASSIVE', 'MINIMAL'],
        },
        outcome: String,
      },
    ],
    challenges: [
      {
        challenge: String,
        severity: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
        affectedAreas: [String],
        recommendedInterventions: [String],
      },
    ],
    improvements: [
      {
        area: String,
        improvementPercentage: Number,
        method: String,
        dateImplemented: Date,
      },
    ],
    recommendations: [
      {
        recommendation: String,
        targetOutcome: String,
        implementationStrategy: String,
        expectedTimeline: String,
        priority: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
      },
    ],
    trends: [
      {
        period: String,
        engagementScore: Number,
        comparison: {
          type: String,
          enum: ['IMPROVED', 'DECLINED', 'STABLE'],
        },
        changePercentage: Number,
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

engagementMetricsSchema.index({ schoolId: 1, entityType: 1 });
engagementMetricsSchema.index({ schoolId: 1, entityId: 1 });
engagementMetricsSchema.index({ schoolId: 1, academicYear: 1 });
engagementMetricsSchema.index({ code: 1, schoolId: 1 });

engagementMetricsSchema.virtual('engagementHealth').get(function () {
  let score = 0;
  if (this.entityType === 'STUDENT' && this.studentEngagement) {
    score = this.studentEngagement.overallEngagementScore;
  } else if (this.entityType === 'TEACHER' && this.teacherEngagement) {
    score = this.teacherEngagement.overallEngagementScore;
  } else if (this.entityType === 'PARENT' && this.parentEngagement) {
    score = this.parentEngagement.overallEngagementScore;
  }
  if (score >= 80) return 'EXCELLENT';
  if (score >= 60) return 'GOOD';
  if (score >= 40) return 'FAIR';
  return 'NEEDS_ATTENTION';
});

engagementMetricsSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('EngagementMetrics').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `ENGAGE-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('EngagementMetrics', engagementMetricsSchema);
