const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema(
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
    curriculumName: {
      type: String,
      required: true,
      indexed: true,
    },
    curriculumCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: String,
    curriculumType: {
      type: String,
      enum: ['NATIONAL', 'STATE', 'INTERNATIONAL', 'CBSE', 'ICSE', 'IB', 'CUSTOM'],
      required: true,
      indexed: true,
    },
    academicYear: {
      type: String,
      required: true,
      indexed: true,
    },
    board: {
      type: String,
      enum: ['CBSE', 'ICSE', 'STATE', 'INTERNATIONAL', 'CAMBRIDGE', 'OTHER'],
    },
    applicableClasses: [
      {
        classId: mongoose.Schema.Types.ObjectId,
        className: String,
      },
    ],
    overallObjectives: [String],
    curriculumPhilosophy: String,
    pedagogicalApproach: [String],
    assessmentStrategy: [String],
    subjectsIncluded: [
      {
        subjectId: mongoose.Schema.Types.ObjectId,
        subjectName: String,
        subjectCode: String,
        creditHours: Number,
        weightage: Number,
      },
    ],
    frameworks: [
      {
        frameworkName: String,
        frameworkAlignment: String,
        complianceStatus: {
          type: String,
          enum: ['COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', 'PENDING'],
        },
      },
    ],
    timePeriodAllocations: [
      {
        period: String,
        startMonth: String,
        endMonth: String,
        subjects: [
          {
            subjectName: String,
            weeklyHours: Number,
            totalHours: Number,
          },
        ],
      },
    ],
    competencies: [
      {
        competencyName: String,
        competencyCode: String,
        description: String,
        framework: String,
      },
    ],
    skillDevelopment: [
      {
        skillName: String,
        skillType: {
          type: String,
          enum: ['CRITICAL_THINKING', 'COMMUNICATION', 'COLLABORATION', 'CREATIVITY', 'DIGITAL_LITERACY'],
        },
        gradeLevel: [String],
      },
    ],
    inclusionStrategies: [String],
    genderSensitivity: String,
    environmentalFocus: String,
    valueEducation: String,
    developmentStatus: {
      type: String,
      enum: ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED', 'REVISED', 'ARCHIVED'],
      indexed: true,
    },
    approvalDetails: {
      approvedBy: mongoose.Schema.Types.ObjectId,
      approvalDate: Date,
      approvalNotes: String,
      reviewedBy: mongoose.Schema.Types.ObjectId,
      reviewDate: Date,
      reviewComments: String,
    },
    implementationPeriod: {
      startDate: Date,
      endDate: Date,
      rolloutPhases: [
        {
          phase: Number,
          description: String,
          classesInvolved: [String],
          startDate: Date,
          endDate: Date,
        },
      ],
    },
    resources: [
      {
        resourceName: String,
        resourceType: {
          type: String,
          enum: ['TEXTBOOK', 'DIGITAL_RESOURCE', 'LABORATORY', 'LIBRARY', 'ONLINE_PLATFORM'],
        },
        resourceUrl: String,
      },
    ],
    references: [String],
    alignmentWithStandards: [
      {
        standardName: String,
        alignmentPercentage: Number,
        gapAreas: [String],
      },
    ],
    curriculumVersion: {
      type: Number,
      default: 1,
    },
    reviewSchedule: {
      nextReviewDate: Date,
      reviewFrequency: {
        type: String,
        enum: ['ANNUAL', 'BIENNIAL', 'TRIENNIAL'],
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

curriculumSchema.index({ schoolId: 1, curriculumType: 1 });
curriculumSchema.index({ schoolId: 1, academicYear: 1 });
curriculumSchema.index({ code: 1, schoolId: 1 });

curriculumSchema.virtual('subjectCount').get(function () {
  return this.subjectsIncluded ? this.subjectsIncluded.length : 0;
});

curriculumSchema.virtual('classCount').get(function () {
  return this.applicableClasses ? this.applicableClasses.length : 0;
});

curriculumSchema.virtual('implementationStatus').get(function () {
  if (this.implementationPeriod && this.implementationPeriod.startDate) {
    const now = Date.now();
    if (now < this.implementationPeriod.startDate) return 'SCHEDULED';
    if (now > this.implementationPeriod.endDate) return 'COMPLETED';
    return 'ONGOING';
  }
  return 'NOT_SCHEDULED';
});

curriculumSchema.virtual('daysSinceApproval').get(function () {
  if (this.approvalDetails && this.approvalDetails.approvalDate) {
    return Math.floor((Date.now() - this.approvalDetails.approvalDate) / (1000 * 60 * 60 * 24));
  }
  return null;
});

curriculumSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Curriculum').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `CURR-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Curriculum', curriculumSchema);
