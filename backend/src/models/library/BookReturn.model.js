/**
 * Book Return Model
 * Represents book return transactions
 */

const mongoose = require('mongoose');

const bookReturnSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  bookIssue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookIssue',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LibraryMember',
    required: true,
  },
  returnNumber: {
    type: String,
    required: true,
    unique: true,
  },
  returnDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  daysOverdue: {
    type: Number,
    default: 0,
    min: 0,
  },
  fineAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  finePaid: {
    type: Boolean,
    default: false,
  },
  bookCondition: {
    type: String,
    required: true,
    enum: ['GOOD', 'DAMAGED', 'LOST'],
    default: 'GOOD',
  },
  damageDescription: {
    type: String,
    trim: true,
  },
  processingFee: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['RETURNED', 'DAMAGED', 'LOST', 'PENDING_FINE'],
    default: 'RETURNED',
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes
bookReturnSchema.index({ schoolId: 1, bookIssue: 1 }, { unique: true });
bookReturnSchema.index({ schoolId: 1, member: 1 });
bookReturnSchema.index({ schoolId: 1, returnNumber: 1 }, { unique: true });
bookReturnSchema.index({ schoolId: 1, returnDate: 1 });
bookReturnSchema.index({ schoolId: 1, status: 1 });

module.exports = mongoose.model('BookReturn', bookReturnSchema);
