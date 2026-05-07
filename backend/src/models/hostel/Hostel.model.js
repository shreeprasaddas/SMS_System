/**
 * Hostel Model
 * Hostel information and management
 */

const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
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
    hostelName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    hostelType: {
      type: String,
      enum: ['BOYS', 'GIRLS', 'MIXED'],
      required: true
    },
    principalInCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    warden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assistantWarden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    totalCapacity: {
      type: Number,
      required: true,
      min: 0
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0
    },
    totalRooms: {
      type: Number,
      required: true,
      min: 0
    },
    facilities: [{
      facilityName: String,
      description: String,
      available: Boolean,
      maintenanceSchedule: String
    }],
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    contactNumber: {
      type: String,
      maxlength: 20
    },
    emergencyContact: {
      name: String,
      phone: String
    },
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    visitingHours: {
      startTime: String,
      endTime: String
    },
    rules: [{
      ruleTitle: String,
      description: String,
      penalty: String
    }],
    hostelRules: {
      curfewTime: String,
      visitorsAllowed: Boolean,
      outsideFoodAllowed: Boolean,
      dayStudentAllowed: Boolean,
      leavePolicy: String
    },
    accommodationType: {
      type: String,
      enum: ['SHARED', 'SINGLE', 'DOUBLE', 'TRIPLE', 'MULTIPLE'],
      required: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE', 'CLOSED'],
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
hostelSchema.index({ schoolId: 1, status: 1 });
hostelSchema.index({ schoolId: 1, hostelType: 1 });
hostelSchema.index({ schoolId: 1, hostelName: 1 });

// Pre-save middleware for code generation
hostelSchema.pre('save', async function(next) {
  if (this.isNew && !this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Hostel').countDocuments({ 
      schoolId: this.schoolId 
    }) + 1;
    this.code = `HST-${year}-${String(count).padStart(5, '0')}`;
  }
  next();
});

// Virtual for vacancy count
hostelSchema.virtual('availableCapacity').get(function() {
  return this.totalCapacity - this.currentOccupancy;
});

// Virtual for occupancy percentage
hostelSchema.virtual('occupancyPercentage').get(function() {
  if (this.totalCapacity === 0) return 0;
  return Math.round((this.currentOccupancy / this.totalCapacity) * 100);
});

module.exports = mongoose.model('Hostel', hostelSchema);
