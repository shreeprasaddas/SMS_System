/**
 * StudentHostel Model
 * Student hostel allocation and management
 */

const mongoose = require('mongoose');

const studentHostelSchema = new mongoose.Schema(
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
      ref: 'Room',
      required: true
    },
    roomNumber: String,
    bedNumber: {
      type: Number,
      required: true,
      min: 1
    },
    academicYear: {
      type: String,
      required: true,
      trim: true
    },
    allocationDate: {
      type: Date,
      required: true
    },
    expectedCheckoutDate: Date,
    actualCheckoutDate: Date,
    monthlyRent: {
      type: Number,
      required: true,
      min: 0
    },
    securityDeposit: {
      type: Number,
      required: true,
      min: 0
    },
    depositPaid: {
      type: Boolean,
      default: false
    },
    depositRefunded: {
      type: Boolean,
      default: false
    },
    refundAmount: {
      type: Number,
      min: 0
    },
    refundDate: Date,
    emergencyContact: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      relationship: {
        type: String,
        required: true,
        trim: true
      }
    },
    medicalInfo: {
      bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
      },
      allergies: String,
      medications: String
    },
    rulesAcknowledged: {
      type: Boolean,
      default: false
    },
    specialInstructions: String,
    attendance: [{
      date: Date,
      status: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'ON_LEAVE']
      },
      remarks: String
    }],
    disciplinaryActions: [{
      date: {
        type: Date,
        default: Date.now
      },
      action: {
        type: String,
        enum: ['WARNING', 'FINES', 'SUSPENSION', 'EXPULSION']
      },
      reason: String,
      description: String,
      imposedBy: mongoose.Schema.Types.ObjectId
    }],
    allocationStatus: {
      type: String,
      enum: ['ACTIVE', 'CHECKED_OUT', 'SUSPENDED', 'TERMINATED'],
      default: 'ACTIVE'
    },
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
studentHostelSchema.index({ schoolId: 1, status: 1 });
studentHostelSchema.index({ schoolId: 1, studentId: 1, academicYear: 1 });
studentHostelSchema.index({ schoolId: 1, hostelId: 1 });
studentHostelSchema.index({ schoolId: 1, roomId: 1 });

// Pre-save middleware for code generation
studentHostelSchema.pre('save', async function(next) {
  if (this.isNew && !this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('StudentHostel').countDocuments({ 
      schoolId: this.schoolId 
    }) + 1;
    this.code = `SHST-${year}-${String(count).padStart(5, '0')}`;
  }
  next();
});

// Virtual for total charges
studentHostelSchema.virtual('totalCharges').get(function() {
  return (this.monthlyRent || 0) + (this.securityDeposit || 0);
});

module.exports = mongoose.model('StudentHostel', studentHostelSchema);
