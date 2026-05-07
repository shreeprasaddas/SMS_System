const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema(
  {
    // Multi-tenancy: Always required
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    mentorshipCode: {
      type: String,
      required: true,
      unique: true
    },

    // Mentor and mentee details
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
      required: true
    },

    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },

    // Mentorship details
    subject: {
      type: String,
      enum: [
        'ACADEMIC',
        'CAREER_GUIDANCE',
        'PERSONAL_DEVELOPMENT',
        'PROFESSIONAL_SKILLS',
        'TECHNICAL_SKILLS',
        'SOFT_SKILLS',
        'ENTREPRENEURSHIP',
        'ENTRANCE_EXAM_PREPARATION',
        'INTERNSHIP_GUIDANCE',
        'PLACEMENT_PREPARATION',
        'HIGHER_EDUCATION',
        'LIFE_COACHING',
        'OTHER'
      ],
      required: true
    },

    description: {
      type: String,
      trim: true
    },

    // Goals and outcomes
    goals: [
      {
        goal: String,
        description: String,
        targetDate: Date,
        achieved: Boolean,
        completionDate: Date
      }
    ],

    // Duration and scheduling
    startDate: {
      type: Date,
      required: true
    },

    expectedEndDate: {
      type: Date
    },

    actualEndDate: {
      type: Date
    },

    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['WEEKS', 'MONTHS', 'YEARS'],
        default: 'MONTHS'
      }
    },

    // Session details
    sessionFrequency: {
      type: String,
      enum: ['WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'AS_NEEDED'],
      default: 'WEEKLY'
    },

    sessionDuration: {
      // in minutes
      type: Number,
      default: 60
    },

    totalSessionsPlanned: Number,

    sessionsCompleted: {
      type: Number,
      default: 0
    },

    // Communication mode
    communicationMode: {
      type: String,
      enum: ['IN_PERSON', 'ONLINE', 'PHONE', 'EMAIL', 'MIXED'],
      default: 'MIXED'
    },

    // Sessions tracking
    sessions: [
      {
        sessionNumber: Number,
        sessionDate: Date,
        startTime: String,
        endTime: String,
        duration: Number,
        mode: {
          type: String,
          enum: ['IN_PERSON', 'ONLINE', 'PHONE', 'EMAIL']
        },
        meetingLink: String,
        location: String,
        topicCovered: String,
        notes: String,
        mentorFeedback: String,
        menteeFeedback: String,
        attachments: [String],
        status: {
          type: String,
          enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
          default: 'SCHEDULED'
        }
      }
    ],

    // Status
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'COMPLETED', 'TERMINATED', 'ON_HOLD'],
      default: 'ACTIVE'
    },

    // Progress tracking
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    milestones: [
      {
        milestone: String,
        targetDate: Date,
        completionDate: Date,
        status: {
          type: String,
          enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
          default: 'PENDING'
        }
      }
    ],

    // Learning materials
    learningMaterials: [
      {
        title: String,
        description: String,
        resourceType: {
          type: String,
          enum: ['ARTICLE', 'BOOK', 'COURSE', 'VIDEO', 'DOCUMENT', 'WEBINAR', 'OTHER']
        },
        resourceLink: String,
        sharedDate: Date,
        feedback: String
      }
    ],

    // Feedback and assessment
    menteeProgress: {
      initialAssessment: String,
      currentPerformance: String,
      areasOfImprovement: [String],
      strengths: [String]
    },

    assessmentScores: [
      {
        assessmentName: String,
        assessmentDate: Date,
        score: Number,
        maxScore: Number,
        feedback: String
      }
    ],

    // Completion details
    completionDetails: {
      completionDate: Date,
      completionReason: {
        type: String,
        enum: ['GOAL_ACHIEVED', 'DURATION_COMPLETED', 'MUTUAL_AGREEMENT', 'MENTEE_REQUEST', 'MENTOR_REQUEST', 'OTHER']
      },
      finalAssessment: String,
      recommendationForFuture: String
    },

    // Feedback from mentee
    menteeFeedback: {
      overallExperience: {
        type: Number,
        min: 1,
        max: 5
      },
      mentorHelpfulness: {
        type: Number,
        min: 1,
        max: 5
      },
      skillDevelopment: {
        type: Number,
        min: 1,
        max: 5
      },
      confidenceGain: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      wouldRecommend: Boolean
    },

    // Feedback from mentor
    mentorFeedback: {
      menteeEngagement: {
        type: Number,
        min: 1,
        max: 5
      },
      menteeProgress: {
        type: Number,
        min: 1,
        max: 5
      },
      menteeResponsiveness: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      suggestionsForImprovement: String
    },

    // Continuation recommendation
    recommendContinuation: Boolean,

    continuationReason: String,

    // Visibility
    isPublic: {
      type: Boolean,
      default: false
    },

    // Success metrics
    successIndicators: [String],

    isSuccessful: Boolean,

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

// Indexes for frequently queried fields
mentorshipSchema.index({ schoolId: 1, status: 1 });
mentorshipSchema.index({ mentorshipCode: 1 }, { unique: true });
mentorshipSchema.index({ mentor: 1, schoolId: 1 });
mentorshipSchema.index({ mentee: 1, schoolId: 1 });
mentorshipSchema.index({ subject: 1, schoolId: 1 });
mentorshipSchema.index({ startDate: 1, schoolId: 1 });
mentorshipSchema.index({ status: 1, subject: 1, schoolId: 1 });

// Virtual for duration in days
mentorshipSchema.virtual('durationInDays').get(function () {
  const start = new Date(this.startDate);
  const end = this.actualEndDate ? new Date(this.actualEndDate) : new Date();
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
});

// Virtual for average mentee rating
mentorshipSchema.virtual('averageMenteeRating').get(function () {
  if (!this.menteeFeedback) return null;
  const ratings = [
    this.menteeFeedback.overallExperience,
    this.menteeFeedback.mentorHelpfulness,
    this.menteeFeedback.skillDevelopment,
    this.menteeFeedback.confidenceGain
  ].filter((r) => r);
  return ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : null;
});

// Pre-save middleware
mentorshipSchema.pre('save', async function (next) {
  // Auto-generate mentorshipCode if not provided
  if (!this.mentorshipCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Mentorship').countDocuments({
      schoolId: this.schoolId
    });
    this.mentorshipCode = `MNT-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);
