/**
 * CertificateEvent Model
 * Represents certificate distribution events, presentations, and ceremonies
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const certificateEventSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      enum: [
        'DISTRIBUTION_CEREMONY',
        'PRIZE_DISTRIBUTION',
        'AWARDS_NIGHT',
        'ASSEMBLY',
        'SPECIAL_PRESENTATION',
        'VIRTUAL_CEREMONY',
        'MAIL_DISTRIBUTION',
        'DIGITAL_DISTRIBUTION',
        'OTHER',
      ],
      required: true,
    },
    eventDescription: String,
    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      startTime: String,
      endTime: String,
    },
    eventLocation: {
      venue: String,
      address: String,
      city: String,
      pincode: String,
      isVirtual: Boolean,
      meetingLink: String,
      meetingPassword: String,
    },
    organizedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      organizationName: String,
      departmentName: String,
    },
    certificates: [
      {
        studentCertificateId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'StudentCertificate',
        },
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        status: {
          type: String,
          enum: ['PENDING', 'DISTRIBUTED', 'NOT_ATTENDED', 'COLLECTED'],
          default: 'PENDING',
        },
        distributedDate: Date,
        distributedBy: mongoose.Schema.Types.ObjectId,
        remarks: String,
      },
    ],
    attendees: [
      {
        attendeeId: mongoose.Schema.Types.ObjectId,
        attendeeType: {
          type: String,
          enum: ['STUDENT', 'TEACHER', 'STAFF', 'GUEST', 'PARENT'],
        },
        name: String,
        email: String,
        mobileNumber: String,
        registrationStatus: {
          type: String,
          enum: ['REGISTERED', 'ATTENDED', 'ABSENT', 'CANCELLED'],
          default: 'REGISTERED',
        },
        registrationDate: Date,
        checkInTime: Date,
        checkOutTime: Date,
      },
    ],
    keyNoteSpeakers: [
      {
        speakerId: mongoose.Schema.Types.ObjectId,
        speakerName: String,
        designation: String,
        affiliation: String,
        topicTitle: String,
        duration: Number,
        presentationUrl: String,
      },
    ],
    eventMedia: {
      photos: [
        {
          photoUrl: String,
          caption: String,
          uploadedDate: Date,
        },
      ],
      videos: [
        {
          videoUrl: String,
          thumbnailUrl: String,
          duration: Number,
          uploadedDate: Date,
        },
      ],
    },
    eventStatistics: {
      totalCertificatesToDistribute: Number,
      totalCertificatesDistributed: {
        type: Number,
        default: 0,
      },
      totalAttendees: Number,
      totalRegistered: {
        type: Number,
        default: 0,
      },
      totalAttended: {
        type: Number,
        default: 0,
      },
      totalAbsent: {
        type: Number,
        default: 0,
      },
    },
    eventBudget: {
      estimatedBudget: Number,
      actualExpenses: Number,
      currency: String,
    },
    status: {
      type: String,
      enum: ['PLANNING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED'],
      default: 'PLANNING',
      index: true,
    },
    remarks: String,
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
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

// Pre-save middleware for code generation
certificateEventSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('CEV', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
certificateEventSchema.index({ schoolId: 1, status: 1 });
certificateEventSchema.index({ schoolId: 1, eventDate: 1 });
certificateEventSchema.index({ schoolId: 1, eventType: 1 });
certificateEventSchema.index({ code: 1, schoolId: 1 });

// Virtual: Days until event
certificateEventSchema.virtual('daysUntilEvent').get(function () {
  const now = new Date();
  const timeDiff = this.eventDate - now;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Is event upcoming
certificateEventSchema.virtual('isUpcoming').get(function () {
  return this.eventDate > new Date();
});

// Virtual: Distribution percentage
certificateEventSchema.virtual('distributionPercentage').get(function () {
  if (this.eventStatistics?.totalCertificatesToDistribute === 0) return 0;
  return Math.round(
    (this.eventStatistics?.totalCertificatesDistributed / this.eventStatistics?.totalCertificatesToDistribute) * 100
  );
});

// Virtual: Attendance percentage
certificateEventSchema.virtual('attendancePercentage').get(function () {
  if (this.eventStatistics?.totalRegistered === 0) return 0;
  return Math.round((this.eventStatistics?.totalAttended / this.eventStatistics?.totalRegistered) * 100);
});

module.exports = mongoose.model('CertificateEvent', certificateEventSchema);
