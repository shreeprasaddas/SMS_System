/**
 * Document Validation Schemas
 * Joi validation for document operations
 */

const Joi = require('joi');

module.exports = {
  // Template Schemas
  createTemplateSchema: Joi.object({
    templateName: Joi.string().required().trim().messages({
      'string.empty': 'Template name is required',
    }),
    templateCode: Joi.string().required().trim().messages({
      'string.empty': 'Template code is required',
    }),
    type: Joi.string()
      .required()
      .valid('COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'DIPLOMA', 'MARKSHEET', 'CONDUCT_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'CUSTOM')
      .messages({
        'any.only': 'Invalid document type',
      }),
    description: Joi.string().optional().trim(),
    orientation: Joi.string().optional().valid('PORTRAIT', 'LANDSCAPE'),
    pageSize: Joi.string().optional().valid('A4', 'A3', 'LETTER', 'LEGAL'),
    header: Joi.object({
      schoolName: Joi.string().optional(),
      schoolLogo: Joi.string().optional().uri(),
      schoolAddress: Joi.string().optional(),
    }).optional(),
    body: Joi.object({
      title: Joi.string().optional(),
      content: Joi.string().required().trim(),
      subtitle: Joi.string().optional(),
    }).required(),
    footer: Joi.object({
      issueDate: Joi.boolean().optional(),
      footerText: Joi.string().optional(),
    }).optional(),
    signatures: Joi.array().items(
      Joi.object({
        position: Joi.string().required(),
        name: Joi.string().required(),
        title: Joi.string().required(),
      })
    ).optional(),
    placeholders: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
      })
    ).optional(),
  }),

  updateTemplateSchema: Joi.object({
    templateName: Joi.string().optional().trim(),
    description: Joi.string().optional().trim(),
    body: Joi.object().optional(),
    isActive: Joi.boolean().optional(),
  }),

  getTemplatesSchema: Joi.object({
    type: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    page: Joi.number().optional().default(1).min(1),
    limit: Joi.number().optional().default(10).min(1).max(100),
  }),

  // Document Issuance Schemas
  issueDocumentSchema: Joi.object({
    student: Joi.string().required().trim().messages({
      'string.empty': 'Student ID is required',
    }),
    template: Joi.string().required().trim().messages({
      'string.empty': 'Template ID is required',
    }),
    documentType: Joi.string()
      .required()
      .valid('COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'DIPLOMA', 'MARKSHEET', 'CONDUCT_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'TRANSFER_CERTIFICATE', 'PROVISIONAL_CERTIFICATE', 'CUSTOM'),
    class: Joi.string().optional(),
    academicYear: Joi.string().optional(),
    documentData: Joi.object().required(),
    issueDate: Joi.date().optional(),
    expiryDate: Joi.date().optional(),
    serialNumber: Joi.string().optional().trim(),
  }),

  approveDocumentSchema: Joi.object({
    comments: Joi.string().optional().trim(),
  }),

  rejectDocumentSchema: Joi.object({
    rejectionReason: Joi.string().required().trim().messages({
      'string.empty': 'Rejection reason is required',
    }),
  }),

  getIssuedDocumentsSchema: Joi.object({
    status: Joi.string().optional(),
    documentType: Joi.string().optional(),
    class: Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    limit: Joi.number().optional().default(10).min(1).max(100),
  }),

  // Request Schemas
  createRequestSchema: Joi.object({
    requestType: Joi.string()
      .required()
      .valid('DUPLICATE', 'ADDITIONAL_COPY', 'AMENDMENT', 'VERIFICATION', 'TRANSCRIPT', 'CHARACTER_REFERENCE')
      .messages({
        'any.only': 'Invalid request type',
      }),
    student: Joi.string().required().trim().messages({
      'string.empty': 'Student ID is required',
    }),
    documentType: Joi.string()
      .required()
      .valid('COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'DIPLOMA', 'MARKSHEET', 'CONDUCT_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'TRANSFER_CERTIFICATE', 'PROVISIONAL_CERTIFICATE', 'CUSTOM'),
    purpose: Joi.string().optional().trim(),
    requiredByDate: Joi.date().optional(),
    quantity: Joi.number().optional().min(1).default(1),
    numberOfCopies: Joi.number().optional().min(1).default(1),
    isUrgent: Joi.boolean().optional().default(false),
  }),

  updateRequestStatusSchema: Joi.object({
    status: Joi.string()
      .required()
      .valid('PENDING', 'APPROVED', 'PROCESSING', 'READY', 'DISPATCHED', 'DELIVERED', 'REJECTED', 'CANCELLED')
      .messages({
        'any.only': 'Invalid status',
      }),
    remarks: Joi.string().optional().trim(),
    deliveryDetails: Joi.object({
      mode: Joi.string().optional().valid('DIRECT_COLLECTION', 'COURIER', 'EMAIL', 'POSTAL'),
      address: Joi.object().optional(),
    }).optional(),
  }),

  getRequestsSchema: Joi.object({
    status: Joi.string().optional(),
    requestType: Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    limit: Joi.number().optional().default(10).min(1).max(100),
  }),

  // Verification Schemas
  createVerificationSchema: Joi.object({
    document: Joi.string().required().trim().messages({
      'string.empty': 'Document ID is required',
    }),
    student: Joi.string().required().trim(),
    requestedBy: Joi.object({
      organizationName: Joi.string().required(),
      contactPerson: Joi.string().optional(),
      email: Joi.string().optional().email(),
      phone: Joi.string().optional(),
    }).optional(),
    verificationMethod: Joi.string().optional().valid('ONLINE', 'MANUAL', 'BIOMETRIC', 'BLOCKCHAIN'),
  }),

  completeVerificationSchema: Joi.object({
    verificationDetails: Joi.object({
      serialNumberVerified: Joi.boolean().required(),
      registrationNumberVerified: Joi.boolean().required(),
      studentDetailsVerified: Joi.boolean().required(),
      signatureVerified: Joi.boolean().required(),
    }).required(),
    authenticityCheck: Joi.object({
      overallStatus: Joi.string()
        .required()
        .valid('AUTHENTIC', 'SUSPICIOUS', 'FORGED', 'INCONCLUSIVE'),
    }).required(),
    findings: Joi.object({
      summary: Joi.string().required(),
      recommendations: Joi.string().optional(),
    }).optional(),
  }),

  getVerificationsSchema: Joi.object({
    verificationStatus: Joi.string().optional(),
    verificationMethod: Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    limit: Joi.number().optional().default(10).min(1).max(100),
  }),

  // Archive Schemas
  archiveDocumentSchema: Joi.object({
    retentionPeriod: Joi.object({
      years: Joi.number().required().min(1),
      startDate: Joi.date().optional(),
    }).required(),
    storageLocation: Joi.object({
      physical: Joi.object({
        building: Joi.string().required(),
        room: Joi.string().required(),
        boxNumber: Joi.string().required(),
      }).required(),
    }).required(),
    digitalization: Joi.object({
      isDigitized: Joi.boolean().optional(),
      digitizationQuality: Joi.string().optional().valid('LOW', 'MEDIUM', 'HIGH', 'ARCHIVAL'),
    }).optional(),
  }),

  getArchivedDocumentsSchema: Joi.object({
    'disposalDetails.status': Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    limit: Joi.number().optional().default(10).min(1).max(100),
  }),

  // Bulk Operations
  bulkIssueDocumentsSchema: Joi.object({
    templateId: Joi.string().required().trim().messages({
      'string.empty': 'Template ID is required',
    }),
    students: Joi.array().items(Joi.string()).required().min(1).messages({
      'array.min': 'At least one student is required',
    }),
    documentData: Joi.object().required(),
  }),
};
