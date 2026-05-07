/**
 * Class Teacher Model
 * Represents teacher assignment to a class
 */

const mongoose = require('mongoose');

const classTeacherSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher is required'],
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
    isMainClassTeacher: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['CLASS_TEACHER', 'SUBJECT_TEACHER', 'CO_TEACHER', 'SUPPORT_TEACHER'],
      default: 'SUBJECT_TEACHER',
    },
    assignmentDate: Date,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'TRANSFERRED'],
      default: 'ACTIVE',
    },
    remarks: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Indexes
classTeacherSchema.index({ schoolId: 1, teacher: 1, academicYear: 1 });
classTeacherSchema.index({ class: 1, academicYear: 1 });

module.exports = mongoose.model('ClassTeacher', classTeacherSchema);
