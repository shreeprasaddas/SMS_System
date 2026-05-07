/**
 * Curriculum Model
 * Represents curriculum/syllabus for a subject in a class
 */

const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: [true, 'Academic year is required'],
    },
    name: {
      type: String,
      required: [true, 'Curriculum name is required'],
      trim: true,
    },
    chapters: [
      {
        name: String,
        description: String,
        sequence: Number,
        startDate: Date,
        endDate: Date,
        topics: [
          {
            name: String,
            description: String,
          },
        ],
      },
    ],
    totalLessons: Number,
    totalAssignments: Number,
    totalTests: Number,
    description: String,
    status: {
      type: String,
      enum: ['DRAFT', 'APPROVED', 'ACTIVE', 'ARCHIVED'],
      default: 'DRAFT',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Indexes
curriculumSchema.index({ schoolId: 1, subject: 1, class: 1, academicYear: 1 });

module.exports = mongoose.model('Curriculum', curriculumSchema);
