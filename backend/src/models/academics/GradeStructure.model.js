/**
 * GradeStructure Model
 * School-wide grading scale configuration
 */

const mongoose = require('mongoose');

const gradeStructureSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    gradeScale: [
      {
        grade: {
          type: String,
          required: true,
          enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'PASS', 'FAIL'],
        },
        minMarks: {
          type: Number,
          required: true,
          min: 0,
        },
        maxMarks: {
          type: Number,
          required: true,
          min: 0,
        },
        gradePoints: {
          type: Number,
          required: true,
        },
        description: String,
        _id: false,
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalDate: Date,
  },
  {
    timestamps: true,
    collection: 'gradeStructures',
  }
);

// Indexes
gradeStructureSchema.index({ schoolId: 1, academicYear: 1 });
gradeStructureSchema.index({ schoolId: 1, status: 1 });

module.exports = mongoose.model('GradeStructure', gradeStructureSchema);
