/**
 * Stream Model
 * Represents academic streams (Science, Commerce, Arts, etc.)
 */

const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Stream name is required'],
      trim: true,
      enum: ['SCIENCE', 'COMMERCE', 'ARTS', 'VOCATIONAL', 'GENERAL'],
    },
    code: {
      type: String,
      required: [true, 'Stream code is required'],
      unique: true,
    },
    description: String,
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
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
streamSchema.index({ schoolId: 1, name: 1 });

module.exports = mongoose.model('Stream', streamSchema);
