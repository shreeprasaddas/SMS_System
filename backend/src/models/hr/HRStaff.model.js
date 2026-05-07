const mongoose = require('mongoose');

const hrStaffSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    staffName: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      enum: ['PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER', 'LIBRARIAN', 'ACCOUNTANT', 'TRANSPORT_MANAGER', 'HOSTEL_MANAGER', 'HR_MANAGER', 'SUPPORT_STAFF'],
      required: true
    },
    department: String,
    employmentType: {
      type: String,
      enum: ['PERMANENT', 'CONTRACT', 'TEMPORARY', 'PART_TIME'],
      default: 'PERMANENT'
    },
    dateOfBirth: Date,
    dateOfJoining: {
      type: Date,
      required: true
    },
    dateOfLeaving: Date,
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    bankAccountNumber: String,
    bankName: String,
    ifscCode: String,
    panNumber: String,
    aadharNumber: String,
    qualifications: [{
      degree: String,
      specialization: String,
      institution: String,
      yearOfCompletion: Number
    }],
    experience: {
      totalYears: Number,
      previousEmployers: [{
        organizationName: String,
        designation: String,
        startDate: Date,
        endDate: Date
      }]
    },
    salaryStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalaryStructure'
    },
    basicSalary: {
      type: Number,
      min: 0
    },
    reportingTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HRStaff'
    },
    reportingToName: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RESIGNED'],
      default: 'ACTIVE',
      index: true
    },
    approvalStatus: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'],
      default: 'DRAFT'
    },
    auditLog: [{
      action: String,
      performedBy: mongoose.Schema.Types.ObjectId,
      timestamp: {
        type: Date,
        default: Date.now
      },
      changes: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Pre-save middleware: auto-generate code
hrStaffSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('HRStaff').countDocuments({ schoolId: this.schoolId });
    this.code = `STAFF-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
hrStaffSchema.index({ schoolId: 1, status: 1 });
hrStaffSchema.index({ schoolId: 1, designation: 1 });
hrStaffSchema.index({ schoolId: 1, userId: 1 });

module.exports = mongoose.model('HRStaff', hrStaffSchema);
