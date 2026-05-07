/**
 * Certificate Service
 * Business logic for certificate management operations
 */

const Certificate = require('../models/Certificate.model');
const CertificateTemplate = require('../models/CertificateTemplate.model');
const StudentCertificate = require('../models/StudentCertificate.model');
const CertificateEvent = require('../models/CertificateEvent.model');
const CertificateAudit = require('../models/CertificateAudit.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create new certificate master record
 */
exports.createCertificate = async (data, schoolId) => {
  try {
    const certificate = await Certificate.create({ ...data, schoolId });
    return certificate;
  } catch (error) {
    throw new AppError('Failed to create certificate', 400);
  }
};

/**
 * Get all certificates with pagination and filters
 */
exports.getAllCertificates = async (schoolId, filters = {}) => {
  try {
    const { certificateType, status, issuedFor, page = 1, limit = 20 } = filters;
    const query = { schoolId };
    
    if (certificateType) query.certificateType = certificateType;
    if (status) query.status = status;
    if (issuedFor) query.issuedFor = issuedFor;
    
    const skip = (page - 1) * limit;
    const [certificates, total] = await Promise.all([
      Certificate.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Certificate.countDocuments(query),
    ]);
    
    return { certificates, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve certificates', 400);
  }
};

/**
 * Get certificate by ID
 */
exports.getCertificateById = async (certificateId, schoolId) => {
  try {
    const certificate = await Certificate.findOne({ _id: certificateId, schoolId }).lean();
    if (!certificate) throw new AppError('Certificate not found', 404);
    return certificate;
  } catch (error) {
    throw error;
  }
};

/**
 * Update certificate details
 */
exports.updateCertificate = async (certificateId, updateData, schoolId) => {
  try {
    const certificate = await Certificate.findOneAndUpdate(
      { _id: certificateId, schoolId },
      { $set: updateData, $push: { auditLog: updateData.auditLog } },
      { new: true, runValidators: true }
    );
    if (!certificate) throw new AppError('Certificate not found', 404);
    return certificate;
  } catch (error) {
    throw error;
  }
};

/**
 * Create certificate template
 */
exports.createCertificateTemplate = async (data, schoolId) => {
  try {
    const template = await CertificateTemplate.create({ ...data, schoolId });
    return template;
  } catch (error) {
    throw new AppError('Failed to create certificate template', 400);
  }
};

/**
 * Get all certificate templates
 */
exports.getAllCertificateTemplates = async (schoolId, filters = {}) => {
  try {
    const { templateCategory, status, page = 1, limit = 20 } = filters;
    const query = { schoolId };
    
    if (templateCategory) query.templateCategory = templateCategory;
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    const [templates, total] = await Promise.all([
      CertificateTemplate.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CertificateTemplate.countDocuments(query),
    ]);
    
    return { templates, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve templates', 400);
  }
};

/**
 * Issue certificate to student
 */
exports.issueCertificate = async (data, schoolId, userId) => {
  try {
    const studentCert = await StudentCertificate.create({
      ...data,
      schoolId,
      'issuanceDetails.issuedByUserId': userId,
      'issuanceDetails.issuedDate': new Date(),
    });

    // Update certificate issuance count
    await Certificate.findByIdAndUpdate(
      data.certificateId,
      { $inc: { issuedCount: 1 } }
    );

    // Log audit trail
    await CertificateAudit.create({
      schoolId,
      auditType: 'CERTIFICATE_ISSUED',
      actionDescription: `Certificate issued to student ${data.studentId}`,
      performedByUserId: userId,
      resourceType: 'STUDENT_CERTIFICATE',
      resourceId: studentCert._id,
      resourceDetails: {
        certificateId: data.certificateId,
        studentId: data.studentId,
        certificateType: data.certificateType,
      },
      status: 'SUCCESS',
    });

    return studentCert;
  } catch (error) {
    throw new AppError('Failed to issue certificate', 400);
  }
};

/**
 * Get student certificates
 */
exports.getStudentCertificates = async (studentId, schoolId, filters = {}) => {
  try {
    const { certificateType, status, page = 1, limit = 20 } = filters;
    const query = { schoolId, studentId };
    
    if (certificateType) query.certificateType = certificateType;
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    const [certificates, total] = await Promise.all([
      StudentCertificate.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      StudentCertificate.countDocuments(query),
    ]);
    
    return { certificates, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve student certificates', 400);
  }
};

/**
 * Create certificate distribution event
 */
exports.createEvent = async (data, schoolId, userId) => {
  try {
    const event = await CertificateEvent.create({
      ...data,
      schoolId,
      'organizedBy.userId': userId,
    });

    await CertificateAudit.create({
      schoolId,
      auditType: 'EVENT_CREATED',
      actionDescription: `Certificate event created: ${data.eventName}`,
      performedByUserId: userId,
      resourceType: 'CERTIFICATE',
      resourceId: event._id,
      status: 'SUCCESS',
    });

    return event;
  } catch (error) {
    throw new AppError('Failed to create certificate event', 400);
  }
};

/**
 * Get certificate events
 */
exports.getEvents = async (schoolId, filters = {}) => {
  try {
    const { eventType, status, page = 1, limit = 20 } = filters;
    const query = { schoolId };
    
    if (eventType) query.eventType = eventType;
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      CertificateEvent.find(query)
        .sort({ eventDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CertificateEvent.countDocuments(query),
    ]);
    
    return { events, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve events', 400);
  }
};

/**
 * Distribute certificate to student
 */
exports.distributeCertificate = async (certificateId, studentId, distributionData, schoolId, userId) => {
  try {
    const certificate = await StudentCertificate.findOneAndUpdate(
      { _id: certificateId, studentId, schoolId },
      {
        $set: {
          status: 'DISTRIBUTED',
          'distributionDetails.distributedDate': new Date(),
          'distributionDetails.distributedBy': userId,
          ...distributionData,
        },
        $push: {
          auditLog: {
            action: 'CERTIFICATE_DISTRIBUTED',
            performedBy: userId,
            timestamp: new Date(),
            changes: distributionData,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!certificate) throw new AppError('Certificate not found', 404);

    await CertificateAudit.create({
      schoolId,
      auditType: 'CERTIFICATE_DISTRIBUTED',
      actionDescription: `Certificate distributed to student ${studentId}`,
      performedByUserId: userId,
      resourceType: 'STUDENT_CERTIFICATE',
      resourceId: certificateId,
      status: 'SUCCESS',
    });

    return certificate;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify certificate authenticity
 */
exports.verifyCertificate = async (verificationCode, schoolId) => {
  try {
    const certificate = await StudentCertificate.findOne({
      schoolId,
      'verificationDetails.verificationCode': verificationCode,
    }).lean();

    if (!certificate) throw new AppError('Certificate not found', 404);

    const isValid = certificate.validityDetails?.isValid && certificate.validityDetails?.validityStatus === 'VALID';

    await CertificateAudit.create({
      schoolId,
      auditType: 'CERTIFICATE_VERIFIED',
      actionDescription: `Certificate verification attempt for code: ${verificationCode}`,
      resourceType: 'STUDENT_CERTIFICATE',
      resourceId: certificate._id,
      status: isValid ? 'SUCCESS' : 'FAILED',
    });

    return {
      isValid,
      certificate: {
        code: certificate.code,
        studentName: certificate.certificateContent?.recipientName,
        certificateType: certificate.certificateType,
        issuedDate: certificate.issuanceDetails?.issuedDate,
        expiryDate: certificate.validityDetails?.expiryDate,
        status: certificate.validityDetails?.validityStatus,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get certificate statistics
 */
exports.getStatistics = async (schoolId) => {
  try {
    const [totalCertificates, totalTemplates, totalIssued, issuedByType, expiredCount, pendingApproval] = await Promise.all(
      [
        Certificate.countDocuments({ schoolId }),
        CertificateTemplate.countDocuments({ schoolId }),
        StudentCertificate.countDocuments({ schoolId, status: 'DISTRIBUTED' }),
        StudentCertificate.aggregate([
          { $match: { schoolId, status: 'DISTRIBUTED' } },
          { $group: { _id: '$certificateType', count: { $sum: 1 } } },
        ]),
        StudentCertificate.countDocuments({ schoolId, 'validityDetails.validityStatus': 'EXPIRED' }),
        StudentCertificate.countDocuments({ schoolId, status: 'PENDING_APPROVAL' }),
      ]
    );

    return {
      totalCertificates,
      totalTemplates,
      totalIssuedCertificates: totalIssued,
      issuedByType,
      expiredCertificates: expiredCount,
      pendingApprovalCertificates: pendingApproval,
    };
  } catch (error) {
    throw new AppError('Failed to retrieve statistics', 400);
  }
};
