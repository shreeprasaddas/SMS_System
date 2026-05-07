/**
 * Document Controller
 * HTTP request handlers for document management
 */

const documentService = require('../services/document.service');
const responseHelper = require('../utils/responseHelper');

class DocumentController {
  /**
   * Create certificate template
   */
  async createTemplate(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const template = await documentService.createTemplate(schoolId, {
        ...req.body,
        createdBy: req.user._id,
      });
      responseHelper.created(res, template, 'Certificate template created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get certificate templates
   */
  async getTemplates(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { page = 1, limit = 10, ...filters } = req.query;

      const result = await documentService.getTemplates(schoolId, filters, parseInt(page), parseInt(limit));
      responseHelper.paginated(res, result.templates, result.pagination, 'Templates retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get template by ID
   */
  async getTemplateById(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const template = await documentService.getTemplateById(schoolId, req.params.templateId);
      responseHelper.success(res, template, 'Template retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update template
   */
  async updateTemplate(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const template = await documentService.updateTemplate(schoolId, req.params.templateId, req.body);
      responseHelper.success(res, template, 'Template updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Issue document
   */
  async issueDocument(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const document = await documentService.issueDocument(schoolId, {
        ...req.body,
        createdBy: req.user._id,
      });
      responseHelper.created(res, document, 'Document issued successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get issued documents
   */
  async getIssuedDocuments(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { page = 1, limit = 10, ...filters } = req.query;

      const result = await documentService.getIssuedDocuments(schoolId, filters, parseInt(page), parseInt(limit));
      responseHelper.paginated(res, result.documents, result.pagination, 'Documents retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get document by ID
   */
  async getDocumentById(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const document = await documentService.getDocumentById(schoolId, req.params.documentId);
      responseHelper.success(res, document, 'Document retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve document
   */
  async approveDocument(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const document = await documentService.approveDocument(schoolId, req.params.documentId, {
        ...req.body,
        approvedBy: req.user._id,
      });
      responseHelper.success(res, document, 'Document approved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject document
   */
  async rejectDocument(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const document = await documentService.rejectDocument(schoolId, req.params.documentId, {
        ...req.body,
        rejectedBy: req.user._id,
      });
      responseHelper.success(res, document, 'Document rejected successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create document request
   */
  async createRequest(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const request = await documentService.createRequest(schoolId, {
        ...req.body,
        requestedBy: req.user._id,
        requestedByType: 'User',
      });
      responseHelper.created(res, request, 'Document request created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get document requests
   */
  async getRequests(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { page = 1, limit = 10, ...filters } = req.query;

      const result = await documentService.getRequests(schoolId, filters, parseInt(page), parseInt(limit));
      responseHelper.paginated(res, result.requests, result.pagination, 'Requests retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get request by ID
   */
  async getRequestById(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const request = await documentService.getRequestById(schoolId, req.params.requestId);
      responseHelper.success(res, request, 'Request retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update request status
   */
  async updateRequestStatus(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { status, ...data } = req.body;

      const request = await documentService.updateRequestStatus(schoolId, req.params.requestId, status, {
        ...data,
        updatedBy: req.user._id,
      });
      responseHelper.success(res, request, 'Request status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create document verification
   */
  async createVerification(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const verification = await documentService.createVerification(schoolId, {
        ...req.body,
      });
      responseHelper.created(res, verification, 'Verification request created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get verifications
   */
  async getVerifications(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { page = 1, limit = 10, ...filters } = req.query;

      const result = await documentService.getVerifications(schoolId, filters, parseInt(page), parseInt(limit));
      responseHelper.paginated(res, result.verifications, result.pagination, 'Verifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get verification by ID
   */
  async getVerificationById(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const verification = await documentService.getVerificationById(schoolId, req.params.verificationId);
      responseHelper.success(res, verification, 'Verification retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete verification
   */
  async completeVerification(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const verification = await documentService.completeVerification(schoolId, req.params.verificationId, {
        ...req.body,
        verifiedBy: req.user._id,
      });
      responseHelper.success(res, verification, 'Verification completed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Archive document
   */
  async archiveDocument(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const archive = await documentService.archiveDocument(schoolId, req.params.documentId, {
        ...req.body,
        createdBy: req.user._id,
      });
      responseHelper.created(res, archive, 'Document archived successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get archived documents
   */
  async getArchivedDocuments(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { page = 1, limit = 10, ...filters } = req.query;

      const result = await documentService.getArchivedDocuments(schoolId, filters, parseInt(page), parseInt(limit));
      responseHelper.paginated(res, result.archives, result.pagination, 'Archives retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get archive by ID
   */
  async getArchiveById(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const archive = await documentService.getArchiveById(schoolId, req.params.archiveId);
      responseHelper.success(res, archive, 'Archive retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get documents by student
   */
  async getDocumentsByStudent(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { page = 1, limit = 10 } = req.query;

      const result = await documentService.getDocumentsByStudent(schoolId, req.params.studentId, parseInt(page), parseInt(limit));
      responseHelper.paginated(res, result.documents, result.pagination, 'Student documents retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const stats = await documentService.getDocumentStats(schoolId);
      responseHelper.success(res, stats, 'Document statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expiring documents
   */
  async getExpiringDocuments(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { daysAhead = 30 } = req.query;

      const documents = await documentService.getExpiringDocuments(schoolId, parseInt(daysAhead));
      responseHelper.success(res, documents, 'Expiring documents retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk issue documents
   */
  async bulkIssueDocuments(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const documents = await documentService.bulkIssueDocuments(schoolId, {
        ...req.body,
        createdBy: req.user._id,
      });
      responseHelper.created(res, documents, `${documents.length} documents issued successfully`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DocumentController();
