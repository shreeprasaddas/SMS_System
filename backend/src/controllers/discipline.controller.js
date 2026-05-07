const disciplineService = require('../services/discipline.service');
const { responseHelper } = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');

// ============== INCIDENT MANAGEMENT ==============

/**
 * POST /api/v1/discipline/incidents - Report an incident
 */
exports.reportIncident = async (req, res, next) => {
  try {
    const incident = await disciplineService.reportIncident(req.user.schoolId, req.body, req.user.userId);

    return responseHelper.created(res, incident, 'Incident reported successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/discipline/incidents - Get all incidents
 */
exports.getAllIncidents = async (req, res, next) => {
  try {
    const { status, incidentType, severity, page = 1, limit = 20 } = req.query;

    const { incidents, total } = await disciplineService.getAllIncidents(req.user.schoolId, {
      status,
      incidentType,
      severity,
      page: Number(page),
      limit: Number(limit)
    });

    return responseHelper.paginated(res, incidents, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/discipline/incidents/:id - Get incident by ID
 */
exports.getIncidentById = async (req, res, next) => {
  try {
    const incident = await disciplineService.getIncidentById(req.user.schoolId, req.params.id);

    return responseHelper.success(res, incident);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/discipline/incidents/:id - Update incident
 */
exports.updateIncident = async (req, res, next) => {
  try {
    const incident = await disciplineService.updateIncident(req.user.schoolId, req.params.id, req.body);

    return responseHelper.success(res, incident, 'Incident updated successfully');
  } catch (err) {
    next(err);
  }
};

// ============== DISCIPLINE RECORD MANAGEMENT ==============

/**
 * POST /api/v1/discipline/records - Create discipline record
 */
exports.createDisciplineRecord = async (req, res, next) => {
  try {
    const { incidentId, ...data } = req.body;

    const record = await disciplineService.createDisciplineRecord(
      req.user.schoolId,
      incidentId,
      data,
      req.user.userId
    );

    return responseHelper.created(res, record, 'Discipline record created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/discipline/records - Get all discipline records
 */
exports.getAllDisciplineRecords = async (req, res, next) => {
  try {
    const { status, offenseCategory, severity, page = 1, limit = 20 } = req.query;

    const { records, total } = await disciplineService.getAllDisciplineRecords(req.user.schoolId, {
      status,
      offenseCategory,
      severity,
      page: Number(page),
      limit: Number(limit)
    });

    return responseHelper.paginated(res, records, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/discipline/students/:studentId/records - Get records for student
 */
exports.getStudentDisciplineRecords = async (req, res, next) => {
  try {
    const records = await disciplineService.getStudentDisciplineRecords(
      req.user.schoolId,
      req.params.studentId
    );

    return responseHelper.success(res, records);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/discipline/records/:id/approve - Approve discipline record
 */
exports.approveDisciplineRecord = async (req, res, next) => {
  try {
    const { status, approvalReason, reviewNotes } = req.body;

    const record = await disciplineService.updateDisciplineRecord(req.user.schoolId, req.params.id, {
      status,
      approvalReason,
      reviewNotes,
      approvedBy: req.user.userId,
      approvalDate: new Date()
    });

    return responseHelper.success(res, record, 'Discipline record approved successfully');
  } catch (err) {
    next(err);
  }
};

// ============== DISCIPLINARY ACTION MANAGEMENT ==============

/**
 * POST /api/v1/discipline/actions - Issue disciplinary action
 */
exports.issueDisciplinaryAction = async (req, res, next) => {
  try {
    const { disciplineRecordId, ...data } = req.body;

    const action = await disciplineService.issueDisciplinaryAction(
      req.user.schoolId,
      disciplineRecordId,
      data,
      req.user.userId
    );

    return responseHelper.created(res, action, 'Disciplinary action issued successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/discipline/actions - Get all actions
 */
exports.getAllDisciplinaryActions = async (req, res, next) => {
  try {
    const { status, actionType, page = 1, limit = 20 } = req.query;

    const { actions, total } = await disciplineService.getAllDisciplinaryActions(req.user.schoolId, {
      status,
      actionType,
      page: Number(page),
      limit: Number(limit)
    });

    return responseHelper.paginated(res, actions, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/discipline/students/:studentId/actions - Get active actions for student
 */
exports.getStudentActiveActions = async (req, res, next) => {
  try {
    const actions = await disciplineService.getStudentActiveActions(
      req.user.schoolId,
      req.params.studentId
    );

    return responseHelper.success(res, actions);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/discipline/actions/:id - Update action
 */
exports.updateDisciplinaryAction = async (req, res, next) => {
  try {
    const action = await disciplineService.updateDisciplinaryAction(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, action, 'Disciplinary action updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/discipline/actions/:id/complete - Complete action
 */
exports.completeAction = async (req, res, next) => {
  try {
    const action = await disciplineService.completeAction(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, action, 'Disciplinary action completed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/discipline/actions/:id/appeal - Appeal action
 */
exports.appealAction = async (req, res, next) => {
  try {
    const action = await disciplineService.appealAction(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, action, 'Appeal submitted successfully');
  } catch (err) {
    next(err);
  }
};

// ============== STATISTICS AND REPORTS ==============

/**
 * GET /api/v1/discipline/students/:studentId/summary - Get discipline summary for student
 */
exports.getStudentDisciplineSummary = async (req, res, next) => {
  try {
    const summary = await disciplineService.getStudentDisciplineSummary(
      req.user.schoolId,
      req.params.studentId
    );

    return responseHelper.success(res, summary);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/discipline/statistics - Get discipline statistics
 */
exports.getDisciplineStatistics = async (req, res, next) => {
  try {
    const stats = await disciplineService.getDisciplineStatistics(req.user.schoolId);

    return responseHelper.success(res, stats);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/discipline/report - Generate discipline report
 */
exports.generateDisciplineReport = async (req, res, next) => {
  try {
    const { startDate, endDate, incidentType } = req.body;

    const report = await disciplineService.generateDisciplineReport(req.user.schoolId, {
      startDate,
      endDate,
      incidentType
    });

    return responseHelper.success(res, report, 'Discipline report generated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
