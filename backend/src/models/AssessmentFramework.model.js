const mongoose = require('mongoose');

const assessmentFrameworkSchema = new mongoose.Schema(
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
    curriculumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curriculum',
      required: true,
      indexed: true,
    },
    frameworkName: {
      type: String,
      required: true,
    },
    frameworkCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: String,
    academicYear: {
      type: String,
      required: true,
      indexed: true,
    },
    assessmentType: {
      type: String,
      enum: ['FORMATIVE', 'SUMMATIVE', 'DIAGNOSTIC', 'BENCHMARK', 'PORTFOLIO'],
      required: true,
      indexed: true,
    },
    applicableClasses: [
      {
        classId: mongoose.Schema.Types.ObjectId,
        className: String,
      },
    ],
    applicableSubjects: [
      {
        subjectId: mongoose.Schema.Types.ObjectId,
        subjectName: String,
      },
    ],
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    assessmentComponents: [
      {
        componentName: String,
        componentCode: String,
        assessmentMethod: {
          type: String,
          enum: ['WRITTEN_EXAM', 'PRACTICAL', 'PROJECT', 'PRESENTATION', 'ASSIGNMENT', 'ORAL', 'OBSERVATION', 'PORTFOLIO', 'PARTICIPATION'],
        },
        frequency: {
          type: String,
          enum: ['CONTINUOUS', 'PERIODIC', 'END_OF_TERM'],
        },
        maxMarks: Number,
        weightage: {
          type: Number,
          min: 0,
          max: 100,
        },
        evaluationCriteria: [String],
        rubrics: [
          {
            criteriaName: String,
            description: String,
            levels: [
              {
                level: {
                  type: String,
                  enum: ['EXCEPTIONAL', 'PROFICIENT', 'DEVELOPING', 'NOVICE'],
                },
                description: String,
                marks: Number,
              },
            ],
          },
        ],
      },
    ],
    bloomsLevelAlignment: [
      {
        bloomLevel: {
          type: String,
          enum: ['REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE'],
        },
        assessmentComponents: [String],
        weightage: Number,
      },
    ],
    competencyAlignment: [
      {
        competency: String,
        assessmentMethods: [String],
        proficiencyLevels: [
          {
            level: {
              type: String,
              enum: ['BEGINNER', 'INTERMEDIATE', 'PROFICIENT', 'ADVANCED'],
            },
            criteria: String,
          },
        ],
      },
    ],
    skillsAssessment: [
      {
        skill: String,
        assessmentMethod: String,
        developmentCriteria: [String],
      },
    ],
    assessmentSchedule: [
      {
        schedulePeriod: String,
        startDate: Date,
        endDate: Date,
        assessmentComponents: [String],
      },
    ],
    inclusiveAssessmentStrategies: [
      {
        strategy: String,
        targetStudentGroup: String,
        accommodations: [String],
      },
    ],
    feedbackMechanism: [
      {
        feedbackType: String,
        feedbackProvider: String,
        frequency: String,
        format: String,
      },
    ],
    specialArrrangements: [
      {
        arrangementType: {
          type: String,
          enum: ['EXTENDED_TIME', 'SEPARATE_ROOM', 'MODIFIED_QUESTIONS', 'ORAL_ASSESSMENT', 'SCRIBE', 'TECHNOLOGY_AID'],
        },
        eligibleStudentCategory: String,
        details: String,
      },
    ],
    remedialMeasures: [
      {
        triggerPoint: String,
        remedialAction: String,
        supportMechanism: [String],
        successCriteria: String,
      },
    ],
    enrichmentMeasures: [
      {
        enrichmentActivity: String,
        targetStudentCategory: String,
        objectives: [String],
      },
    ],
    qualityAssurance: {
      moderation: {
        moderatedBy: mongoose.Schema.Types.ObjectId,
        moderationDate: Date,
        moderationComments: String,
      },
      benchmarking: {
        benchmarkedAgainst: String,
        benchmarkComparison: String,
      },
    },
    recordKeeping: {
      assessmentRecordsLocation: String,
      retentionPeriod: String,
      accessRights: [String],
    },
    staffGuidance: [
      {
        guidanceTitle: String,
        guidanceDescription: String,
        bestPractices: [String],
      },
    ],
    implementationStatus: {
      type: String,
      enum: ['DRAFT', 'APPROVED', 'IMPLEMENTED', 'UNDER_REVIEW', 'REVISED'],
      indexed: true,
    },
    approvalDetails: {
      approvedBy: mongoose.Schema.Types.ObjectId,
      approvalDate: Date,
      reviewedBy: mongoose.Schema.Types.ObjectId,
      reviewDate: Date,
      approvalComments: String,
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

assessmentFrameworkSchema.index({ schoolId: 1, assessmentType: 1 });
assessmentFrameworkSchema.index({ schoolId: 1, academicYear: 1 });
assessmentFrameworkSchema.index({ code: 1, schoolId: 1 });

assessmentFrameworkSchema.virtual('componentCount').get(function () {
  return this.assessmentComponents ? this.assessmentComponents.length : 0;
});

assessmentFrameworkSchema.virtual('totalWeightage').get(function () {
  if (!this.assessmentComponents) return 0;
  return this.assessmentComponents.reduce((sum, comp) => sum + (comp.weightage || 0), 0);
});

assessmentFrameworkSchema.virtual('isWeightageBalanced').get(function () {
  const total = this.totalWeightage;
  return total === 100;
});

assessmentFrameworkSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('AssessmentFramework').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `AF-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('AssessmentFramework', assessmentFrameworkSchema);
