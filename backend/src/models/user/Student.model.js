/**
 * Student Model
 * Extended user model for students with academic information
 */

const mongoose = require('mongoose');
const User = require('./User.model');

const studentSchema = new mongoose.Schema(
  {
    // Academic Information
    enrollmentNumber: {
      type: String,
      required: [true, 'Enrollment number is required'],
      unique: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
    },
    rollNumber: Number,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'LEFT'],
      default: 'ACTIVE',
    },

    // Guardian Information
    guardians: [
      {
        name: String,
        relationship: String,
        email: String,
        phone: String,
        address: String,
      },
    ],

    // Documents
    documents: [
      {
        type: String,
        url: String,
        uploadedAt: Date,
      },
    ],

    // Metadata
    admissionDate: Date,
    previousSchool: String,
    previousClass: String,
  },
  { timestamps: true }
);

// Indexes
studentSchema.index({ schoolId: 1, class: 1 });
studentSchema.index({ enrollmentNumber: 1 });

module.exports = User.discriminator('STUDENT', studentSchema);
