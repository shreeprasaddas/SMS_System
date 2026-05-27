const mongoose = require('mongoose');
const { generateCode } = require('../../utils/codeGenerator');

const alumniMentorSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      unique: true,
      sparse: true
    },
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
      required: true
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    mentorshipStartDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    mentorshipEndDate: Date,
    mentorshipType: {
      type: String,
      enum: ['ACADEMIC', 'CAREER', 'PERSONAL', 'SKILL_DEVELOPMENT', 'PLACEMENT', 'ENTREPRENEURSHIP', 'OTHER'],
      required: true
    },
    focusAreas: [String],
    mentorExpertise: {
      industry: String,
      skills: [String],
      yearsOfExperience: Number,
      designation: String
    },
    menteeGoals: {
      type: String,
      max: 1000
    },
    mentorshipDuration: {
      type: String,
      enum: ['3_MONTHS', '6_MONTHS', '1_YEAR', '2_YEARS', 'ONGOING'],
      default: 'ONGOING'
    },
    meetingFrequency: {
      type: String,
      enum: ['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'AS_NEEDED'],
      required: true
    },
    preferredCommunicationMode: {
      type: String,
      enum: ['EMAIL', 'PHONE', 'VIDEO_CALL', 'IN_PERSON', 'HYBRID'],
      required: true
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    completedSessions: {
      type: Number,
      default: 0
    },
    sessions: [
      {
        sessionDate: Date,
        topic: String,
        duration: Number,
        notes: String,
        sessionStatus: {
          type: String,
          enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']
        },
        feedback: {
          mentorFeedback: String,
          menteeFeedback: String,
          rating: {
            type: Number,
            min: 1,
            max: 5
          }
        }
      }
    ],
    mentorshipProgress: {
      goalsAchieved: [String],
      skillsImproved: [String],
      outcomesAchieved: String
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'TERMINATED'],
      default: 'ACTIVE'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    mentorReview: {
      type: String,
      max: 500
    },
    menteeReview: {
      type: String,
      max: 500
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateUrl: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    isVerified: {
      type: Boolean,
      default: false
    },
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

// Indexes for multi-tenancy and filtering
alumniMentorSchema.index({ schoolId: 1, status: 1 });
alumniMentorSchema.index({ schoolId: 1, alumniId: 1 });
alumniMentorSchema.index({ schoolId: 1, menteeId: 1 });
alumniMentorSchema.index({ schoolId: 1, mentorshipType: 1 });

// Virtual for completion percentage
alumniMentorSchema.virtual('completionPercentage').get(function () {
  if (this.totalSessions === 0) return 0;
  return Math.round((this.completedSessions / this.totalSessions) * 100);
});

// Virtual for mentorship duration in months
alumniMentorSchema.virtual('durationInMonths').get(function () {
  if (!this.mentorshipEndDate) return null;
  const start = new Date(this.mentorshipStartDate);
  const end = new Date(this.mentorshipEndDate);
  return Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
});

// Pre-save middleware: Generate code
alumniMentorSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('MNT', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('AlumniMentor', alumniMentorSchema);
