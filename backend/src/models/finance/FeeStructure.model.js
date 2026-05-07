/**
 * FeeStructure Model
 * School-level fee structure and categories
 */

const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Fee structure name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: [true, 'Academic year is required'],
    },
    classes: [
      {
        class: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class',
          required: true,
        },
        sections: [
          {
            section: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Section',
            },
            fees: [
              {
                name: {
                  type: String,
                  required: true,
                  enum: [
                    'TUITION',
                    'TRANSPORT',
                    'EXAMINATION',
                    'LIBRARY',
                    'SPORTS',
                    'DEVELOPMENT',
                    'OTHER',
                  ],
                },
                amount: {
                  type: Number,
                  required: true,
                  min: [0, 'Amount cannot be negative'],
                },
                frequency: {
                  type: String,
                  enum: ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL'],
                  default: 'ANNUAL',
                },
                dueDate: Date,
              },
            ],
          },
        ],
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'DRAFT',
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'fee_structures',
    timestamps: false,
  }
);

// Indexes for efficient queries
feeStructureSchema.index({ schoolId: 1, academicYear: 1, status: 1 });
feeStructureSchema.index({ schoolId: 1, status: 1 });

// Pre-save middleware to calculate total amount
feeStructureSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  let total = 0;
  this.classes.forEach((classObj) => {
    classObj.sections.forEach((sectionObj) => {
      sectionObj.fees.forEach((fee) => {
        total += fee.amount;
      });
    });
  });

  this.totalAmount = total;
  next();
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
