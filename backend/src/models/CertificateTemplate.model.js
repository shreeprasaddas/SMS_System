/**
 * CertificateTemplate Model
 * Reusable certificate design templates for different certificate types
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const certificateTemplateSchema = new mongoose.Schema(
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
    templateName: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    templateCategory: {
      type: String,
      enum: [
        'ACADEMIC',
        'SPORTS',
        'CULTURAL',
        'CO_CURRICULAR',
        'PARTICIPATION',
        'ACHIEVEMENT',
        'SPECIAL',
        'GENERAL',
      ],
      required: true,
    },
    templateDesign: {
      orientation: {
        type: String,
        enum: ['PORTRAIT', 'LANDSCAPE'],
        default: 'LANDSCAPE',
      },
      width: {
        type: Number,
        default: 1000,
      },
      height: {
        type: Number,
        default: 700,
      },
      backgroundColor: String,
      backgroundImage: {
        url: String,
        opacity: Number,
      },
      borderDesign: {
        style: String,
        color: String,
        width: Number,
      },
      fontDefault: {
        family: {
          type: String,
          default: 'Arial',
        },
        size: Number,
        color: String,
      },
    },
    elements: [
      {
        elementId: mongoose.Schema.Types.ObjectId,
        elementType: {
          type: String,
          enum: ['TEXT', 'IMAGE', 'SIGNATURE', 'DATE', 'SEAL', 'LOGO', 'DIVIDER'],
        },
        content: String,
        position: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
        },
        size: {
          width: Number,
          height: Number,
        },
        styling: {
          fontSize: Number,
          fontFamily: String,
          color: String,
          alignment: {
            type: String,
            enum: ['LEFT', 'CENTER', 'RIGHT'],
          },
          bold: Boolean,
          italic: Boolean,
        },
        isVariable: Boolean,
        variableName: String,
      },
    ],
    signatoryFields: [
      {
        fieldId: mongoose.Schema.Types.ObjectId,
        signatoryPosition: String,
        signatoryDesignation: String,
        signatureImage: String,
        position: {
          x: Number,
          y: Number,
        },
      },
    ],
    usageCount: {
      type: Number,
      default: 0,
    },
    previewImage: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware for code generation
certificateTemplateSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('TMPL', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
certificateTemplateSchema.index({ schoolId, status: 1 });
certificateTemplateSchema.index({ schoolId, templateCategory: 1 });
certificateTemplateSchema.index({ code: 1, schoolId: 1 });

// Virtual: Total elements count
certificateTemplateSchema.virtual('totalElements').get(function () {
  return (this.elements || []).length;
});

// Virtual: Signatory count
certificateTemplateSchema.virtual('signatoryCount').get(function () {
  return (this.signatoryFields || []).length;
});

module.exports = mongoose.model('CertificateTemplate', certificateTemplateSchema);
