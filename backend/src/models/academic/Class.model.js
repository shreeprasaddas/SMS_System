/**
 * Class Model
 * Represents classes/grades in the school (e.g., Class 10, Class 12)
 */

const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Class code is required'],
      unique: true,
      trim: true,
    },
    classNumber: {
      type: Number,
      required: [true, 'Class number is required'],
    },
    stream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stream',
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: [true, 'Academic year is required'],
    },
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    totalStrength: {
      type: Number,
      default: 0,
    },
    capacity: {
      type: Number,
      default: 50,
    },
    description: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
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
classSchema.index({ schoolId: 1, academicYear: 1 });
classSchema.index({ code: 1 });

module.exports = mongoose.model('Class', classSchema);
