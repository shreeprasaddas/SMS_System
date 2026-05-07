const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
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
    busNumber: {
      type: String,
      required: true,
      unique: true
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },
    model: {
      type: String,
      required: true
    },
    manufacturer: {
      type: String,
      required: true
    },
    yearOfManufacture: {
      type: Number,
      required: true,
      min: 2000
    },
    capacity: {
      type: Number,
      required: true,
      min: 10,
      max: 100
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0
    },
    fuelType: {
      type: String,
      enum: ['DIESEL', 'PETROL', 'CNG', 'ELECTRIC'],
      required: true
    },
    insuranceExpiryDate: {
      type: Date,
      required: true
    },
    fitnessExpiryDate: {
      type: Date,
      required: true
    },
    permitExpiryDate: {
      type: Date,
      required: true
    },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    currentMileage: {
      type: Number,
      min: 0
    },
    features: [{
      type: String,
      enum: ['AC', 'GPS', 'FIRST_AID_KIT', 'FIRE_EXTINGUISHER', 'SEAT_BELTS', 'EMERGENCY_BUTTONS', 'CCTV', 'PANIC_BUTTON']
    }],
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
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route'
    },
    routeName: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE'],
      default: 'ACTIVE',
      index: true
    },
    description: String,
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
busSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Bus').countDocuments({ schoolId: this.schoolId });
    this.code = `BUS-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
busSchema.index({ schoolId: 1, status: 1 });
busSchema.index({ schoolId: 1, driverId: 1 });
busSchema.index({ schoolId: 1, routeId: 1 });

module.exports = mongoose.model('Bus', busSchema);
