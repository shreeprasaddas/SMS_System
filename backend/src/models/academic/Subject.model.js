/**
 * Subject Model
 * Represents subjects offered in the school
 */

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      trim: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['CORE', 'ELECTIVE', 'SKILL', 'LANGUAGE'],
      default: 'CORE',
    },
    isTheoryBased: {
      type: Boolean,
      default: true,
    },
    isPracticalBased: {
      type: Boolean,
      default: false,
    },
    streams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
      },
    ],
    maxMarks: {
      type: Number,
      default: 100,
    },
    passingMarks: {
      type: Number,
      default: 40,
    },
    creditHours: Number,
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
subjectSchema.index({ schoolId: 1, code: 1 });
subjectSchema.index({ category: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
