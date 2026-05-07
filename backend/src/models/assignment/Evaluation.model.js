const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    // Multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    evaluationCode: {
      type: String,
      required: true,
      unique: true
    },

    // References
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true
    },

    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },

    // Evaluator
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    evaluatedDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    // Marking information
    totalMarks: {
      type: Number,
      required: true
    },

    obtainedMarks: {
      type: Number,
      required: true,
      min: 0
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100
    },

    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E', 'F', 'NA']
    },

    // Rubric evaluation (if applicable)
    rubricId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rubric'
    },

    rubricScores: [
      {
        criterionName: String,
        criterionDescription: String,
        maxScore: Number,
        obtainedScore: Number,
        feedbackLevel: {
          type: String,
          enum: ['EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT']
        },
        comments: String
      }
    ],

    totalRubricScore: Number,

    // Detailed feedback
    strengths: [String],

    areasForImprovement: [String],

    overallFeedback: {
      type: String,
      trim: true
    },

    constructiveSuggestions: {
      type: String,
      trim: true
    },

    // Submission analysis
    submissionWasLate: {
      type: Boolean,
      default: false
    },

    lateSubmissionPenaltyApplied: {
      type: Number,
      default: 0
    },

    // Integrity checks
    plagiarismDetected: {
      type: Boolean,
      default: false
    },

    plagiarismSimilarityScore: {
      type: Number,
      min: 0,
      max: 100
    },

    plagiarismDetails: String,

    cheatingDetected: {
      type: Boolean,
      default: false
    },

    cheatingDetails: String,

    // Evaluation status
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED', 'RETURNED_FOR_REVISION', 'FINALIZED', 'UNDER_REVIEW'],
      default: 'COMPLETED'
    },

    // Re-evaluation tracking
    isRevised: {
      type: Boolean,
      default: false
    },

    originalEvaluationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evaluation'
    },

    revisionReason: String,

    // Quality indicators
    timeSpentMarking: {
      type: Number,
      description: 'Time spent marking in minutes'
    },

    markedCarefully: {
      type: Boolean,
      default: true
    },

    // Comparative analysis
    classAverage: Number,

    classMedian: Number,

    performanceRank: Number,

    performancePercentile: Number,

    // Comments and notes
    evaluatorNotes: {
      type: String,
      trim: true
    },

    internalComments: {
      type: String,
      trim: true
    },

    // Review process (if needed)
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    reviewDate: Date,

    reviewApproved: Boolean,

    reviewComments: String,

    // Moderation/QA
    isModerationSample: {
      type: Boolean,
      default: false
    },

    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    moderationDate: Date,

    moderationComments: String,

    // Appeal/dispute
    appealed: {
      type: Boolean,
      default: false
    },

    appealedBy: {
      type: String,
      enum: ['STUDENT', 'PARENT']
    },

    appealedDate: Date,

    appealReason: String,

    appealStatus: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']
    },

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
evaluationSchema.index({ schoolId: 1, status: 1 });
evaluationSchema.index({ evaluationCode: 1 }, { unique: true });
evaluationSchema.index({ assignmentId: 1, studentId: 1, schoolId: 1 });
evaluationSchema.index({ submissionId: 1, schoolId: 1 });
evaluationSchema.index({ studentId: 1, schoolId: 1 });
evaluationSchema.index({ evaluatedBy: 1, schoolId: 1 });
evaluationSchema.index({ evaluatedDate: 1, schoolId: 1 });
evaluationSchema.index({ status: 1, evaluatedDate: 1, schoolId: 1 });

// Pre-save middleware
evaluationSchema.pre('save', async function (next) {
  // Auto-generate evaluationCode if not provided
  if (!this.evaluationCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Evaluation').countDocuments({
      schoolId: this.schoolId
    });
    this.evaluationCode = `EVL-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  // Calculate percentage if not provided
  if (this.obtainedMarks && this.totalMarks && !this.percentage) {
    this.percentage = (this.obtainedMarks / this.totalMarks) * 100;
  }

  // Assign grade based on percentage
  if (this.percentage && !this.grade) {
    if (this.percentage >= 95) this.grade = 'A+';
    else if (this.percentage >= 90) this.grade = 'A';
    else if (this.percentage >= 85) this.grade = 'B+';
    else if (this.percentage >= 80) this.grade = 'B';
    else if (this.percentage >= 75) this.grade = 'C+';
    else if (this.percentage >= 70) this.grade = 'C';
    else if (this.percentage >= 60) this.grade = 'D';
    else if (this.percentage >= 50) this.grade = 'E';
    else this.grade = 'F';
  }

  next();
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
