const mongoose = require('mongoose');

const applicationFormSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    formCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: FRM-{year}-{5-digit-count}'
    },
    admissionCycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdmissionCycle',
      required: true
    },
    formName: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    formType: {
      type: String,
      enum: ['ONLINE', 'OFFLINE', 'HYBRID'],
      default: 'ONLINE'
    },
    applicableClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
      }
    ],
    applicableCategories: [
      {
        type: String,
        enum: ['GENERAL', 'OBC', 'SC', 'ST', 'MINORITY', 'PWD']
      }
    ],
    fields: [
      {
        fieldId: String,
        fieldName: {
          type: String,
          required: true
        },
        fieldType: {
          type: String,
          enum: ['TEXT', 'EMAIL', 'PHONE', 'DATE', 'NUMBER', 'SELECT', 'CHECKBOX', 'TEXTAREA', 'FILE', 'RADIO', 'MULTISELECT'],
          required: true
        },
        label: String,
        placeholder: String,
        helpText: String,
        required: {
          type: Boolean,
          default: false
        },
        options: [
          {
            optionId: String,
            optionLabel: String,
            optionValue: String
          }
        ],
        validation: {
          minLength: Number,
          maxLength: Number,
          pattern: String,
          customRule: String
        },
        displayOrder: Number,
        conditional: {
          dependsOn: String,
          condition: String,
          value: String
        },
        section: {
          type: String,
          enum: ['PERSONAL', 'CONTACT', 'ACADEMIC', 'PARENT', 'ADDITIONAL', 'DOCUMENTS'],
          default: 'PERSONAL'
        }
      }
    ],
    sections: [
      {
        sectionId: String,
        sectionName: String,
        sectionDescription: String,
        displayOrder: Number,
        requiredFieldsCount: Number
      }
    ],
    documentRequirements: [
      {
        documentType: String,
        isMandatory: Boolean,
        allowedFormats: [String],
        maxFileSize: Number,
        comment: String
      }
    ],
    termsAndConditions: {
      title: String,
      content: String,
      version: String,
      acceptanceRequired: {
        type: Boolean,
        default: true
      }
    },
    privacyPolicy: {
      title: String,
      content: String,
      version: String,
      acceptanceRequired: {
        type: Boolean,
        default: true
      }
    },
    formSettings: {
      allowPartialSave: {
        type: Boolean,
        default: true
      },
      allowCopyFromPreviousYear: Boolean,
      autoSaveInterval: Number,
      showFieldLabels: {
        type: Boolean,
        default: true
      },
      showProgressBar: {
        type: Boolean,
        default: true
      },
      allowEdit: {
        type: Boolean,
        default: false
      }
    },
    totalFormsGenerated: {
      type: Number,
      default: 0
    },
    totalFormsSubmitted: {
      type: Number,
      default: 0
    },
    totalFormsIncomplete: {
      type: Number,
      default: 0
    },
    createdFromPreviousCycle: {
      type: Boolean,
      default: false
    },
    previousFormId: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ACTIVE', 'CLOSED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true
    },
    isTemplate: {
      type: Boolean,
      default: false
    },
    templateName: String,
    templateCategory: String,
    remarks: String,
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
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId
  },
  {
    timestamps: true,
    collection: 'application_forms'
  }
);

// Indexes for multi-tenancy queries
applicationFormSchema.index({ schoolId: 1, status: 1 });
applicationFormSchema.index({ schoolId: 1, admissionCycleId: 1 });
applicationFormSchema.index({ schoolId: 1, isTemplate: 1 });

// Pre-save middleware for code generation
applicationFormSchema.pre('save', async function (next) {
  if (!this.formCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('ApplicationForm').countDocuments({
      schoolId: this.schoolId
    });
    this.formCode = `FRM-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('ApplicationForm', applicationFormSchema);
