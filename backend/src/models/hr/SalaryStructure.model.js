const mongoose = require('mongoose');

const salaryStructureSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true
    },
    description: String,
    designation: {
      type: String,
      enum: ['PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER', 'LIBRARIAN', 'ACCOUNTANT', 'TRANSPORT_MANAGER', 'HOSTEL_MANAGER', 'HR_MANAGER', 'SUPPORT_STAFF'],
      required: true
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0
    },
    earnings: [{
      component: {
        type: String,
        enum: ['HRA', 'DA', 'BONUS', 'ALLOWANCE', 'INCENTIVE', 'OTHER'],
        required: true
      },
      amount: {
        type: Number,
        min: 0
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100
      },
      description: String
    }],
    deductions: [{
      component: {
        type: String,
        enum: ['PF', 'ESI', 'INCOME_TAX', 'INSURANCE', 'OTHER'],
        required: true
      },
      amount: {
        type: Number,
        min: 0
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100
      },
      description: String
    }],
    grossSalary: Number,
    netSalary: Number,
    effectiveFrom: {
      type: Date,
      required: true
    },
    effectiveTo: Date,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
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
salaryStructureSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('SalaryStructure').countDocuments({ schoolId: this.schoolId });
    this.code = `SALARY-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
salaryStructureSchema.index({ schoolId: 1, designation: 1 });
salaryStructureSchema.index({ schoolId: 1, status: 1 });
salaryStructureSchema.index({ schoolId: 1, effectiveFrom: 1 });

module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);
