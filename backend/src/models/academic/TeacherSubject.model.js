/**
 * Teacher Subject Model
 * Represents subject assignment to a teacher
 */

const mongoose = require('mongoose');

const teacherSubjectSchema = new mongoose.Schema(
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
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: [true, 'Academic year is required'],
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    isHeadOfDepartment: {
      type: Boolean,
      default: false,
    },
    assignmentDate: Date,
    qualifications: [String],
    experience: Number,
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
teacherSubjectSchema.index({ schoolId: 1, teacher: 1, subject: 1, academicYear: 1 });

module.exports = mongoose.model('TeacherSubject', teacherSubjectSchema);
