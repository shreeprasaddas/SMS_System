/**
 * StudentComplaint Model
 * Represents student complaints and grievances
 */

const mongoose = require('mongoose');

const studentComplaintSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  complaintNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['ACADEMIC', 'BULLYING', 'FACULTY', 'FACILITIES', 'DISCIPLINE', 'FEES', 'TRANSPORT', 'HOSTEL', 'OTHER'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'],
    default: 'OPEN',
  },
  filedDate: {
    type: Date,
    default: Date.now,
  },
  targetPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  attachments: [{
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
      min: 0,
    },
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedDate: {
    type: Date,
  },
  updates: [{
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updateText: {
      type: String,
      required: true,
      trim: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  resolution: {
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionDate: {
      type: Date,
    },
    resolutionText: {
      type: String,
      trim: true,
    },
    actionTaken: {
      type: String,
      trim: true,
    },
  }],
  studentSatisfied: {
    type: Boolean,
  },
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    trim: true,
  },
  isConfidential: {
    type: Boolean,
    default: false,
  },
  followUpRequired: {
    type: Boolean,
    default: false,
  },
  followUpDate: {
    type: Date,
  },
  parentNotified: {
    type: Boolean,
    default: false,
  },
  notificationDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
studentComplaintSchema.index({ schoolId: 1, complaintNumber: 1 }, { unique: true });
studentComplaintSchema.index({ schoolId: 1, student: 1 });
studentComplaintSchema.index({ schoolId: 1, status: 1 });
studentComplaintSchema.index({ schoolId: 1, category: 1 });
studentComplaintSchema.index({ schoolId: 1, severity: 1 });
studentComplaintSchema.index({ schoolId: 1, filedDate: -1 });
studentComplaintSchema.index({ schoolId: 1, assignedTo: 1 });

module.exports = mongoose.model('StudentComplaint', studentComplaintSchema);
