const AdmissionCycle = require('../models/admission/AdmissionCycle.model');
const Application = require('../models/admission/Application.model');
const ApplicationForm = require('../models/admission/ApplicationForm.model');
const DocVerification = require('../models/admission/DocVerification.model');
const MeritList = require('../models/admission/MeritList.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create admission cycle
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createAdmissionCycle = async (schoolId, data, userId) => {
  const cycle = await AdmissionCycle.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return cycle;
};

/**
 * Get all admission cycles
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{cycles: Array, total: number}>}
 */
exports.getAllAdmissionCycles = async (schoolId, filters) => {
  const { status, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;

  const skip = (page - 1) * limit;

  const [cycles, total] = await Promise.all([
    AdmissionCycle.find(filterObj)
      .populate('classesOffering.classId', 'className')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    AdmissionCycle.countDocuments(filterObj)
  ]);

  return { cycles, total };
};

/**
 * Get admission cycle by ID
 * @param {string} schoolId
 * @param {string} cycleId
 * @returns {Promise<Object>}
 */
exports.getAdmissionCycleById = async (schoolId, cycleId) => {
  const cycle = await AdmissionCycle.findOne({
    _id: cycleId,
    schoolId
  }).populate('classesOffering.classId');

  if (!cycle) throw new AppError('Admission cycle not found', 404);

  return cycle;
};

/**
 * Update admission cycle
 * @param {string} schoolId
 * @param {string} cycleId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
exports.updateAdmissionCycle = async (schoolId, cycleId, updateData) => {
  const cycle = await AdmissionCycle.findOneAndUpdate(
    { _id: cycleId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!cycle) throw new AppError('Admission cycle not found', 404);

  return cycle;
};

/**
 * Create application
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createApplication = async (schoolId, data, userId) => {
  const application = await Application.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return application;
};

/**
 * Get all applications
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{applications: Array, total: number}>}
 */
exports.getAllApplications = async (schoolId, filters) => {
  const { status, cycleId, category, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.applicationStatus = status;
  if (cycleId) filterObj.admissionCycleId = cycleId;
  if (category) filterObj.category = category;

  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    Application.find(filterObj)
      .populate('admissionCycleId', 'cycleName')
      .populate('allottedClass', 'className')
      .skip(skip)
      .limit(Number(limit))
      .sort({ applicationDate: -1 })
      .lean(),
    Application.countDocuments(filterObj)
  ]);

  return { applications, total };
};

/**
 * Get application by ID
 * @param {string} schoolId
 * @param {string} applicationId
 * @returns {Promise<Object>}
 */
exports.getApplicationById = async (schoolId, applicationId) => {
  const application = await Application.findOne({
    _id: applicationId,
    schoolId
  })
    .populate('admissionCycleId')
    .populate('appliedClasses.classId')
    .populate('allottedClass');

  if (!application) throw new AppError('Application not found', 404);

  return application;
};

/**
 * Update application
 * @param {string} schoolId
 * @param {string} applicationId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
exports.updateApplication = async (schoolId, applicationId, updateData) => {
  const application = await Application.findOneAndUpdate(
    { _id: applicationId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!application) throw new AppError('Application not found', 404);

  return application;
};

/**
 * Submit application
 * @param {string} schoolId
 * @param {string} applicationId
 * @returns {Promise<Object>}
 */
exports.submitApplication = async (schoolId, applicationId) => {
  const application = await Application.findOneAndUpdate(
    { _id: applicationId, schoolId },
    { $set: { applicationStatus: 'SUBMITTED' } },
    { new: true }
  );

  if (!application) throw new AppError('Application not found', 404);

  return application;
};

/**
 * Create application form
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createApplicationForm = async (schoolId, data, userId) => {
  const form = await ApplicationForm.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return form;
};

/**
 * Get all application forms
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{forms: Array, total: number}>}
 */
exports.getAllApplicationForms = async (schoolId, filters) => {
  const { status, cycleId, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (cycleId) filterObj.admissionCycleId = cycleId;

  const skip = (page - 1) * limit;

  const [forms, total] = await Promise.all([
    ApplicationForm.find(filterObj)
      .populate('admissionCycleId', 'cycleName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    ApplicationForm.countDocuments(filterObj)
  ]);

  return { forms, total };
};

/**
 * Get application form by ID
 * @param {string} schoolId
 * @param {string} formId
 * @returns {Promise<Object>}
 */
exports.getApplicationFormById = async (schoolId, formId) => {
  const form = await ApplicationForm.findOne({
    _id: formId,
    schoolId
  });

  if (!form) throw new AppError('Application form not found', 404);

  return form;
};

/**
 * Create document verification
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createDocVerification = async (schoolId, data, userId) => {
  const verification = await DocVerification.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return verification;
};

/**
 * Get all document verifications
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{verifications: Array, total: number}>}
 */
exports.getAllDocVerifications = async (schoolId, filters) => {
  const { status, cycleId, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.overallVerificationStatus = status;
  if (cycleId) filterObj.admissionCycleId = cycleId;

  const skip = (page - 1) * limit;

  const [verifications, total] = await Promise.all([
    DocVerification.find(filterObj)
      .populate('applicationId', 'applicantName')
      .populate('verifiedBy', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    DocVerification.countDocuments(filterObj)
  ]);

  return { verifications, total };
};

/**
 * Update document verification
 * @param {string} schoolId
 * @param {string} verificationId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
exports.updateDocVerification = async (schoolId, verificationId, updateData) => {
  const verification = await DocVerification.findOneAndUpdate(
    { _id: verificationId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!verification) throw new AppError('Document verification not found', 404);

  return verification;
};

/**
 * Verify document
 * @param {string} schoolId
 * @param {string} verificationId
 * @param {Object} verificationData
 * @returns {Promise<Object>}
 */
exports.verifyDocument = async (schoolId, verificationId, verificationData) => {
  const verification = await DocVerification.findOne({
    _id: verificationId,
    schoolId
  });

  if (!verification) throw new AppError('Document verification not found', 404);

  verification.overallVerificationStatus = verificationData.status;
  verification.verificationCompletionDate = new Date();
  await verification.save();

  return verification;
};

/**
 * Create merit list
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createMeritList = async (schoolId, data, userId) => {
  const meritList = await MeritList.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return meritList;
};

/**
 * Get all merit lists
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{lists: Array, total: number}>}
 */
exports.getAllMeritLists = async (schoolId, filters) => {
  const { status, cycleId, type, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (cycleId) filterObj.admissionCycleId = cycleId;
  if (type) filterObj.meritListType = type;

  const skip = (page - 1) * limit;

  const [lists, total] = await Promise.all([
    MeritList.find(filterObj)
      .populate('admissionCycleId', 'cycleName')
      .populate('forClass', 'className')
      .skip(skip)
      .limit(Number(limit))
      .sort({ publishedDate: -1 })
      .lean(),
    MeritList.countDocuments(filterObj)
  ]);

  return { lists, total };
};

/**
 * Get merit list by ID
 * @param {string} schoolId
 * @param {string} listId
 * @returns {Promise<Object>}
 */
exports.getMeritListById = async (schoolId, listId) => {
  const meritList = await MeritList.findOne({
    _id: listId,
    schoolId
  })
    .populate('admissionCycleId')
    .populate('forClass');

  if (!meritList) throw new AppError('Merit list not found', 404);

  return meritList;
};

/**
 * Publish merit list
 * @param {string} schoolId
 * @param {string} listId
 * @returns {Promise<Object>}
 */
exports.publishMeritList = async (schoolId, listId) => {
  const meritList = await MeritList.findOneAndUpdate(
    { _id: listId, schoolId },
    { $set: { status: 'PUBLISHED', publishedDate: new Date() } },
    { new: true }
  );

  if (!meritList) throw new AppError('Merit list not found', 404);

  return meritList;
};

/**
 * Finalize merit list
 * @param {string} schoolId
 * @param {string} listId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.finalizeMeritList = async (schoolId, listId, userId) => {
  const meritList = await MeritList.findOneAndUpdate(
    { _id: listId, schoolId },
    {
      $set: {
        status: 'FINAL',
        isFinal: true,
        isProvisional: false,
        finalizedDate: new Date(),
        finalizedBy: userId
      }
    },
    { new: true }
  );

  if (!meritList) throw new AppError('Merit list not found', 404);

  return meritList;
};

/**
 * Get admission statistics
 * @param {string} schoolId
 * @param {string} cycleId
 * @returns {Promise<Object>}
 */
exports.getAdmissionStatistics = async (schoolId, cycleId) => {
  const cycle = await AdmissionCycle.findOne({
    _id: cycleId,
    schoolId
  });

  if (!cycle) throw new AppError('Admission cycle not found', 404);

  const totalApplications = await Application.countDocuments({
    schoolId,
    admissionCycleId: cycleId
  });

  const submittedApplications = await Application.countDocuments({
    schoolId,
    admissionCycleId: cycleId,
    applicationStatus: 'SUBMITTED'
  });

  const approvedApplications = await Application.countDocuments({
    schoolId,
    admissionCycleId: cycleId,
    applicationStatus: 'APPROVED'
  });

  const rejectedApplications = await Application.countDocuments({
    schoolId,
    admissionCycleId: cycleId,
    applicationStatus: 'REJECTED'
  });

  const admittedApplications = await Application.countDocuments({
    schoolId,
    admissionCycleId: cycleId,
    applicationStatus: 'ADMITTED'
  });

  return {
    totalApplications,
    submittedApplications,
    approvedApplications,
    rejectedApplications,
    admittedApplications,
    conversionRate: totalApplications > 0 ? ((admittedApplications / totalApplications) * 100).toFixed(2) : 0
  };
};

module.exports = exports;
