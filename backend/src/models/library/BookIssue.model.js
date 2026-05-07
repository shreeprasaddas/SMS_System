const mongoose = require('mongoose');

const bookIssueSchema = new mongoose.Schema(
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
      required: true,
      index: true
    },
    userRole: {
      type: String,
      enum: ['STUDENT', 'TEACHER', 'STAFF', 'PARENT'],
      required: true
    },
    userName: String,
    issueDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    returnDate: Date,
    issueType: {
      type: String,
      enum: ['NORMAL', 'REFERENCE', 'RUSH'],
      default: 'NORMAL'
    },
    renewalCount: {
      type: Number,
      default: 0,
      min: 0
    },
    renewalHistory: [{
      renewalDate: Date,
      newDueDate: Date,
      renewedBy: mongoose.Schema.Types.ObjectId
    }],
    issuedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    returnedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['ISSUED', 'RETURNED', 'OVERDUE', 'LOST', 'DAMAGED'],
      default: 'ISSUED',
      index: true
    },
    remarks: String,
    bookConditionOnReturn: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'LOST', 'DAMAGED']
    },
    fineDetails: {
      finePerDay: Number,
      daysOverdue: {
        type: Number,
        default: 0
      },
      totalFineAmount: {
        type: Number,
        default: 0
      },
      finePaid: {
        type: Boolean,
        default: false
      },
      paidDate: Date,
      paymentMethod: String
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
bookIssueSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('BookIssue').countDocuments({ schoolId: this.schoolId });
    this.code = `ISSUE-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
bookIssueSchema.index({ schoolId: 1, status: 1 });
bookIssueSchema.index({ schoolId: 1, userId: 1, status: 1 });
bookIssueSchema.index({ schoolId: 1, bookId: 1 });
bookIssueSchema.index({ schoolId: 1, dueDate: 1 });

module.exports = mongoose.model('BookIssue', bookIssueSchema);
