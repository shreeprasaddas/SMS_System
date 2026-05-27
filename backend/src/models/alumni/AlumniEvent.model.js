const mongoose = require('mongoose');
const { generateCode } = require('../../utils/codeGenerator');

const alumniEventSchema = new mongoose.Schema(
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
    eventName: {
      type: String,
      required: true,
      max: 200
    },
    eventType: {
      type: String,
      enum: ['REUNION', 'NETWORKING', 'WORKSHOP', 'SEMINAR', 'CAREER_TALK', 'FUNDRAISER', 'SPORTS', 'CULTURAL', 'OTHER'],
      required: true
    },
    description: {
      type: String,
      max: 1000
    },
    eventDate: {
      type: Date,
      required: true
    },
    eventEndDate: Date,
    startTime: String,
    endTime: String,
    registrationStartDate: Date,
    registrationEndDate: Date,
    location: {
      venue: String,
      address: String,
      city: String,
      state: String,
      country: String
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    virtualDetails: {
      platform: {
        type: String,
        enum: ['ZOOM', 'GOOGLE_MEET', 'MICROSOFT_TEAMS', 'OTHER']
      },
      meetingLink: String,
      meetingId: String
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    coOrganizers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    capacity: Number,
    expectedAttendees: Number,
    status: {
      type: String,
      enum: ['PLANNING', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PLANNING'
    },
    attendees: [
      {
        alumniId: mongoose.Schema.Types.ObjectId,
        registrationDate: Date,
        attendanceStatus: {
          type: String,
          enum: ['REGISTERED', 'ATTENDED', 'NO_SHOW', 'CANCELLED']
        },
        checkInTime: Date,
        feedback: String,
        rating: {
          type: Number,
          min: 1,
          max: 5
        }
      }
    ],
    agenda: [
      {
        time: String,
        activity: String,
        speaker: String,
        duration: String
      }
    ],
    speakers: [
      {
        name: String,
        designation: String,
        organization: String,
        bio: String,
        profileImageUrl: String
      }
    ],
    isFree: {
      type: Boolean,
      default: true
    },
    registrationFee: Number,
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP'],
      default: 'INR'
    },
    eventOutcomes: {
      actualAttendance: Number,
      averageRating: Number,
      keyOutcomes: [String]
    },
    eventPhotos: [
      {
        url: String,
        caption: String,
        uploadedDate: Date
      }
    ],
    eventMaterials: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedDate: Date
      }
    ],
    budget: {
      estimatedBudget: Number,
      actualExpense: Number
    },
    sponsors: [
      {
        sponsorName: String,
        sponsorshipType: String,
        sponsorshipAmount: Number,
        sponsorLogo: String
      }
    ],
    isPublic: {
      type: Boolean,
      default: true
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
alumniEventSchema.index({ schoolId: 1, status: 1 });
alumniEventSchema.index({ schoolId: 1, eventDate: 1 });
alumniEventSchema.index({ schoolId: 1, eventType: 1 });

// Virtual for registration open status
alumniEventSchema.virtual('isRegistrationOpen').get(function () {
  if (!this.registrationStartDate || !this.registrationEndDate) {
    return false;
  }
  const now = new Date();
  return now >= this.registrationStartDate && now <= this.registrationEndDate;
});

// Virtual for attendance count
alumniEventSchema.virtual('attendanceCount').get(function () {
  if (!this.attendees) return 0;
  return this.attendees.filter((a) => a.attendanceStatus === 'ATTENDED').length;
});

// Pre-save middleware: Generate code
alumniEventSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('AEV', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('AlumniEvent', alumniEventSchema);

module.exports = mongoose.model('AlumniEvent', alumniEventSchema);
