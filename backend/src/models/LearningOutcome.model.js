const mongoose = require('mongoose');

const learningOutcomeSchema = new mongoose.Schema(
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
    syllabusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Syllabus',
      indexed: true,
    },
    chapterMappingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChapterMapping',
      indexed: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      indexed: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      indexed: true,
    },
    academicYear: {
      type: String,
      required: true,
      indexed: true,
    },
    outcomeCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    outcomeStatement: {
      type: String,
      required: true,
    },
    outcomeDescription: String,
    bloomLevel: {
      type: String,
      enum: ['REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE'],
      required: true,
      indexed: true,
    },
    outcomeType: {
      type: String,
      enum: ['KNOWLEDGE', 'SKILL', 'ATTITUDE', 'COMPETENCY'],
      indexed: true,
    },
    domain: {
      type: String,
      enum: ['COGNITIVE', 'AFFECTIVE', 'PSYCHOMOTOR'],
    },
    measurability: {
      isMeasurable: Boolean,
      assessmentMethod: String,
      assessmentCriteria: String,
      successCriteria: String,
    },
    alignedCompetencies: [
      {
        competencyId: String,
        competencyName: String,
        proficiencyLevel: {
          type: String,
          enum: ['BEGINNER', 'INTERMEDIATE', 'PROFICIENT', 'ADVANCED'],
        },
      },
    ],
    alignedSkills: [
      {
        skillId: String,
        skillName: String,
        skillType: {
          type: String,
          enum: ['CRITICAL_THINKING', 'COMMUNICATION', 'COLLABORATION', 'CREATIVITY', 'DIGITAL_LITERACY'],
        },
      },
    ],
    prerequisites: [String],
    teachingStrategies: [
      {
        strategyName: String,
        strategyDescription: String,
        resources: [String],
        estimatedTime: Number,
      },
    ],
    assessmentMethods: [
      {
        method: {
          type: String,
          enum: ['QUIZ', 'ASSIGNMENT', 'PROJECT', 'PRESENTATION', 'PRACTICAL', 'OBSERVATION', 'PORTFOLIO'],
        },
        frequency: String,
        weightage: Number,
        rubrics: [String],
      },
    ],
    learningActivities: [
      {
        activityName: String,
        activityDescription: String,
        activityType: String,
        duration: Number,
        materials: [String],
        expectedOutcome: String,
      },
    ],
    assessmentRubrics: [
      {
        criteriaName: String,
        proficiencyLevels: [
          {
            level: {
              type: String,
              enum: ['NOVICE', 'DEVELOPING', 'PROFICIENT', 'ADVANCED'],
            },
            description: String,
            scorePoints: Number,
          },
        ],
      },
    ],
    studentLearningIndicators: [
      {
        indicator: String,
        observable: Boolean,
        assessmentMethod: String,
      },
    ],
    supportMaterials: [
      {
        materialName: String,
        materialType: String,
        url: String,
      },
    ],
    differentiation: [
      {
        differentiationStrategy: String,
        targetStudentGroup: String,
        modifications: [String],
      },
    ],
    scaffolding: [
      {
        scaffoldingLevel: Number,
        description: String,
        support: String,
      },
    ],
    realWorldConnections: [
      {
        connection: String,
        application: String,
        example: String,
      },
    ],
    interdisciplinaryLinks: [
      {
        linkedSubject: String,
        linkDescription: String,
        sharedConcepts: [String],
      },
    ],
    cognitiveLoad: {
      complexity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
      },
      abstractionLevel: String,
      priorKnowledgeRequired: [String],
    },
    alignmentWithFrameworks: [
      {
        frameworkName: String,
        alignmentStatus: {
          type: String,
          enum: ['ALIGNED', 'PARTIALLY_ALIGNED', 'NOT_ALIGNED'],
        },
        alignmentNotes: String,
      },
    ],
    reviewStatus: {
      type: String,
      enum: ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED', 'REVISED'],
      indexed: true,
    },
    reviewDetails: {
      reviewedBy: mongoose.Schema.Types.ObjectId,
      reviewDate: Date,
      reviewComments: String,
      approvedBy: mongoose.Schema.Types.ObjectId,
      approvalDate: Date,
    },
    implementationTrackings: [
      {
        semester: String,
        startDate: Date,
        endDate: Date,
        status: String,
        notes: String,
      },
    ],
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

learningOutcomeSchema.index({ schoolId: 1, subjectId: 1, classId: 1 });
learningOutcomeSchema.index({ schoolId: 1, bloomLevel: 1 });
learningOutcomeSchema.index({ schoolId: 1, academicYear: 1 });
learningOutcomeSchema.index({ code: 1, schoolId: 1 });

learningOutcomeSchema.virtual('complexity').get(function () {
  if (this.cognitiveLoad && this.cognitiveLoad.complexity) {
    return this.cognitiveLoad.complexity;
  }
  const level = this.bloomLevel;
  if (['REMEMBER', 'UNDERSTAND'].includes(level)) return 'LOW';
  if (['APPLY', 'ANALYZE'].includes(level)) return 'MEDIUM';
  return 'HIGH';
});

learningOutcomeSchema.virtual('assessmentCount').get(function () {
  return this.assessmentMethods ? this.assessmentMethods.length : 0;
});

learningOutcomeSchema.virtual('totalActivityHours').get(function () {
  if (!this.learningActivities) return 0;
  return this.learningActivities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
});

learningOutcomeSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('LearningOutcome').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `LO-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('LearningOutcome', learningOutcomeSchema);
