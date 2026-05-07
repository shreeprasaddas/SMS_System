/**
 * Circular Distribution Model
 * Schema for tracking distribution and scheduling of circulars
 */

const mongoose = require('mongoose');

const circularDistributionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    noticeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notice',
      required: true,
      index: true,
    },
    distributionStrategy: {
      type: String,
      enum: ['IMMEDIATE', 'SCHEDULED', 'BATCH', 'SELECTIVE'],
      default: 'IMMEDIATE',
    },
    recipientGroups: [
      {
        groupType: {
          type: String,
          enum: ['ROLE', 'CLASS', 'SECTION', 'INDIVIDUAL', 'ALL'],
        },
        groupId: mongoose.Schema.Types.ObjectId,
        groupName: String,
        totalRecipients: Number,
      },
    ],
    scheduledDate: {
      type: Date,
    },
    scheduledTime: {
      type: String,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    distributionStartDate: {
      type: Date,
    },
    distributionCompletionDate: {
      type: Date,
    },
    deliveryMethods: [
      {
        method: {
          type: String,
          enum: ['EMAIL', 'SMS', 'IN_APP', 'PORTAL', 'PRINT'],
        },
        enabled: Boolean,
        sentCount: { type: Number, default: 0 },
        failedCount: { type: Number, default: 0 },
        deliveryStartDate: Date,
        deliveryCompletionDate: Date,
      },
    ],
    distributionStatus: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'PAUSED'],
      default: 'PENDING',
      index: true,
    },
    acknowledgmentStats: {
      totalRequired: Number,
      totalAcknowledged: { type: Number, default: 0 },
      percentageAcknowledged: Number,
      overdueList: [mongoose.Schema.Types.ObjectId],
    },
    readStats: {
      totalRead: { type: Number, default: 0 },
      partialRead: { type: Number, default: 0 },
      notRead: { type: Number, default: 0 },
      readPercentage: Number,
    },
    analytics: {
      averageSendTime: Number,
      averageDeliveryTime: Number,
      averageReadTime: Number,
      averageAcknowledgeTime: Number,
      bounceCount: { type: Number, default: 0 },
      bounceRate: Number,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: () => new Date() },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate code
circularDistributionSchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('CDIST', this.schoolId);
  }
  next();
});

// Virtual: is distribution completed
circularDistributionSchema.virtual('isDistributionCompleted').get(function () {
  return this.distributionStatus === 'COMPLETED';
});

// Virtual: days since distribution
circularDistributionSchema.virtual('daysSinceDistribution').get(function () {
  if (!this.distributionStartDate) return null;
  return Math.ceil((new Date() - this.distributionStartDate) / (1000 * 60 * 60 * 24));
});

// Virtual: total sent count
circularDistributionSchema.virtual('totalSentCount').get(function () {
  return (
    this.deliveryMethods?.reduce((sum, method) => sum + (method.sentCount || 0), 0) || 0
  );
});

// Virtual: overall success rate
circularDistributionSchema.virtual('overallSuccessRate').get(function () {
  const totalSent = this.totalSentCount;
  const totalFailed = this.deliveryMethods?.reduce((sum, method) => sum + (method.failedCount || 0), 0) || 0;
  if (totalSent === 0) return 0;
  return Math.round(((totalSent - totalFailed) / totalSent) * 100);
});

// Compound index
circularDistributionSchema.index({ schoolId: 1, noticeId: 1 });
circularDistributionSchema.index({ schoolId: 1, distributionStatus: 1 });

circularDistributionSchema.set('toJSON', { virtuals: true });
circularDistributionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('CircularDistribution', circularDistributionSchema);
