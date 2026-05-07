/**
 * HolidayCalendar Model
 * School holidays and vacation periods
 */

const mongoose = require('mongoose');

const holidayCalendarSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: [true, 'Academic year is required'],
    },
    name: {
      type: String,
      required: [true, 'Holiday name is required'],
      trim: true,
      maxlength: [100, 'Holiday name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Holiday date is required'],
      index: true,
    },
    endDate: {
      type: Date,
    },
    type: {
      type: String,
      enum: ['NATIONAL_HOLIDAY', 'SCHOOL_HOLIDAY', 'FESTIVAL', 'VACATION', 'EXAM_BREAK'],
      default: 'SCHOOL_HOLIDAY',
      required: true,
    },
    isOptional: {
      type: Boolean,
      default: false,
    },
    appliesTo: {
      type: [String],
      enum: ['STUDENTS', 'TEACHERS', 'STAFF', 'ALL'],
      default: ['ALL'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'holiday_calendars',
    timestamps: false,
  }
);

// Compound indexes for efficient queries
holidayCalendarSchema.index({ schoolId: 1, academicYear: 1, date: 1 });
holidayCalendarSchema.index({ schoolId: 1, type: 1 });

// Validation: endDate must be >= date
holidayCalendarSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  if (this.endDate && this.endDate < this.date) {
    next(new Error('End date must be greater than or equal to start date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('HolidayCalendar', holidayCalendarSchema);
