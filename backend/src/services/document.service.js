/**
 * Document Service
 * Business logic for document management, issuance, and verification
 */

const CertificateTemplate = require('../models/documents/CertificateTemplate.model');
const DocumentIssued = require('../models/documents/DocumentIssued.model');
const DocumentRequest = require('../models/documents/DocumentRequest.model');
const DocumentVerification = require('../models/documents/DocumentVerification.model');
const DocumentArchive = require('../models/documents/DocumentArchive.model');
const { AppError } = require('../utils/errorHelper');

class DocumentService {
  /**
   * Create certificate template
   */
  async createTemplate(schoolId, data) {
    const template = new CertificateTemplate({
      ...data,
      schoolId,
    });
    return await template.save();
  }

  /**
   * Get certificate templates
   */
  async getTemplates(schoolId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { schoolId, ...filters };

    const [templates, total] = await Promise.all([
      CertificateTemplate.find(query).skip(skip).limit(limit).lean(),
      CertificateTemplate.countDocuments(query),
    ]);

    return {
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get template by ID
   */
  async getTemplateById(schoolId, templateId) {
    const template = await CertificateTemplate.findOne({ _id: templateId, schoolId });
    if (!template) {
      throw new AppError('Template not found', 404);
    }
    return template;
  }

  /**
   * Update template
   */
  async updateTemplate(schoolId, templateId, data) {
    const template = await CertificateTemplate.findOneAndUpdate(
      { _id: templateId, schoolId },
      { ...data, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );
    if (!template) {
      throw new AppError('Template not found', 404);
    }
    return template;
  }

  /**
   * Issue document
   */
  async issueDocument(schoolId, data) {
    // Verify template exists
    const template = await CertificateTemplate.findOne({ _id: data.template, schoolId });
    if (!template) {
      throw new AppError('Template not found', 404);
    }

    const document = new DocumentIssued({
      ...data,
      schoolId,
      documentNumber: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
    const saved = await document.save();

    // Add audit log entry
    saved.auditLog.push({
      action: 'CREATED',
      performedBy: data.createdBy,
      performedDate: new Date(),
      details: 'Document created',
    });

    return await saved.save();
  }

  /**
   * Get issued documents
   */
  async getIssuedDocuments(schoolId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { schoolId, ...filters };

    const [documents, total] = await Promise.all([
      DocumentIssued.find(query)
        .populate('student', 'name rollNumber')
        .populate('template', 'templateName type')
        .populate('class', 'name')
        .skip(skip)
        .limit(limit)
        .lean(),
      DocumentIssued.countDocuments(query),
    ]);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get document by ID
   */
  async getDocumentById(schoolId, documentId) {
    const document = await DocumentIssued.findOne({ _id: documentId, schoolId })
      .populate('student')
      .populate('template')
      .populate('class')
      .populate('approvalDetails.approvedBy', 'name email');
    if (!document) {
      throw new AppError('Document not found', 404);
    }
    return document;
  }

  /**
   * Approve document
   */
  async approveDocument(schoolId, documentId, data) {
    const document = await DocumentIssued.findOneAndUpdate(
      { _id: documentId, schoolId },
      {
        status: 'APPROVED',
        'approvalDetails.approvedBy': data.approvedBy,
        'approvalDetails.approvalDate': new Date(),
        'approvalDetails.comments': data.comments,
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Add audit log
    document.auditLog.push({
      action: 'APPROVED',
      performedBy: data.approvedBy,
      performedDate: new Date(),
      details: data.comments,
    });

    return await document.save();
  }

  /**
   * Reject document
   */
  async rejectDocument(schoolId, documentId, data) {
    const document = await DocumentIssued.findOneAndUpdate(
      { _id: documentId, schoolId },
      {
        status: 'REJECTED',
        'approvalDetails.rejectionReason': data.rejectionReason,
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Add audit log
    document.auditLog.push({
      action: 'REJECTED',
      performedBy: data.rejectedBy,
      performedDate: new Date(),
      details: data.rejectionReason,
    });

    return await document.save();
  }

  /**
   * Create document request
   */
  async createRequest(schoolId, data) {
    const request = new DocumentRequest({
      ...data,
      schoolId,
      requestNumber: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
    return await request.save();
  }

  /**
   * Get document requests
   */
  async getRequests(schoolId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { schoolId, ...filters };

    const [requests, total] = await Promise.all([
      DocumentRequest.find(query)
        .populate('student', 'name rollNumber')
        .populate('requestedBy')
        .populate('processingDetails.assignedTo', 'name')
        .skip(skip)
        .limit(limit)
        .lean(),
      DocumentRequest.countDocuments(query),
    ]);

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get request by ID
   */
  async getRequestById(schoolId, requestId) {
    const request = await DocumentRequest.findOne({ _id: requestId, schoolId })
      .populate('student')
      .populate('requestedBy')
      .populate('originalDocument');
    if (!request) {
      throw new AppError('Request not found', 404);
    }
    return request;
  }

  /**
   * Update request status
   */
  async updateRequestStatus(schoolId, requestId, status, data) {
    const request = await DocumentRequest.findOneAndUpdate(
      { _id: requestId, schoolId },
      {
        status,
        ...data,
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!request) {
      throw new AppError('Request not found', 404);
    }

    // Add audit log
    request.auditLog.push({
      action: status,
      performedBy: data.updatedBy,
      performedDate: new Date(),
      remarks: data.remarks,
    });

    return await request.save();
  }

  /**
   * Create document verification
   */
  async createVerification(schoolId, data) {
    const verification = new DocumentVerification({
      ...data,
      schoolId,
      verificationNumber: `VER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
    return await verification.save();
  }

  /**
   * Get verifications
   */
  async getVerifications(schoolId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { schoolId, ...filters };

    const [verifications, total] = await Promise.all([
      DocumentVerification.find(query)
        .populate('document', 'documentNumber documentType')
        .populate('student', 'name')
        .populate('verifiedBy', 'name')
        .skip(skip)
        .limit(limit)
        .lean(),
      DocumentVerification.countDocuments(query),
    ]);

    return {
      verifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get verification by ID
   */
  async getVerificationById(schoolId, verificationId) {
    const verification = await DocumentVerification.findOne({ _id: verificationId, schoolId })
      .populate('document')
      .populate('student')
      .populate('verifiedBy');
    if (!verification) {
      throw new AppError('Verification not found', 404);
    }
    return verification;
  }

  /**
   * Complete verification
   */
  async completeVerification(schoolId, verificationId, data) {
    const verification = await DocumentVerification.findOneAndUpdate(
      { _id: verificationId, schoolId },
      {
        verificationStatus: 'VERIFIED',
        verifiedBy: data.verifiedBy,
        verificationDate: new Date(),
        ...data,
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!verification) {
      throw new AppError('Verification not found', 404);
    }

    // Add audit log
    verification.auditLog.push({
      action: 'VERIFICATION_COMPLETED',
      performedBy: data.verifiedBy,
      performedDate: new Date(),
      details: `Status: ${data.authenticityCheck?.overallStatus}`,
    });

    return await verification.save();
  }

  /**
   * Archive document
   */
  async archiveDocument(schoolId, documentId, data) {
    const archive = new DocumentArchive({
      ...data,
      schoolId,
      document: documentId,
      archiveNumber: `ARC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
    return await archive.save();
  }

  /**
   * Get archived documents
   */
  async getArchivedDocuments(schoolId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { schoolId, ...filters };

    const [archives, total] = await Promise.all([
      DocumentArchive.find(query)
        .populate('document', 'documentNumber')
        .populate('student', 'name')
        .skip(skip)
        .limit(limit)
        .lean(),
      DocumentArchive.countDocuments(query),
    ]);

    return {
      archives,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get archive by ID
   */
  async getArchiveById(schoolId, archiveId) {
    const archive = await DocumentArchive.findOne({ _id: archiveId, schoolId })
      .populate('document')
      .populate('student')
      .populate('createdBy', 'name');
    if (!archive) {
      throw new AppError('Archive not found', 404);
    }
    return archive;
  }

  /**
   * Get documents by student
   */
  async getDocumentsByStudent(schoolId, studentId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      DocumentIssued.find({ schoolId, student: studentId, status: 'ISSUED' })
        .populate('template', 'templateName')
        .skip(skip)
        .limit(limit)
        .lean(),
      DocumentIssued.countDocuments({ schoolId, student: studentId, status: 'ISSUED' }),
    ]);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(schoolId) {
    const [templateStats, issuedStats, requestStats, verificationStats, archiveStats] = await Promise.all([
      CertificateTemplate.countDocuments({ schoolId, isActive: true }),
      DocumentIssued.aggregate([
        { $match: { schoolId } },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            issuedCount: { $sum: { $cond: [{ $eq: ['$status', 'ISSUED'] }, 1, 0] } },
            pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'PENDING_APPROVAL'] }, 1, 0] } },
            revokedCount: { $sum: { $cond: [{ $eq: ['$status', 'REVOKED'] }, 1, 0] } },
          },
        },
      ]),
      DocumentRequest.aggregate([
        { $match: { schoolId } },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
            deliveredCount: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } },
          },
        },
      ]),
      DocumentVerification.aggregate([
        { $match: { schoolId } },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            verifiedCount: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'VERIFIED'] }, 1, 0] } },
            authenticCount: { $sum: { $cond: [{ $eq: ['$authenticityCheck.overallStatus', 'AUTHENTIC'] }, 1, 0] } },
          },
        },
      ]),
      DocumentArchive.countDocuments({ schoolId }),
    ]);

    return {
      templates: templateStats,
      issued: issuedStats[0] || {},
      requests: requestStats[0] || {},
      verifications: verificationStats[0] || {},
      archivedCount: archiveStats,
    };
  }

  /**
   * Get expiring documents
   */
  async getExpiringDocuments(schoolId, daysAhead = 30) {
    const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

    const expiringDocs = await DocumentIssued.find({
      schoolId,
      expiryDate: {
        $gt: new Date(),
        $lte: futureDate,
      },
      status: 'ISSUED',
    })
      .populate('student', 'name')
      .lean();

    return expiringDocs;
  }

  /**
   * Bulk issue documents
   */
  async bulkIssueDocuments(schoolId, data) {
    const { templateId, students, documentData } = data;

    // Verify template exists
    const template = await CertificateTemplate.findOne({ _id: templateId, schoolId });
    if (!template) {
      throw new AppError('Template not found', 404);
    }

    const documents = students.map(studentId => ({
      schoolId,
      student: studentId,
      template: templateId,
      documentType: template.type,
      documentNumber: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'DRAFT',
      documentData,
      createdBy: data.createdBy,
    }));

    return await DocumentIssued.insertMany(documents);
  }
}

module.exports = new DocumentService();
