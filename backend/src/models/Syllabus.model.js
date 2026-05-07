const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema(
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
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      indexed: true,
    },
    subjectName: String,
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      indexed: true,
    },
    className: String,
    academicYear: {
      type: String,
      required: true,
      indexed: true,
    },
    syllabusTitle: {
      type: String,
      required: true,
    },
    syllabusCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: String,
    prerequisites: [String],
    learningObjectives: [
      {
        objective: String,
        bloomLevel: {
          type: String,
          enum: ['REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE'],
        },
      },
    ],
    syllabusStructure: [
      {
        unit: Number,
        unitName: {
          type: String,
          required: true,
        },
        unitDescription: String,
        duration: {
          weeks: Number,
          hours: Number,
        },
        chapters: [
          {
            chapterNumber: Number,
            chapterName: String,
            topics: [
              {
                topicName: String,
                subtopics: [String],
                learningOutcomes: [String],
                estimatedHours: Number,
                activityType: [
                  {
                    type: String,
                    enum: ['LECTURE', 'PRACTICAL', 'SEMINAR', 'PROJECT', 'ASSIGNMENT', 'EXPERIMENT', 'FIELD_WORK'],
                  },
                ],
              },
            ],
            assessmentMethod: [String],
          },
        ],
        unitOutcomes: [String],
        teachingMethodology: [String],
        resourcesRequired: [String],
      },
    ],
    competenciesMapping: [
      {
        competency: String,
        unitsCovered: [Number],
        assessmentMethod: String,
      },
    ],
    skillsMapping: [
      {
        skill: String,
        skillType: String,
        developmentAcross: [Number],
      },
    ],
    assessmentPattern: {
      formativeAssessment: [
        {
          assessmentType: String,
          frequency: String,
          weightage: Number,
        },
      ],
      summativeAssessment: [
        {
          assessmentType: String,
          frequency: String,
          totalMarks: Number,
          weightage: Number,
        },
      ],
      totalMarks: Number,
      passingMarks: Number,
    },
    referenceBooks: [
      {
        bookTitle: String,
        author: String,
        publication: String,
        isbn: String,
        edition: String,
      },
    ],
    onlineResources: [
      {
        resourceName: String,
        resourceUrl: String,
        description: String,
      },
    ],
    practicalComponent: {
      hasPractical: Boolean,
      practicalHours: Number,
      practicalTopics: [String],
      practicalAssessment: String,
    },
    projectComponent: {
      hasProject: Boolean,
      projectTopics: [String],
      projectDuration: String,
      projectAssessment: String,
    },
    internshipComponent: {
      hasInternship: Boolean,
      internshipDuration: String,
      internshipFocus: [String],
    },
    fieldworkComponent: {
      hasFieldwork: Boolean,
      fieldworkHours: Number,
      fieldworkActivities: [String],
    },
    interdisciplinaryLinks: [
      {
        linkedSubject: String,
        linkDescription: String,
        integrationPoints: [Number],
      },
    ],
    environmentalSustainability: [String],
    valueEducationThemes: [String],
    inclusiveTeachingStrategies: [String],
    syllabusVersion: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED', 'REVISED', 'ARCHIVED'],
      indexed: true,
    },
    approvalDetails: {
      approvedBy: mongoose.Schema.Types.ObjectId,
      approvalDate: Date,
      reviewedBy: mongoose.Schema.Types.ObjectId,
      reviewDate: Date,
    },
    implementationPeriod: {
      startDate: Date,
      endDate: Date,
    },
    teachingGuidance: [
      {
        guidanceTitle: String,
        guidanceDescription: String,
        recommendedActivities: [String],
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

syllabusSchema.index({ schoolId: 1, subjectId: 1 });
syllabusSchema.index({ schoolId: 1, classId: 1 });
syllabusSchema.index({ schoolId: 1, academicYear: 1 });
syllabusSchema.index({ code: 1, schoolId: 1 });

syllabusSchema.virtual('totalUnits').get(function () {
  return this.syllabusStructure ? this.syllabusStructure.length : 0;
});

syllabusSchema.virtual('totalTopics').get(function () {
  if (!this.syllabusStructure) return 0;
  return this.syllabusStructure.reduce((acc, unit) => {
    const unitTopics = unit.chapters ? unit.chapters.reduce((sum, ch) => sum + (ch.topics ? ch.topics.length : 0), 0) : 0;
    return acc + unitTopics;
  }, 0);
});

syllabusSchema.virtual('totalEstimatedHours').get(function () {
  if (!this.syllabusStructure) return 0;
  return this.syllabusStructure.reduce((acc, unit) => {
    const unitHours = unit.chapters
      ? unit.chapters.reduce(
          (sum, ch) => sum + (ch.topics ? ch.topics.reduce((h, t) => h + (t.estimatedHours || 0), 0) : 0),
          0
        )
      : 0;
    return acc + unitHours;
  }, 0);
});

syllabusSchema.virtual('implementationStatus').get(function () {
  if (this.implementationPeriod && this.implementationPeriod.startDate) {
    const now = Date.now();
    if (now < this.implementationPeriod.startDate) return 'SCHEDULED';
    if (now > this.implementationPeriod.endDate) return 'COMPLETED';
    return 'ONGOING';
  }
  return 'NOT_SCHEDULED';
});

syllabusSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Syllabus').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `SYL-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Syllabus', syllabusSchema);
