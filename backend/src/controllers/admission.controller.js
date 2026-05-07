const admissionService = require('../services/admission.service');
const { responseHelper } = require('../utils/responseHelper');

// ============== ADMISSION CYCLE HANDLERS ==============

/**
 * POST /api/v1/admission/cycles - Create admission cycle
 */
exports.createAdmissionCycle = async (req, res, next) => {
  try {
    const cycle = await admissionService.createAdmissionCycle(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, cycle, 'Admission cycle created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admission/cycles - Get all admission cycles
 */
exports.getAllAdmissionCycles = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const { cycles, total } = await admissionService.getAllAdmissionCycles(
      req.user.schoolId,
      {
        status,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, cycles, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admission/cycles/:id - Get admission cycle by ID
 */
exports.getAdmissionCycleById = async (req, res, next) => {
  try {
    const cycle = await admissionService.getAdmissionCycleById(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, cycle);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admission/cycles/:id - Update admission cycle
 */
exports.updateAdmissionCycle = async (req, res, next) => {
  try {
    const cycle = await admissionService.updateAdmissionCycle(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, cycle, 'Admission cycle updated successfully');
  } catch (err) {
    next(err);
  }
};

// ============== APPLICATION HANDLERS ==============

/**
 * POST /api/v1/admission/applications - Create application
 */
exports.createApplication = async (req, res, next) => {
  try {
    const application = await admissionService.createApplication(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, application, 'Application created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admission/applications - Get all applications
 */
exports.getAllApplications = async (req, res, next) => {
  try {
    const { status, cycleId, category, page = 1, limit = 20 } = req.query;

    const { applications, total } = await admissionService.getAllApplications(
      req.user.schoolId,
      {
        status,
        cycleId,
        category,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, applications, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admission/applications/:id - Get application by ID
 */
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await admissionService.getApplicationById(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, application);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admission/applications/:id - Update application
 */
exports.updateApplication = async (req, res, next) => {
  try {
    const application = await admissionService.updateApplication(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, application, 'Application updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/admission/applications/:id/submit - Submit application
 */
exports.submitApplication = async (req, res, next) => {
  try {
    const application = await admissionService.submitApplication(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, application, 'Application submitted successfully');
  } catch (err) {
    next(err);
  }
};

// ============== APPLICATION FORM HANDLERS ==============

/**
 * POST /api/v1/admission/forms - Create application form
 */
exports.createApplicationForm = async (req, res, next) => {
  try {
    const form = await admissionService.createApplicationForm(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, form, 'Application form created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admission/forms - Get all application forms
 */
exports.getAllApplicationForms = async (req, res, next) => {
  try {
    const { status, cycleId, page = 1, limit = 20 } = req.query;

    const { forms, total } = await admissionService.getAllApplicationForms(
      req.user.schoolId,
      {
        status,
        cycleId,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, forms, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admission/forms/:id - Get application form by ID
 */
exports.getApplicationFormById = async (req, res, next) => {
  try {
    const form = await admissionService.getApplicationFormById(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, form);
  } catch (err) {
    next(err);
  }
};

// ============== DOCUMENT VERIFICATION HANDLERS ==============

/**
 * POST /api/v1/admission/verifications - Create document verification
 */
exports.createDocVerification = async (req, res, next) => {
  try {
    const verification = await admissionService.createDocVerification(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, verification, 'Document verification created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admission/verifications - Get all document verifications
 */
exports.getAllDocVerifications = async (req, res, next) => {
  try {
    const { status, cycleId, page = 1, limit = 20 } = req.query;

    const { verifications, total } = await admissionService.getAllDocVerifications(
      req.user.schoolId,
      {
        status,
        cycleId,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, verifications, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admission/verifications/:id - Update document verification
 */
exports.updateDocVerification = async (req, res, next) => {
  try {
    const verification = await admissionService.updateDocVerification(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, verification, 'Document verification updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/admission/verifications/:id/verify - Verify document
 */
exports.verifyDocument = async (req, res, next) => {
  try {
    const verification = await admissionService.verifyDocument(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, verification, 'Document verified successfully');
  } catch (err) {
    next(err);
  }
};

// ============== MERIT LIST HANDLERS ==============

/**
 * POST /api/v1/admission/merit-lists - Create merit list
 */
exports.createMeritList = async (req, res, next) => {
  try {
    const meritList = await admissionService.createMeritList(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, meritList, 'Merit list created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admission/merit-lists - Get all merit lists
 */
exports.getAllMeritLists = async (req, res, next) => {
  try {
    const { status, cycleId, type, page = 1, limit = 20 } = req.query;

    const { lists, total } = await admissionService.getAllMeritLists(
      req.user.schoolId,
      {
        status,
        cycleId,
        type,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, lists, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admission/merit-lists/:id - Get merit list by ID
 */
exports.getMeritListById = async (req, res, next) => {
  try {
    const meritList = await admissionService.getMeritListById(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, meritList);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admission/merit-lists/:id/publish - Publish merit list
 */
exports.publishMeritList = async (req, res, next) => {
  try {
    const meritList = await admissionService.publishMeritList(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, meritList, 'Merit list published successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admission/merit-lists/:id/finalize - Finalize merit list
 */
exports.finalizeMeritList = async (req, res, next) => {
  try {
    const meritList = await admissionService.finalizeMeritList(
      req.user.schoolId,
      req.params.id,
      req.user.userId
    );

    return responseHelper.success(res, meritList, 'Merit list finalized successfully');
  } catch (err) {
    next(err);
  }
};

// ============== STATISTICS HANDLER ==============

/**
 * GET /api/v1/admission/cycles/:cycleId/statistics - Get admission statistics
 */
exports.getAdmissionStatistics = async (req, res, next) => {
  try {
    const stats = await admissionService.getAdmissionStatistics(
      req.user.schoolId,
      req.params.cycleId
    );

    return responseHelper.success(res, stats);
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
