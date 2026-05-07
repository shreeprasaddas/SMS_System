/**
 * Section Model
 * Represents sections/divisions within a class
 */

const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Section name is required'],
      trim: true,
      enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    },
    code: {
      type: String,
      required: [true, 'Section code is required'],
      unique: true,
      trim: true,
    },
    description: String,
    capacity: {
      type: Number,
      default: 50,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Indexes
sectionSchema.index({ schoolId: 1, name: 1 });

module.exports = mongoose.model('Section', sectionSchema);
