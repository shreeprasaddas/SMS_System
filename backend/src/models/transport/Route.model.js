const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
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
    routeName: {
      type: String,
      required: true,
      min: 3,
      max: 100
    },
    routeNumber: {
      type: String,
      required: true,
      unique: true
    },
    startPoint: {
      address: String,
      latitude: Number,
      longitude: Number,
      landmark: String
    },
    endPoint: {
      address: String,
      latitude: Number,
      longitude: Number,
      landmark: String
    },
    stops: [{
      stopName: String,
      stopSequence: Number,
      latitude: Number,
      longitude: Number,
      estimatedTime: String
    }],
    distance: {
      type: Number,
      min: 0
    },
    estimatedDuration: {
      type: String
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    routeType: {
      type: String,
      enum: ['MORNING', 'AFTERNOON', 'EVENING', 'BOTH'],
      default: 'BOTH'
    },
    operatingDays: [{
      type: String,
      enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    }],
    pickupTime: String,
    dropoffTime: String,
    fee: {
      type: Number,
      required: true,
      min: 0
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    driverName: String,
    conductorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    conductorName: String,
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
    timestamps: true
  }
);

// Pre-save middleware: auto-generate code
routeSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Route').countDocuments({ schoolId: this.schoolId });
    this.code = `ROUTE-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
routeSchema.index({ schoolId: 1, status: 1 });
routeSchema.index({ schoolId: 1, routeType: 1 });
routeSchema.index({ schoolId: 1, driverId: 1 });

module.exports = mongoose.model('Route', routeSchema);
