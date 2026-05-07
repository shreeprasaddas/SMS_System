/**
 * Book Shelf Model
 * Represents physical shelves/racks in the library
 */

const mongoose = require('mongoose');

const bookShelfSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  shelfNumber: {
    type: String,
    required: true,
    trim: true,
  },
  shelfName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'REFERENCE', 'TEXTBOOK', 'OTHER'],
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  currentBooks: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'FULL'],
    default: 'ACTIVE',
  },
  description: {
    type: String,
    trim: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
bookShelfSchema.index({ schoolId: 1, shelfNumber: 1 }, { unique: true });
bookShelfSchema.index({ schoolId: 1, category: 1 });
bookShelfSchema.index({ schoolId: 1, status: 1 });

module.exports = mongoose.model('BookShelf', bookShelfSchema);
