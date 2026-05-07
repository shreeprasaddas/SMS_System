const mongoose = require('mongoose');

const staffSkillAssessmentSchema = new mongoose.Schema(
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
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      indexed: true,
    },
    employeeName: String,
    employeeDesignation: String,
    assessmentDate: {
      type: Date,
      required: true,
      indexed: true,
    },
    assessmentType: {
      type: String,
      enum: ['SELF_ASSESSMENT', 'PEER_ASSESSMENT', 'MANAGER_ASSESSMENT', 'TRAINING_BASED', 'PERFORMANCE_BASED', 'ANNUAL_APPRAISAL'],
      required: true,
      indexed: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    assessor: {
      assessorId: mongoose.Schema.Types.ObjectId,
      assessorName: String,
      assessorRole: String,
    },
    technicalSkills: [
      {
        skillName: {
          type: String,
          enum: ['SUBJECT_EXPERTISE', 'CURRICULUM_DESIGN', 'ASSESSMENT_DESIGN', 'RESEARCH_SKILLS', 'LABORATORY_SKILLS', 'COMPUTER_SKILLS', 'LANGUAGE_SKILLS'],
        },
        currentLevel: {
          type: Number,
          min: 1,
          max: 5,
        },
        targetLevel: {
          type: Number,
          min: 1,
          max: 5,
        },
        evidenceOfProficiency: String,
        assessmentDate: Date,
        assessorComments: String,
      },
    ],
    pedagogicalSkills: [
      {
        skillName: {
          type: String,
          enum: ['CLASSROOM_MANAGEMENT', 'LESSON_PLANNING', 'STUDENT_ENGAGEMENT', 'ASSESSMENT_TECHNIQUES', 'DIFFERENTIATION', 'ICT_INTEGRATION', 'QUESTIONING_TECHNIQUES', 'CONSTRUCTIVE_FEEDBACK'],
        },
        currentLevel: {
          type: Number,
          min: 1,
          max: 5,
        },
        targetLevel: {
          type: Number,
          min: 1,
          max: 5,
        },
        evidenceOfProficiency: String,
        classroomObservationScore: Number,
        studentFeedbackScore: Number,
        assessorComments: String,
      },
    ],
    softSkills: [
      {
        skillName: {
          type: String,
          enum: ['COMMUNICATION', 'TEAMWORK', 'LEADERSHIP', 'CRITICAL_THINKING', 'PROBLEM_SOLVING', 'EMOTIONAL_INTELLIGENCE', 'TIME_MANAGEMENT', 'CONFLICT_RESOLUTION'],
        },
        currentLevel: {
          type: Number,
          min: 1,
          max: 5,
        },
        targetLevel: {
          type: Number,
          min: 1,
          max: 5,
        },
        evidenceOfProficiency: String,
        assessorComments: String,
      },
    ],
    leadershipSkills: [
      {
        skillName: {
          type: String,
          enum: ['DECISION_MAKING', 'DELEGATION', 'STRATEGIC_THINKING', 'MENTORING', 'CHANGE_MANAGEMENT', 'VISION_SETTING'],
        },
        currentLevel: {
          type: Number,
          min: 1,
          max: 5,
        },
        targetLevel: {
          type: Number,
          min: 1,
          max: 5,
        },
        assessorComments: String,
      },
    ],
    overallAssessment: {
      totalSkillsAssessed: Number,
      averageCurrentLevel: Number,
      averageTargetLevel: Number,
      overallPerformanceRating: {
        type: String,
        enum: ['HIGHLY_PROFICIENT', 'PROFICIENT', 'DEVELOPING', 'NEEDS_IMPROVEMENT'],
      },
      overallComments: String,
    },
    skillGaps: [
      {
        skillArea: String,
        currentLevel: Number,
        targetLevel: Number,
        gap: Number,
        developmentPriority: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
        developmentStrategy: String,
        timelineForDevelopment: String,
      },
    ],
    developmentPlan: {
      trainingProgramsRecommended: [String],
      mentorAssigned: String,
      coachingSchedule: [
        {
          date: Date,
          topic: String,
          coach: String,
          status: String,
        },
      ],
      onTheJobLearning: [String],
      resourcesProvided: [String],
      reviewSchedule: String,
    },
    comparisonWithStandards: {
      districtStandards: {
        skillName: String,
        expectedLevel: Number,
      },
      nationalStandards: {
        skillName: String,
        expectedLevel: Number,
      },
      positionSpecificStandards: {
        skillName: String,
        expectedLevel: Number,
      },
      benchmarkAnalysis: String,
    },
    previousAssessments: [
      {
        assessmentDate: Date,
        overallRating: String,
        skillAreas: mongoose.Schema.Types.Mixed,
      },
    ],
    improvementTracker: [
      {
        skillName: String,
        assessmentDate: Date,
        previousLevel: Number,
        currentLevel: Number,
        improvement: Number,
        trend: {
          type: String,
          enum: ['IMPROVING', 'DECLINING', 'STABLE'],
        },
      },
    ],
    reviewDetails: {
      nextReviewDate: Date,
      reviewPeriod: {
        type: String,
        enum: ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'],
      },
      lastReviewComments: String,
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

staffSkillAssessmentSchema.index({ schoolId: 1, employeeId: 1 });
staffSkillAssessmentSchema.index({ schoolId: 1, assessmentType: 1 });
staffSkillAssessmentSchema.index({ schoolId: 1, academicYear: 1 });
staffSkillAssessmentSchema.index({ code: 1, schoolId: 1 });

staffSkillAssessmentSchema.virtual('skillGapSummary').get(function () {
  if (!this.skillGaps || this.skillGaps.length === 0) return 'NO_GAPS';
  const criticalGaps = this.skillGaps.filter((g) => g.developmentPriority === 'CRITICAL');
  return criticalGaps.length > 0 ? 'CRITICAL_GAPS' : 'MINOR_GAPS';
});

staffSkillAssessmentSchema.virtual('assessmentAgeDays').get(function () {
  return Math.floor((Date.now() - this.assessmentDate) / (1000 * 60 * 60 * 24));
});

staffSkillAssessmentSchema.virtual('developmentProgress').get(function () {
  if (this.improvementTracker && this.improvementTracker.length > 0) {
    const improvements = this.improvementTracker.filter((i) => i.trend === 'IMPROVING');
    return Math.round((improvements.length / this.improvementTracker.length) * 100);
  }
  return 0;
});

staffSkillAssessmentSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('StaffSkillAssessment').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `SKA-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('StaffSkillAssessment', staffSkillAssessmentSchema);
