/**
 * HostelComplaint Model
 * Student complaints and grievance management
 */

const mongoose = require('mongoose');

const hostelComplaintSchema = new mongoose.Schema(
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
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    studentName: String,
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    hostelName: String,
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    roomNumber: String,
    complaintDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    complaintType: {
      type: String,
      enum: ['ROOM_CONDITION', 'AMENITIES', 'STAFF_CONDUCT', 'FOOD_QUALITY', 'NOISE', 'MAINTENANCE', 'SECURITY', 'OTHER'],
      required: true
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM'
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    location: String,
    attachments: [{
      fileUrl: String,
      fileName: String,
      uploadedDate: Date
    }],
    assignedTo: mongoose.Schema.Types.ObjectId,
    assignedToName: String,
    assignedDate: Date,
    resolutionDetails: {
      resolutionDate: Date,
      resolvedBy: mongoose.Schema.Types.ObjectId,
      resolutionNotes: String,
      resolutionStatus: {
        type: String,
        enum: ['RESOLVED', 'PARTIALLY_RESOLVED', 'NOT_RESOLVED']
      }
    },
    feedbackFromStudent: {
      satisfied: Boolean,
      feedback: String,
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      feedbackDate: Date
    },
    complaintStatus: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'PENDING_STUDENT_RESPONSE', 'CLOSED', 'REJECTED'],
      default: 'OPEN'
    },
    internalNotes: [{
      noteDate: Date,
      noteBy: mongoose.Schema.Types.ObjectId,
      noteByName: String,
      note: String
    }],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
    auditLog: [{
      action: String,
      performedBy: mongoose.Schema.Types.ObjectId,
      timestamp: {
        type: Date,
        default: Date.now
      },
      changes: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
hostelComplaintSchema.index({ schoolId: 1, status: 1 });
hostelComplaintSchema.index({ schoolId: 1, complaintStatus: 1 });
hostelComplaintSchema.index({ schoolId: 1, studentId: 1 });
hostelComplaintSchema.index({ schoolId: 1, priority: 1 });
hostelComplaintSchema.index({ schoolId: 1, complaintDate: 1 });

// Pre-save middleware for code generation
hostelComplaintSchema.pre('save', async function(next) {
  if (this.isNew && !this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('HostelComplaint').countDocuments({ 
      schoolId: this.schoolId 
    }) + 1;
    this.code = `CPLNT-${year}-${String(count).padStart(5, '0')}`;
  }
  next();
});

// Virtual for days open
hostelComplaintSchema.virtual('daysOpen').get(function() {
  const today = new Date();
  const diffTime = today - this.complaintDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for resolution time
hostelComplaintSchema.virtual('resolutionTime').get(function() {
  if (!this.resolutionDetails || !this.resolutionDetails.resolutionDate) return null;
  const diffTime = this.resolutionDetails.resolutionDate - this.complaintDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('HostelComplaint', hostelComplaintSchema);
