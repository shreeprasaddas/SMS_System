const mongoose = require('mongoose');

const studentTransportSchema = new mongoose.Schema(
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
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    studentName: String,
    className: String,
    rollNumber: String,
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true
    },
    routeName: String,
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true
    },
    busNumber: String,
    pickupStop: {
      stopName: String,
      pickupTime: String,
      sequence: Number
    },
    dropoffStop: {
      stopName: String,
      dropoffTime: String,
      sequence: Number
    },
    transportType: {
      type: String,
      enum: ['ONE_WAY', 'TWO_WAY'],
      default: 'TWO_WAY'
    },
    allocationStartDate: {
      type: Date,
      required: true
    },
    allocationEndDate: Date,
    transportFee: {
      type: Number,
      required: true,
      min: 0
    },
    feePaymentStatus: {
      type: String,
      enum: ['PAID', 'PARTIAL', 'PENDING', 'OVERDUE'],
      default: 'PENDING'
    },
    allocationStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TRANSFERRED', 'GRADUATED'],
      default: 'ACTIVE',
      index: true
    },
    parentName: String,
    parentPhone: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    specialInstructions: String,
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
studentTransportSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('StudentTransport').countDocuments({ schoolId: this.schoolId });
    this.code = `ALLOC-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
studentTransportSchema.index({ schoolId: 1, allocationStatus: 1 });
studentTransportSchema.index({ schoolId: 1, studentId: 1 });
studentTransportSchema.index({ schoolId: 1, routeId: 1 });
studentTransportSchema.index({ schoolId: 1, busId: 1 });

module.exports = mongoose.model('StudentTransport', studentTransportSchema);
