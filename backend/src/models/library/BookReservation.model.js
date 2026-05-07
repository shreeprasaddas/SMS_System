const mongoose = require('mongoose');

const bookReservationSchema = new mongoose.Schema(
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
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: String,
    userRole: String,
    reservationDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: true
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM'
    },
    reservationStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'READY_FOR_PICKUP', 'CANCELLED', 'EXPIRED', 'FULFILLED'],
      default: 'PENDING',
      index: true
    },
    reason: String,
    approvedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedDate: Date,
    rejectionReason: String,
    rejectedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectedDate: Date,
    fulfilledDate: Date,
    fulfilledByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledDate: Date,
    cancelledByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancellationReason: String,
    notificationLog: [{
      notificationType: String,
      sentAt: Date,
      sentVia: String
    }],
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
bookReservationSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('BookReservation').countDocuments({ schoolId: this.schoolId });
    this.code = `RES-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
bookReservationSchema.index({ schoolId: 1, reservationStatus: 1 });
bookReservationSchema.index({ schoolId: 1, userId: 1 });
bookReservationSchema.index({ schoolId: 1, expiryDate: 1 });

module.exports = mongoose.model('BookReservation', bookReservationSchema);
