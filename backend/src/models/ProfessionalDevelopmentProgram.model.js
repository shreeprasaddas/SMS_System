const mongoose = require('mongoose');

const professionalDevelopmentProgramSchema = new mongoose.Schema(
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
    programName: {
      type: String,
      required: true,
    },
    programType: {
      type: String,
      enum: ['WORKSHOP', 'TRAINING_COURSE', 'CERTIFICATION', 'SEMINAR', 'CONFERENCE', 'ONLINE_COURSE', 'IN_HOUSE_TRAINING', 'MENTORING'],
      required: true,
      indexed: true,
    },
    programCategory: {
      type: String,
      enum: ['SUBJECT_MATTER_EXPERTISE', 'PEDAGOGICAL_SKILLS', 'TECHNOLOGY', 'LEADERSHIP', 'SOFT_SKILLS', 'HEALTH_SAFETY', 'COMPLIANCE', 'PERSONAL_DEVELOPMENT'],
      required: true,
      indexed: true,
    },
    description: {
      type: String,
      required: true,
    },
    objectives: [String],
    targetAudience: [
      {
        type: String,
        enum: ['TEACHER', 'STAFF', 'PRINCIPAL', 'ADMIN', 'LIBRARIAN', 'SUPPORT_STAFF'],
      },
    ],
    provider: {
      type: String,
      enum: ['INTERNAL', 'EXTERNAL', 'GOVERNMENT', 'NGO', 'PARTNER_INSTITUTION'],
      required: true,
    },
    providerDetails: {
      providerName: String,
      providerContactPerson: String,
      providerEmail: String,
      providerPhone: String,
    },
    duration: {
      durationValue: {
        type: Number,
        required: true,
      },
      durationUnit: {
        type: String,
        enum: ['HOURS', 'DAYS', 'WEEKS', 'MONTHS'],
        required: true,
      },
    },
    schedule: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      frequency: {
        type: String,
        enum: ['ONE_TIME', 'WEEKLY', 'MONTHLY', 'QUARTERLY'],
      },
      timings: {
        dayOfWeek: [String],
        startTime: String,
        endTime: String,
      },
      location: {
        type: String,
        enum: ['SCHOOL', 'EXTERNAL', 'ONLINE', 'HYBRID'],
      },
      venue: String,
      onlineLink: String,
    },
    capacity: {
      maxParticipants: {
        type: Number,
        required: true,
      },
      registeredParticipants: {
        type: Number,
        default: 0,
      },
      completedParticipants: {
        type: Number,
        default: 0,
      },
    },
    prerequisites: [String],
    courseContent: [
      {
        topic: String,
        description: String,
        duration: Number,
        materials: [String],
      },
    ],
    facilitators: [
      {
        facilitatorId: mongoose.Schema.Types.ObjectId,
        facilitatorName: String,
        facilitatorExpertise: String,
        qualification: String,
      },
    ],
    resources: {
      materialsProvided: [String],
      certificateAwarded: Boolean,
      certificateType: String,
      certificateIssuer: String,
    },
    budget: {
      estimatedCost: Number,
      costPerParticipant: Number,
      fundingSource: String,
      fundingApproved: Boolean,
      approvalDate: Date,
    },
    status: {
      type: String,
      enum: ['PLANNING', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'POSTPONED'],
      indexed: true,
    },
    learningOutcomes: [
      {
        outcome: String,
        measurable: Boolean,
        assessmentMethod: String,
      },
    ],
    assessment: {
      assessmentMethod: {
        type: String,
        enum: ['QUIZ', 'ASSIGNMENT', 'PROJECT', 'PRESENTATION', 'PRACTICAL', 'NONE'],
      },
      passingScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      assessmentDate: Date,
    },
    feedback: [
      {
        participantId: mongoose.Schema.Types.ObjectId,
        participantName: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        feedback: String,
        submittedDate: Date,
      },
    ],
    programOutcome: {
      successRate: Number,
      averageRating: Number,
      keyLearnings: [String],
      improvementAreas: [String],
      impactAssessment: String,
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

professionalDevelopmentProgramSchema.index({ schoolId: 1, programType: 1 });
professionalDevelopmentProgramSchema.index({ schoolId: 1, programCategory: 1 });
professionalDevelopmentProgramSchema.index({ schoolId: 1, status: 1 });
professionalDevelopmentProgramSchema.index({ code: 1, schoolId: 1 });

professionalDevelopmentProgramSchema.virtual('availableSeats').get(function () {
  return this.capacity.maxParticipants - this.capacity.registeredParticipants;
});

professionalDevelopmentProgramSchema.virtual('durationInHours').get(function () {
  if (this.duration.durationUnit === 'HOURS') return this.duration.durationValue;
  if (this.duration.durationUnit === 'DAYS') return this.duration.durationValue * 8;
  if (this.duration.durationUnit === 'WEEKS') return this.duration.durationValue * 40;
  if (this.duration.durationUnit === 'MONTHS') return this.duration.durationValue * 160;
  return 0;
});

professionalDevelopmentProgramSchema.virtual('daysUntilStart').get(function () {
  return Math.ceil((this.schedule.startDate - Date.now()) / (1000 * 60 * 60 * 24));
});

professionalDevelopmentProgramSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('ProfessionalDevelopmentProgram').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `PDP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('ProfessionalDevelopmentProgram', professionalDevelopmentProgramSchema);
