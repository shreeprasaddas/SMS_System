const mongoose = require('mongoose');

const transportLogSchema = new mongoose.Schema(
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
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true
    },
    busNumber: String,
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true
    },
    routeName: String,
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    driverName: String,
    logDate: {
      type: Date,
      required: true
    },
    tripType: {
      type: String,
      enum: ['MORNING', 'AFTERNOON', 'EVENING'],
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: Date,
    startMileage: {
      type: Number,
      required: true,
      min: 0
    },
    endMileage: {
      type: Number,
      min: 0
    },
    distanceTraveled: Number,
    fuelConsumed: {
      type: Number,
      min: 0
    },
    totalStudentsPickedUp: {
      type: Number,
      default: 0,
      min: 0
    },
    totalStudentsDropped: {
      type: Number,
      default: 0,
      min: 0
    },
    studentsAttendance: [{
      studentId: mongoose.Schema.Types.ObjectId,
      studentName: String,
      attendanceStatus: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'LATE']
      },
      pickupTime: Date,
      dropoffTime: Date,
      remarks: String
    }],
    incidents: [{
      incidentType: {
        type: String,
        enum: ['ACCIDENT', 'BREAKDOWN', 'DELAY', 'MISBEHAVIOR', 'OTHER']
      },
      description: String,
      severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
      },
      reportedAt: {
        type: Date,
        default: Date.now
      },
      isResolved: {
        type: Boolean,
        default: false
      },
      resolution: String
    }],
    weatherCondition: {
      type: String,
      enum: ['CLEAR', 'RAINY', 'FOGGY', 'SNOWY', 'WINDY']
    },
    trafficCondition: {
      type: String,
      enum: ['LIGHT', 'MODERATE', 'HEAVY', 'EXTREME']
    },
    tripStatus: {
      type: String,
      enum: ['COMPLETED', 'IN_PROGRESS', 'CANCELLED', 'DELAYED'],
      default: 'IN_PROGRESS',
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
transportLogSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('TransportLog').countDocuments({ schoolId: this.schoolId });
    this.code = `LOG-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
transportLogSchema.index({ schoolId: 1, tripStatus: 1 });
transportLogSchema.index({ schoolId: 1, busId: 1, logDate: 1 });
transportLogSchema.index({ schoolId: 1, driverId: 1, logDate: 1 });

module.exports = mongoose.model('TransportLog', transportLogSchema);
