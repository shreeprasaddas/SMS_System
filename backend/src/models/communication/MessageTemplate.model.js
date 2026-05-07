const mongoose = require('mongoose');

const messageTemplateSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    templateCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: TMT-{year}-{5-digit-count}'
    },
    templateName: {
      type: String,
      required: true,
      min: 3,
      max: 100
    },
    description: String,
    templateType: {
      type: String,
      enum: ['EMAIL', 'SMS', 'IN_APP_MESSAGE', 'PUSH_NOTIFICATION'],
      required: true
    },
    category: {
      type: String,
      enum: ['ANNOUNCEMENT', 'ASSIGNMENT', 'GRADE', 'ATTENDANCE', 'LEAVE', 'FEE', 'EVENT', 'ALERT', 'CUSTOM'],
      default: 'CUSTOM'
    },
    subject: {
      type: String,
      comment: 'Email subject or notification title'
    },
    bodyTemplate: {
      type: String,
      required: true,
      comment: 'Template with placeholders like {{studentName}}, {{className}}, etc.'
    },
    variables: [
      {
        variableName: {
          type: String,
          required: true,
          comment: 'e.g., studentName, className, grades'
        },
        displayName: String,
        dataType: {
          type: String,
          enum: ['STRING', 'NUMBER', 'DATE', 'ARRAY', 'OBJECT'],
          default: 'STRING'
        },
        isRequired: {
          type: Boolean,
          default: false
        },
        defaultValue: mongoose.Schema.Types.Mixed
      }
    ],
    placeholders: [
      {
        placeholder: String,
        description: String,
        example: String
      }
    ],
    language: {
      type: String,
      default: 'EN',
      enum: ['EN', 'HI', 'ES', 'FR', 'DE']
    },
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'DRAFT',
      index: true
    },
    isSystemTemplate: {
      type: Boolean,
      default: false,
      comment: 'System templates cannot be deleted'
    },
    isDefault: {
      type: Boolean,
      default: false,
      comment: 'Default template for this category'
    },
    channelConfig: {
      email: {
        enabled: {
          type: Boolean,
          default: false
        },
        subject: String,
        htmlTemplate: String,
        textTemplate: String
      },
      sms: {
        enabled: {
          type: Boolean,
          default: false
        },
        messageTemplate: String,
        characterLimit: {
          type: Number,
          default: 160
        }
      },
      pushNotification: {
        enabled: {
          type: Boolean,
          default: false
        },
        title: String,
        body: String,
        icon: String
      },
      inAppMessage: {
        enabled: {
          type: Boolean,
          default: true
        },
        title: String,
        body: String,
        backgroundColor: String
      }
    },
    usageCount: {
      type: Number,
      default: 0
    },
    lastUsedDate: Date,
    lastUsedBy: mongoose.Schema.Types.ObjectId,
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdByName: String,
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
    collection: 'message_templates'
  }
);

// Indexes for multi-tenancy queries
messageTemplateSchema.index({ schoolId: 1, status: 1 });
messageTemplateSchema.index({ schoolId: 1, templateType: 1 });
messageTemplateSchema.index({ schoolId: 1, category: 1 });
messageTemplateSchema.index({ schoolId: 1, isSystemTemplate: 1 });

// Pre-save middleware for code generation
messageTemplateSchema.pre('save', async function (next) {
  if (!this.templateCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('MessageTemplate').countDocuments({
      schoolId: this.schoolId
    });
    this.templateCode = `TMT-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('MessageTemplate', messageTemplateSchema);
