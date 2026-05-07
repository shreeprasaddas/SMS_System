const mongoose = require('mongoose');

const networkingSchema = new mongoose.Schema(
  {
    // Multi-tenancy: Always required
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    networkingCode: {
      type: String,
      required: true,
      unique: true
    },

    // Alumni connections
    alumni1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
      required: true
    },

    alumni2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
      required: true
    },

    // Connection type
    connectionType: {
      type: String,
      enum: [
        'BATCH_MATE',
        'SAME_DEPARTMENT',
        'PROFESSIONAL_COLLEAGUE',
        'BUSINESS_PARTNER',
        'MENTOR_MENTEE',
        'FRIEND',
        'REFERENCE',
        'NETWORKING_EVENT',
        'MUTUAL_FRIEND',
        'OTHER'
      ],
      required: true
    },

    // Connection strength
    connectionStrength: {
      type: String,
      enum: ['WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG'],
      default: 'MODERATE'
    },

    // When the connection was made
    connectedDate: {
      type: Date,
      default: Date.now
    },

    // Where they connected
    connectionSource: {
      type: String,
      enum: [
        'ALUMNI_EVENT',
        'MENTORSHIP_PROGRAM',
        'SOCIAL_MEDIA',
        'PROFESSIONAL_NETWORK',
        'REFERRAL',
        'CASUAL_MEETING',
        'ONLINE_PLATFORM',
        'OTHER'
      ]
    },

    connectionSourceDetails: String,

    // Interaction history
    interactionHistory: [
      {
        interactionType: {
          type: String,
          enum: ['EMAIL', 'PHONE_CALL', 'VIDEO_CALL', 'IN_PERSON_MEETING', 'SOCIAL_MEDIA', 'EVENT_MEETING', 'COLLABORATION', 'OTHER']
        },
        interactionDate: Date,
        purpose: String,
        outcome: String,
        notes: String
      }
    ],

    // Mutual interests
    mutualInterests: [
      {
        category: {
          type: String,
          enum: ['PROFESSIONAL', 'ACADEMIC', 'HOBBY', 'SOCIAL_SERVICE', 'SPORTS', 'ARTS', 'OTHER']
        },
        interest: String
      }
    ],

    // Collaboration opportunities
    collaborationPotential: {
      hasOpportunity: Boolean,
      opportunityType: {
        type: String,
        enum: ['BUSINESS', 'MENTORSHIP', 'PROJECT', 'RESEARCH', 'EVENT_PLANNING', 'FUNDRAISING', 'SKILL_SHARING', 'OTHER']
      },
      opportunityDescription: String,
      explorationStatus: {
        type: String,
        enum: ['NOT_EXPLORED', 'UNDER_DISCUSSION', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
        default: 'NOT_EXPLORED'
      },
      explorationDetails: String
    },

    // Mutual connections
    mutualConnections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumni'
      }
    ],

    // Industry and professional overlap
    industryOverlap: [String],

    professionalSkillsComplementarity: [String],

    // Communication preferences
    communicationPreferences: {
      preferredChannel: {
        type: String,
        enum: ['EMAIL', 'PHONE', 'VIDEO_CALL', 'IN_PERSON', 'SOCIAL_MEDIA', 'NO_PREFERENCE'],
        default: 'NO_PREFERENCE'
      },
      frequencyOfContact: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'AS_NEEDED'],
        default: 'AS_NEEDED'
      },
      bestTimeToContact: String
    },

    // Contact information exchange
    contactExchanged: {
      type: Boolean,
      default: false
    },

    contactExchangeDate: Date,

    // Connection status
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DORMANT', 'DISCONNECTED', 'BLOCKED'],
      default: 'ACTIVE'
    },

    // Last interaction
    lastInteractionDate: Date,

    lastInteractionType: String,

    // Ratings and feedback
    alumni1Feedback: {
      connectionQuality: {
        type: Number,
        min: 1,
        max: 5
      },
      likelyToRecommend: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      connectionDate: Date
    },

    alumni2Feedback: {
      connectionQuality: {
        type: Number,
        min: 1,
        max: 5
      },
      likelyToRecommend: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      connectionDate: Date
    },

    // Average rating
    averageConnectionRating: {
      type: Number,
      min: 1,
      max: 5
    },

    // Success metrics
    successIndicators: [String],

    isSuccessfulConnection: Boolean,

    // Follow-up actions
    suggestedFollowUpActions: [
      {
        action: String,
        suggestedDate: Date,
        priority: {
          type: String,
          enum: ['LOW', 'MEDIUM', 'HIGH']
        },
        status: {
          type: String,
          enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
          default: 'PENDING'
        }
      }
    ],

    // Privacy and visibility
    isPublic: {
      type: Boolean,
      default: false
    },

    // Events where they connected
    connectedAtEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AlumniEvent'
    },

    // Shared projects
    sharedProjects: [
      {
        projectName: String,
        projectDescription: String,
        startDate: Date,
        endDate: Date,
        outcome: String
      }
    ],

    // Referrals made through this connection
    referralsMade: [
      {
        referredTo: String,
        referralType: {
          type: String,
          enum: ['JOB_OPPORTUNITY', 'BUSINESS_OPPORTUNITY', 'MENTORSHIP', 'PARTNERSHIP', 'OTHER']
        },
        referralDate: Date,
        outcome: String
      }
    ],

    // Connection contribution to school
    contributionType: [
      {
        type: String,
        enum: ['FUNDRAISING', 'MENTORSHIP', 'EVENT_SUPPORT', 'RESOURCE_SHARING', 'RECRUITMENT', 'GUEST_LECTURE', 'OTHER']
      }
    ],

    // Notes and follow-up
    notes: String,

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
networkingSchema.index({ schoolId: 1, status: 1 });
networkingSchema.index({ networkingCode: 1 }, { unique: true });
networkingSchema.index({ alumni1: 1, alumni2: 1, schoolId: 1 });
networkingSchema.index({ connectedDate: 1, schoolId: 1 });
networkingSchema.index({ connectionType: 1, schoolId: 1 });
networkingSchema.index({ status: 1, lastInteractionDate: 1, schoolId: 1 });

// Virtual for interaction count
networkingSchema.virtual('interactionCount').get(function () {
  return this.interactionHistory ? this.interactionHistory.length : 0;
});

// Virtual for duration of connection in days
networkingSchema.virtual('connectionDurationDays').get(function () {
  if (!this.connectedDate) return 0;
  const today = new Date();
  return Math.floor((today - this.connectedDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
networkingSchema.pre('save', async function (next) {
  // Auto-generate networkingCode if not provided
  if (!this.networkingCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Networking').countDocuments({
      schoolId: this.schoolId
    });
    this.networkingCode = `NET-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  // Calculate average rating if both feedbacks exist
  if (this.alumni1Feedback && this.alumni2Feedback) {
    const ratings = [
      this.alumni1Feedback.connectionQuality,
      this.alumni2Feedback.connectionQuality
    ].filter((r) => r);
    if (ratings.length > 0) {
      this.averageConnectionRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    }
  }

  // Update last interaction date
  if (this.interactionHistory && this.interactionHistory.length > 0) {
    const lastInteraction = this.interactionHistory[this.interactionHistory.length - 1];
    this.lastInteractionDate = lastInteraction.interactionDate;
    this.lastInteractionType = lastInteraction.interactionType;
  }

  next();
});

module.exports = mongoose.model('Networking', networkingSchema);
