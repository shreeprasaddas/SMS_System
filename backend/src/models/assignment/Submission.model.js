const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    // Multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    submissionCode: {
      type: String,
      required: true,
      unique: true
    },

    // Assignment reference
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true
    },

    // Submitter
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },

    // Group information (for group assignments)
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssignmentGroup'
    },

    // Submission details
    submissionDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    submissionTime: String,

    isLateSubmission: {
      type: Boolean,
      default: false
    },

    lateDaysPenalty: {
      type: Number,
      default: 0
    },

    // Submission content
    submissionFile: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        fileSize: Number,
        uploadedDate: {
          type: Date,
          default: Date.now
        }
      }
    ],

    submissionText: {
      type: String,
      trim: true
    },

    submissionLinks: [
      {
        title: String,
        url: String
      }
    ],

    // Revision tracking
    version: {
      type: Number,
      default: 1
    },

    previousVersions: [
      {
        versionNumber: Number,
        submissionDate: Date,
        submissionFile: [
          {
            fileName: String,
            fileUrl: String
          }
        ],
        submissionText: String
      }
    ],

    // Status
    status: {
      type: String,
      enum: ['SUBMITTED', 'PENDING_REVIEW', 'GRADED', 'RETURNED', 'LATE_SUBMITTED', 'NOT_SUBMITTED'],
      default: 'SUBMITTED'
    },

    // Plagiarism detection
    plagiarismCheck: {
      checked: {
        type: Boolean,
        default: false
      },
      checkedDate: Date,
      similarityScore: {
        type: Number,
        min: 0,
        max: 100
      },
      plagiarismStatus: {
        type: String,
        enum: ['NOT_CHECKED', 'CLEAR', 'SUSPECTED', 'CONFIRMED']
      },
      plagiarismDetails: String,
      checkedBy: mongoose.Schema.Types.ObjectId
    },

    // Feedback and grades (basic)
    feedback: {
      type: String,
      trim: true
    },

    marks: {
      type: Number,
      min: 0
    },

    markingComments: [
      {
        comment: String,
        addedBy: mongoose.Schema.Types.ObjectId,
        addedDate: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Detailed evaluation via Evaluation model
    evaluationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evaluation'
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    gradingDate: Date,

    // Rubric scores (if using rubric)
    rubricScores: [
      {
        criterionName: String,
        score: Number,
        maxScore: Number,
        comments: String
      }
    ],

    // Request for resubmission
    returnedForRevision: {
      type: Boolean,
      default: false
    },

    returnedDate: Date,

    revisionReason: String,

    revisionDeadline: Date,

    revisionComments: String,

    // Additional metadata
    downloadCount: {
      type: Number,
      default: 0
    },

    lastDownloadedDate: Date,

    viewedByTeacher: {
      type: Boolean,
      default: false
    },

    viewedDate: Date,

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
submissionSchema.index({ schoolId: 1, status: 1 });
submissionSchema.index({ submissionCode: 1 }, { unique: true });
submissionSchema.index({ assignmentId: 1, studentId: 1, schoolId: 1 });
submissionSchema.index({ studentId: 1, schoolId: 1 });
submissionSchema.index({ submissionDate: 1, schoolId: 1 });
submissionSchema.index({ status: 1, submissionDate: 1, schoolId: 1 });
submissionSchema.index({ assignmentId: 1, status: 1, schoolId: 1 });

// Pre-save middleware
submissionSchema.pre('save', async function (next) {
  // Auto-generate submissionCode if not provided
  if (!this.submissionCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Submission').countDocuments({
      schoolId: this.schoolId
    });
    this.submissionCode = `SUB-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('Submission', submissionSchema);
