/**
 * Teacher Model
 * Extended user model for teachers with professional information
 */

const mongoose = require('mongoose');
const User = require('./User.model');

const teacherSchema = new mongoose.Schema(
  {
    // Professional Information
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    designation: String,
    department: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'RETIRED'],
      default: 'ACTIVE',
    },

    // Qualifications
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
        specialization: String,
      },
    ],

    // Experience
    experience: [
      {
        organization: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    // Employment
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    salaryGrade: String,
    bankAccount: String,
    pfNumber: String,

    // Metadata
    documents: [
      {
        type: String,
        url: String,
        uploadedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Indexes
teacherSchema.index({ schoolId: 1, employeeId: 1 });
teacherSchema.index({ subjects: 1 });

module.exports = User.discriminator('TEACHER', teacherSchema);
