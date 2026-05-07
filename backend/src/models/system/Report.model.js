/**
 * Report Model
 * Represents system reports and analytics
 */

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  reportName: {
    type: String,
    required: true,
    trim: true,
  },
  reportType: {
    type: String,
    enum: ['STUDENT_ACADEMIC', 'STUDENT_ATTENDANCE', 'STUDENT_BEHAVIOR', 'TEACHER_PERFORMANCE', 'CLASS_PERFORMANCE', 'FINANCIAL', 'INVENTORY', 'HR', 'TRANSPORT', 'LIBRARY', 'HOSTEL', 'CUSTOM'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  reportPeriod: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  filters: {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    academicYear: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
  },
  data: mongoose.Schema.Types.Mixed, // Flexible data structure for different report types
  summary: {
    totalRecords: {
      type: Number,
      default: 0,
    },
    processedRecords: {
      type: Number,
      default: 0,
    },
    summary: mongoose.Schema.Types.Mixed,
  },
  fileUrl: {
    type: String,
    trim: true,
  },
  fileFormat: {
    type: String,
    enum: ['PDF', 'EXCEL', 'CSV', 'JSON'],
    default: 'PDF',
  },
  status: {
    type: String,
    enum: ['GENERATING', 'GENERATED', 'FAILED', 'ARCHIVED'],
    default: 'GENERATED',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
reportSchema.index({ schoolId: 1, reportType: 1 });
reportSchema.index({ schoolId: 1, generatedAt: -1 });
reportSchema.index({ schoolId: 1, status: 1 });
reportSchema.index({ schoolId: 1, generatedBy: 1 });

module.exports = mongoose.model('Report', reportSchema);
