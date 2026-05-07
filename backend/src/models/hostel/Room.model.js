/**
 * Room Model
 * Hostel room management
 */

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
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
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    hostelName: String,
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    floor: {
      type: Number,
      required: true,
      min: 0
    },
    roomType: {
      type: String,
      enum: ['SINGLE', 'DOUBLE', 'TRIPLE', 'QUADRUPLE', 'MULTIPLE'],
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0
    },
    occupiedBeds: {
      type: Number,
      default: 0
    },
    facilities: [{
      facilityName: String,
      available: Boolean
    }],
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
    roomCondition: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'],
      default: 'GOOD'
    },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    maintenanceNotes: String,
    status: {
      type: String,
      enum: ['AVAILABLE', 'OCCUPIED', 'UNDER_MAINTENANCE', 'RESERVED', 'CLOSED'],
      default: 'AVAILABLE',
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
roomSchema.index({ schoolId: 1, status: 1 });
roomSchema.index({ schoolId: 1, hostelId: 1 });
roomSchema.index({ schoolId: 1, roomType: 1 });

// Pre-save middleware for code generation
roomSchema.pre('save', async function(next) {
  if (this.isNew && !this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Room').countDocuments({ 
      schoolId: this.schoolId 
    }) + 1;
    this.code = `ROOM-${year}-${String(count).padStart(5, '0')}`;
  }
  next();
});

// Virtual for vacancy
roomSchema.virtual('availableCapacity').get(function() {
  return this.capacity - this.currentOccupancy;
});

// Virtual for occupancy percentage
roomSchema.virtual('occupancyPercentage').get(function() {
  if (this.capacity === 0) return 0;
  return Math.round((this.currentOccupancy / this.capacity) * 100);
});

module.exports = mongoose.model('Room', roomSchema);
