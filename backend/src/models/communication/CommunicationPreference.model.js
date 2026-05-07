const mongoose = require('mongoose');

const communicationPreferenceSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    preferenceCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: PREF-{year}-{5-digit-count}'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userName: String,
    userRole: String,
    emailPreferences: {
      receiveEmails: {
        type: Boolean,
        default: true
      },
      announcements: {
        type: Boolean,
        default: true
      },
      academicUpdates: {
        type: Boolean,
        default: true
      },
      assignments: {
        type: Boolean,
        default: true
      },
      grades: {
        type: Boolean,
        default: true
      },
      attendance: {
        type: Boolean,
        default: true
      },
      fees: {
        type: Boolean,
        default: true
      },
      events: {
        type: Boolean,
        default: true
      },
      systemAlerts: {
        type: Boolean,
        default: true
      },
      newsletter: {
        type: Boolean,
        default: false
      },
      emailFrequency: {
        type: String,
        enum: ['IMMEDIATE', 'DAILY', 'WEEKLY', 'MONTHLY'],
        default: 'IMMEDIATE'
      }
    },
    smsPreferences: {
      receiveSMS: {
        type: Boolean,
        default: true
      },
      announcements: {
        type: Boolean,
        default: false
      },
      academicUpdates: {
        type: Boolean,
        default: false
      },
      assignments: {
        type: Boolean,
        default: false
      },
      grades: {
        type: Boolean,
        default: false
      },
      attendance: {
        type: Boolean,
        default: true
      },
      fees: {
        type: Boolean,
        default: true
      },
      events: {
        type: Boolean,
        default: false
      },
      systemAlerts: {
        type: Boolean,
        default: true
      },
      emergencyOnly: {
        type: Boolean,
        default: false,
        comment: 'Only receive SMS for urgent/critical alerts'
      }
    },
    pushNotificationPreferences: {
      receiveNotifications: {
        type: Boolean,
        default: true
      },
      announcements: {
        type: Boolean,
        default: true
      },
      academicUpdates: {
        type: Boolean,
        default: true
      },
      assignments: {
        type: Boolean,
        default: true
      },
      grades: {
        type: Boolean,
        default: true
      },
      attendance: {
        type: Boolean,
        default: true
      },
      fees: {
        type: Boolean,
        default: true
      },
      events: {
        type: Boolean,
        default: true
      },
      systemAlerts: {
        type: Boolean,
        default: true
      },
      soundEnabled: {
        type: Boolean,
        default: true
      },
      vibrationEnabled: {
        type: Boolean,
        default: true
      }
    },
    inAppMessagePreferences: {
      receiveMessages: {
        type: Boolean,
        default: true
      },
      announcements: {
        type: Boolean,
        default: true
      },
      personalMessages: {
        type: Boolean,
        default: true
      },
      systemNotifications: {
        type: Boolean,
        default: true
      }
    },
    quietHours: {
      enabled: {
        type: Boolean,
        default: false,
        comment: 'Disable non-critical notifications during quiet hours'
      },
      startTime: {
        type: String,
        comment: 'Format: HH:MM (24-hour)'
      },
      endTime: {
        type: String,
        comment: 'Format: HH:MM (24-hour)'
      },
      allowCriticalOnly: {
        type: Boolean,
        default: true,
        comment: 'Allow critical/urgent notifications during quiet hours'
      }
    },
    communicationChannelPriority: [
      {
        type: String,
        enum: ['IN_APP', 'EMAIL', 'SMS', 'PUSH_NOTIFICATION'],
        comment: 'Priority order: first element is highest priority'
      }
    ],
    unsubscribedCategories: [
      {
        type: String,
        enum: ['ANNOUNCEMENT', 'ACADEMIC', 'ASSIGNMENT', 'GRADE', 'ATTENDANCE', 'FEE', 'EVENT', 'ALERT'],
        comment: 'Categories from which user unsubscribed'
      }
    ],
    blockedSenders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        comment: 'Users blocked from sending direct messages'
      }
    ],
    doNotDisturb: {
      enabled: {
        type: Boolean,
        default: false
      },
      startDate: Date,
      endDate: Date,
      reason: String
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE'
    },
    lastUpdatedDate: Date,
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        changes: mongoose.Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    updatedBy: mongoose.Schema.Types.ObjectId
  },
  {
    timestamps: true,
    collection: 'communication_preferences'
  }
);

// Indexes for multi-tenancy queries
communicationPreferenceSchema.index({ schoolId: 1, userId: 1 });
communicationPreferenceSchema.index({ schoolId: 1, status: 1 });

// Pre-save middleware for code generation
communicationPreferenceSchema.pre('save', async function (next) {
  if (!this.preferenceCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('CommunicationPreference').countDocuments({
      schoolId: this.schoolId
    });
    this.preferenceCode = `PREF-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('CommunicationPreference', communicationPreferenceSchema);
