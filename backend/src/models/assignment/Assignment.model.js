const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    // Multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    assignmentCode: {
      type: String,
      required: true,
      unique: true
    },

    // Assignment metadata
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    instructions: {
      type: String,
      trim: true
    },

    // Academic linkage
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    },

    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },

    // Assignment details
    assignmentType: {
      type: String,
      enum: [
        'HOMEWORK',
        'PROJECT',
        'RESEARCH',
        'PROBLEM_SET',
        'ESSAY',
        'PRESENTATION',
        'GROUP_WORK',
        'PRACTICAL',
        'LAB_WORK',
        'QUIZ',
        'OTHER'
      ],
      required: true
    },

    topic: {
      type: String,
      trim: true
    },

    learningObjectives: [String],

    // Attachments
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedDate: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Deadline information
    publishedDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    dueDate: {
      type: Date,
      required: true
    },

    submissionDeadline: {
      type: Date,
      required: true
    },

    // Late submission
    allowLateSubmission: {
      type: Boolean,
      default: true
    },

    gracePeriod: {
      value: Number,
      unit: {
        type: String,
        enum: ['HOURS', 'DAYS']
      }
    },

    lateSubmissionPenalty: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    // Grading information
    totalMarks: {
      type: Number,
      required: true,
      min: 0
    },

    rubricId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rubric'
    },

    evaluationCriteria: [
      {
        criterion: String,
        weight: Number,
        maxMarks: Number
      }
    ],

    // Group assignment
    isGroupAssignment: {
      type: Boolean,
      default: false
    },

    groupSize: {
      min: Number,
      max: Number,
      recommended: Number
    },

    // Status and lifecycle
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'SUBMISSION_OPEN', 'CLOSED', 'GRADING_COMPLETED', 'ARCHIVED'],
      default: 'DRAFT'
    },

    closedDate: Date,

    // Submission configuration
    allowAttachmentUpload: {
      type: Boolean,
      default: true
    },

    allowTextSubmission: {
      type: Boolean,
      default: true
    },

    maxFileSize: {
      value: Number,
      unit: {
        type: String,
        enum: ['MB', 'GB']
      }
    },

    allowedFileTypes: [String],

    // Plagiarism check
    checkPlagiarism: {
      type: Boolean,
      default: false
    },

    plagiarismThreshold: {
      type: Number,
      min: 0,
      max: 100
    },

    // Notifications
    sendReminderEmail: {
      type: Boolean,
      default: true
    },

    reminderBeforeDueDays: {
      type: Number,
      default: 1
    },

    // Statistics (virtual)
    totalSubmissions: {
      type: Number,
      default: 0
    },

    submittedCount: {
      type: Number,
      default: 0
    },

    gradedCount: {
      type: Number,
      default: 0
    },

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
assignmentSchema.index({ schoolId: 1, status: 1 });
assignmentSchema.index({ assignmentCode: 1 }, { unique: true });
assignmentSchema.index({ subjectId: 1, classId: 1, schoolId: 1 });
assignmentSchema.index({ teacherId: 1, schoolId: 1 });
assignmentSchema.index({ dueDate: 1, schoolId: 1 });
assignmentSchema.index({ academicYearId: 1, schoolId: 1 });
assignmentSchema.index({ status: 1, publishedDate: 1, schoolId: 1 });

// Pre-save middleware
assignmentSchema.pre('save', async function (next) {
  // Auto-generate assignmentCode if not provided
  if (!this.assignmentCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Assignment').countDocuments({
      schoolId: this.schoolId
    });
    this.assignmentCode = `ASN-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('Assignment', assignmentSchema);
