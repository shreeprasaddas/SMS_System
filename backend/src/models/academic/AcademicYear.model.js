/**
 * Academic Year Model
 * Represents school academic calendar
 */

const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Academic year name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Academic year code is required'],
      unique: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['PLANNING', 'ACTIVE', 'CLOSED', 'ARCHIVED'],
      default: 'PLANNING',
    },
    terms: [
      {
        name: String,
        startDate: Date,
        endDate: Date,
        examStartDate: Date,
        examEndDate: Date,
      },
    ],
    holidays: [
      {
        name: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Indexes
academicYearSchema.index({ schoolId: 1, isActive: 1 });
academicYearSchema.index({ code: 1 });

// Validate end date is after start date
academicYearSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('AcademicYear', academicYearSchema);
