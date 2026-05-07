const mongoose = require('mongoose');

const chapterMappingSchema = new mongoose.Schema(
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
    syllabusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Syllabus',
      required: true,
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
    chapterNumber: {
      type: Number,
      required: true,
    },
    chapterName: {
      type: String,
      required: true,
    },
    chapterDescription: String,
    unit: Number,
    learningObjectives: [
      {
        objective: String,
        bloomLevel: {
          type: String,
          enum: ['REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE'],
        },
      },
    ],
    topics: [
      {
        topicId: String,
        topicNumber: Number,
        topicName: {
          type: String,
          required: true,
        },
        subtopics: [String],
        duration: {
          weeks: Number,
          hours: Number,
          sessions: Number,
        },
        keyPoints: [String],
        concepts: [
          {
            conceptName: String,
            conceptDefinition: String,
          },
        ],
        learningOutcomes: [
          {
            outcome: String,
            assessmentMethod: String,
          },
        ],
        teachingMethodology: [
          {
            method: String,
            description: String,
            tools: [String],
          },
        ],
        activities: [
          {
            activityName: String,
            activityType: {
              type: String,
              enum: ['LECTURE', 'DISCUSSION', 'PRACTICAL', 'PROJECT', 'CASE_STUDY', 'SIMULATION', 'FIELD_WORK', 'ASSIGNMENT'],
            },
            duration: Number,
            resources: [String],
            expectedOutcome: String,
          },
        ],
        assessments: [
          {
            assessmentType: {
              type: String,
              enum: ['QUIZ', 'ASSIGNMENT', 'PROJECT', 'PRESENTATION', 'PRACTICAL_TEST', 'FIELD_REPORT'],
            },
            weightage: Number,
            rubrics: [String],
          },
        ],
        resources: [
          {
            resourceName: String,
            resourceType: {
              type: String,
              enum: ['TEXTBOOK', 'VIDEO', 'ARTICLE', 'WEBSITE', 'DOCUMENT', 'SIMULATION', 'LAB_MANUAL'],
            },
            resourceUrl: String,
            author: String,
            isbn: String,
          },
        ],
        competenciesMapped: [String],
        skillsMapped: [String],
      },
    ],
    assessmentPlan: [
      {
        assessmentName: String,
        assessmentType: String,
        frequency: String,
        totalMarks: Number,
        weightage: Number,
      },
    ],
    competenciesAlignment: [
      {
        competency: String,
        proficiencyLevel: {
          type: String,
          enum: ['BEGINNER', 'INTERMEDIATE', 'PROFICIENT', 'ADVANCED'],
        },
      },
    ],
    skillsAlignment: [
      {
        skill: String,
        skillType: {
          type: String,
          enum: ['CRITICAL_THINKING', 'COMMUNICATION', 'COLLABORATION', 'CREATIVITY', 'DIGITAL_LITERACY'],
        },
      },
    ],
    interdisciplinaryConnections: [
      {
        linkedSubject: String,
        connectionDescription: String,
        sharedConcepts: [String],
      },
    ],
    realWorldApplications: [
      {
        application: String,
        description: String,
        exampleOrCase: String,
      },
    ],
    fieldworkComponent: {
      hasFieldwork: Boolean,
      fieldworkTitle: String,
      fieldworkDescription: String,
      fieldworkDuration: String,
      fieldworkObjectives: [String],
    },
    laboratoryComponent: {
      hasLaboratory: Boolean,
      practicalActivities: [
        {
          activityName: String,
          objective: String,
          duration: String,
          materials: [String],
        },
      ],
    },
    projectAssignment: {
      hasProject: Boolean,
      projectTitle: String,
      projectDescription: String,
      projectDuration: String,
      projectOutcome: String,
      assessmentRubric: [String],
    },
    inclusiveTeachingNotes: [String],
    teacherGuidance: String,
    commonMisconceptions: [
      {
        misconception: String,
        clarification: String,
        correctConcept: String,
      },
    ],
    estimatedCompletionWeek: {
      startWeek: Number,
      endWeek: Number,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REVISED'],
      indexed: true,
    },
    mappingReviewDetails: {
      reviewedBy: mongoose.Schema.Types.ObjectId,
      reviewDate: Date,
      reviewComments: String,
      approvedBy: mongoose.Schema.Types.ObjectId,
      approvalDate: Date,
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

chapterMappingSchema.index({ schoolId: 1, syllabusId: 1 });
chapterMappingSchema.index({ schoolId: 1, subjectId: 1, classId: 1 });
chapterMappingSchema.index({ schoolId: 1, academicYear: 1 });
chapterMappingSchema.index({ code: 1, schoolId: 1 });

chapterMappingSchema.virtual('totalTopics').get(function () {
  return this.topics ? this.topics.length : 0;
});

chapterMappingSchema.virtual('totalEstimatedHours').get(function () {
  if (!this.topics) return 0;
  return this.topics.reduce((sum, topic) => sum + (topic.duration?.hours || 0), 0);
});

chapterMappingSchema.virtual('completionPercentage').get(function () {
  if (this.status === 'COMPLETED') return 100;
  if (this.status === 'IN_PROGRESS') return 50;
  if (this.status === 'PENDING') return 0;
  return 0;
});

chapterMappingSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('ChapterMapping').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `CM-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('ChapterMapping', chapterMappingSchema);
