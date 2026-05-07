const mongoose = require('mongoose');

const rubricSchema = new mongoose.Schema(
  {
    // Multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    rubricCode: {
      type: String,
      required: true,
      unique: true
    },

    // Basic information
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    // Rubric scope
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    },

    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear'
    },

    // Rubric configuration
    rubricType: {
      type: String,
      enum: ['ANALYTICAL', 'HOLISTIC', 'CHECKLIST'],
      default: 'ANALYTICAL'
    },

    totalPoints: {
      type: Number,
      required: true,
      min: 1
    },

    // Criteria definition
    criteria: [
      {
        criterionId: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true
        },

        criterionName: {
          type: String,
          required: true,
          trim: true
        },

        description: {
          type: String,
          trim: true
        },

        weight: {
          type: Number,
          min: 0,
          max: 100,
          required: true
        },

        maxPoints: {
          type: Number,
          required: true,
          min: 0
        },

        // Performance levels/descriptors
        levels: [
          {
            levelId: {
              type: mongoose.Schema.Types.ObjectId,
              auto: true
            },

            levelName: {
              type: String,
              enum: ['EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR']
            },

            points: {
              type: Number,
              required: true,
              min: 0
            },

            descriptor: {
              type: String,
              trim: true
            },

            indicators: [String]
          }
        ]
      }
    ],

    // Rubric status
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED'
    },

    // Reusability
    isTemplate: {
      type: Boolean,
      default: false
    },

    templateTags: [String],

    // Usage tracking
    usageCount: {
      type: Number,
      default: 0
    },

    lastUsedDate: Date,

    recentAssignments: [
      {
        assignmentId: mongoose.Schema.Types.ObjectId,
        assignmentTitle: String,
        usedDate: Date
      }
    ],

    // Customization options
    allowScoreOverride: {
      type: Boolean,
      default: false
    },

    allowCustomComments: {
      type: Boolean,
      default: true
    },

    requireComments: {
      type: Boolean,
      default: true
    },

    // Scoring configuration
    scoringType: {
      type: String,
      enum: ['POINTS', 'PERCENTAGE', 'SCALE']
    },

    scaleLevels: [
      {
        scaleName: String,
        points: Number
      }
    ],

    // Creator and ownership
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    },

    // Collaboration
    sharedWith: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        accessLevel: {
          type: String,
          enum: ['VIEW', 'EDIT', 'FULL']
        }
      }
    ],

    // Feedback template
    feedbackTemplate: {
      type: String,
      description: 'Pre-defined feedback text for common scenarios'
    },

    // Metadata
    version: {
      type: Number,
      default: 1
    },

    previousVersions: [
      {
        versionNumber: Number,
        criteria: [Object],
        modifiedDate: Date,
        modifiedBy: mongoose.Schema.Types.ObjectId
      }
    ],

    // Effectiveness tracking
    effectivenessRating: {
      type: Number,
      min: 1,
      max: 5
    },

    effectivenessComments: String,

    // Audit trail
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: {
          type: Date,
          default: Date.now
        },
        changes: mongoose.Schema.Types.Mixed
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
rubricSchema.index({ schoolId: 1, status: 1 });
rubricSchema.index({ rubricCode: 1 }, { unique: true });
rubricSchema.index({ createdBy: 1, schoolId: 1 });
rubricSchema.index({ subjectId: 1, schoolId: 1 });
rubricSchema.index({ classId: 1, schoolId: 1 });
rubricSchema.index({ isTemplate: 1, status: 1, schoolId: 1 });

// Pre-save middleware
rubricSchema.pre('save', async function (next) {
  // Auto-generate rubricCode if not provided
  if (!this.rubricCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Rubric').countDocuments({
      schoolId: this.schoolId
    });
    this.rubricCode = `RUB-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  // Validate that criteria weights sum to 100
  const totalWeight = this.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.01) {
    // Allow slight floating point differences
    throw new Error('Criteria weights must sum to 100%');
  }

  next();
});

module.exports = mongoose.model('Rubric', rubricSchema);
