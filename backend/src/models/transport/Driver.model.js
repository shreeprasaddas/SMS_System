const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    driverName: String,
    licenseNumber: {
      type: String,
      required: true,
      unique: true
    },
    licenseType: {
      type: String,
      enum: ['LMV', 'HMV', 'MCWG'],
      required: true
    },
    licenseExpiryDate: {
      type: Date,
      required: true
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0
    },
    dateOfBirth: Date,
    phoneNumber: String,
    address: String,
    hireDate: {
      type: Date,
      required: true
    },
    terminationDate: Date,
    medicalFitnessExpiryDate: {
      type: Date,
      required: true
    },
    trainings: [{
      trainingType: {
        type: String,
        enum: ['DEFENSIVE_DRIVING', 'FIRST_AID', 'EMERGENCY_RESPONSE', 'CHILD_SAFETY']
      },
      completionDate: Date,
      certificateNumber: String
    }],
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    performanceRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    totalTripsCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAccidents: {
      type: Number,
      default: 0,
      min: 0
    },
    violationsCount: {
      type: Number,
      default: 0,
      min: 0
    },
    assignedBusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus'
    },
    assignedBusNumber: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'],
      default: 'ACTIVE',
      index: true
    },
    remarks: String,
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
    timestamps: true
  }
);

// Pre-save middleware: auto-generate code
driverSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Driver').countDocuments({ schoolId: this.schoolId });
    this.code = `DRIVER-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
driverSchema.index({ schoolId: 1, status: 1 });
driverSchema.index({ schoolId: 1, userId: 1 });
driverSchema.index({ schoolId: 1, assignedBusId: 1 });

module.exports = mongoose.model('Driver', driverSchema);
