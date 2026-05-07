const Incident = require('../models/discipline/Incident.model');
const DisciplineRecord = require('../models/discipline/DisciplineRecord.model');
const DisciplinaryAction = require('../models/discipline/DisciplinaryAction.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Report an incident
 * @param {string} schoolId
 * @param {Object} data - Incident data
 * @param {string} userId - Reporter user ID
 * @returns {Promise<Object>} Created incident
 */
exports.reportIncident = async (schoolId, data, userId) => {
  const incident = await Incident.create({
    ...data,
    schoolId,
    reportedBy: userId
  });
  return incident;
};

/**
 * Get all incidents with pagination
 * @param {string} schoolId
 * @param {Object} filters - { status, incidentType, severity, page, limit }
 * @returns {Promise<{incidents: Array, total: number}>}
 */
exports.getAllIncidents = async (schoolId, filters) => {
  const { status, incidentType, severity, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (incidentType) filterObj.incidentType = incidentType;
  if (severity) filterObj.severity = severity;

  const skip = (page - 1) * limit;

  const [incidents, total] = await Promise.all([
    Incident.find(filterObj)
      .populate('studentId', 'firstName lastName rollNumber')
      .populate('reportedBy', 'firstName lastName email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ reportedDate: -1 })
      .lean(),
    Incident.countDocuments(filterObj)
  ]);

  return { incidents, total };
};

/**
 * Get incident by ID
 * @param {string} schoolId
 * @param {string} incidentId
 * @returns {Promise<Object>} Incident record
 */
exports.getIncidentById = async (schoolId, incidentId) => {
  const incident = await Incident.findOne({
    _id: incidentId,
    schoolId
  })
    .populate('studentId', 'firstName lastName rollNumber email')
    .populate('reportedBy', 'firstName lastName email')
    .populate('investigatedBy', 'firstName lastName')
    .populate('involvedStudents', 'firstName lastName rollNumber')
    .populate('involvedStaff', 'firstName lastName email');

  if (!incident) throw new AppError('Incident not found', 404);

  return incident;
};

/**
 * Update incident
 * @param {string} schoolId
 * @param {string} incidentId
 * @param {Object} updateData
 * @returns {Promise<Object>} Updated incident
 */
exports.updateIncident = async (schoolId, incidentId, updateData) => {
  const incident = await Incident.findOneAndUpdate(
    { _id: incidentId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('studentId reportedBy investigatedBy');

  if (!incident) throw new AppError('Incident not found', 404);

  return incident;
};

/**
 * Create discipline record from incident
 * @param {string} schoolId
 * @param {string} incidentId
 * @param {Object} data - Discipline record data
 * @param {string} userId - Creating user ID
 * @returns {Promise<Object>} Created discipline record
 */
exports.createDisciplineRecord = async (schoolId, incidentId, data, userId) => {
  const incident = await Incident.findOne({ _id: incidentId, schoolId });
  if (!incident) throw new AppError('Incident not found', 404);

  const disciplineRecord = await DisciplineRecord.create({
    ...data,
    incidentId,
    schoolId,
    recordedBy: userId,
    studentId: incident.studentId
  });

  return disciplineRecord;
};

/**
 * Get discipline records for student
 * @param {string} schoolId
 * @param {string} studentId
 * @returns {Promise<Array>} Discipline records
 */
exports.getStudentDisciplineRecords = async (schoolId, studentId) => {
  const records = await DisciplineRecord.find({
    studentId,
    schoolId
  })
    .populate('incidentId', 'incidentType severity incidentDate')
    .populate('recordedBy', 'firstName lastName')
    .sort({ recordDate: -1 })
    .lean();

  return records;
};

/**
 * Get all discipline records with pagination
 * @param {string} schoolId
 * @param {Object} filters - { status, offenseCategory, severity, page, limit }
 * @returns {Promise<{records: Array, total: number}>}
 */
exports.getAllDisciplineRecords = async (schoolId, filters) => {
  const { status, offenseCategory, severity, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (offenseCategory) filterObj.offenseCategory = offenseCategory;
  if (severity) filterObj.severity = severity;

  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    DisciplineRecord.find(filterObj)
      .populate('studentId', 'firstName lastName rollNumber')
      .populate('recordedBy', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ recordDate: -1 })
      .lean(),
    DisciplineRecord.countDocuments(filterObj)
  ]);

  return { records, total };
};

/**
 * Issue disciplinary action
 * @param {string} schoolId
 * @param {string} disciplineRecordId
 * @param {Object} data - Action data
 * @param {string} userId - Issuing user ID
 * @returns {Promise<Object>} Created action
 */
exports.issueDisciplinaryAction = async (schoolId, disciplineRecordId, data, userId) => {
  const disciplineRecord = await DisciplineRecord.findOne({
    _id: disciplineRecordId,
    schoolId
  });

  if (!disciplineRecord) throw new AppError('Discipline record not found', 404);

  const action = await DisciplinaryAction.create({
    ...data,
    disciplineRecordId,
    schoolId,
    studentId: disciplineRecord.studentId,
    issuedBy: userId
  });

  return action;
};

/**
 * Get active actions for student
 * @param {string} schoolId
 * @param {string} studentId
 * @returns {Promise<Array>} Active actions
 */
exports.getStudentActiveActions = async (schoolId, studentId) => {
  const actions = await DisciplinaryAction.find({
    studentId,
    schoolId,
    status: { $in: ['ISSUED', 'ACTIVE', 'SERVING'] }
  })
    .populate('issuedBy', 'firstName lastName')
    .sort({ issuanceDate: -1 })
    .lean();

  return actions;
};

/**
 * Get all actions with pagination
 * @param {string} schoolId
 * @param {Object} filters - { status, actionType, page, limit }
 * @returns {Promise<{actions: Array, total: number}>}
 */
exports.getAllDisciplinaryActions = async (schoolId, filters) => {
  const { status, actionType, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (actionType) filterObj.actionType = actionType;

  const skip = (page - 1) * limit;

  const [actions, total] = await Promise.all([
    DisciplinaryAction.find(filterObj)
      .populate('studentId', 'firstName lastName rollNumber')
      .populate('issuedBy', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ issuanceDate: -1 })
      .lean(),
    DisciplinaryAction.countDocuments(filterObj)
  ]);

  return { actions, total };
};

/**
 * Update disciplinary action
 * @param {string} schoolId
 * @param {string} actionId
 * @param {Object} updateData
 * @returns {Promise<Object>} Updated action
 */
exports.updateDisciplinaryAction = async (schoolId, actionId, updateData) => {
  const action = await DisciplinaryAction.findOneAndUpdate(
    { _id: actionId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('studentId issuedBy');

  if (!action) throw new AppError('Disciplinary action not found', 404);

  return action;
};

/**
 * Mark action as served/completed
 * @param {string} schoolId
 * @param {string} actionId
 * @param {Object} completionData
 * @returns {Promise<Object>} Updated action
 */
exports.completeAction = async (schoolId, actionId, completionData) => {
  const action = await DisciplinaryAction.findOneAndUpdate(
    { _id: actionId, schoolId },
    {
      $set: {
        status: 'COMPLETED',
        completionEvidence: completionData.evidence,
        closureDate: new Date(),
        effectiveness: completionData.effectiveness
      }
    },
    { new: true }
  );

  if (!action) throw new AppError('Disciplinary action not found', 404);

  return action;
};

/**
 * Appeal disciplinary action
 * @param {string} schoolId
 * @param {string} actionId
 * @param {Object} appealData
 * @returns {Promise<Object>} Updated action
 */
exports.appealAction = async (schoolId, actionId, appealData) => {
  const action = await DisciplinaryAction.findOneAndUpdate(
    { _id: actionId, schoolId },
    {
      $set: {
        appealed: true,
        appealedDate: new Date(),
        appealedBy: appealData.appealedBy,
        appealReason: appealData.reason,
        status: 'UNDER_APPEAL'
      }
    },
    { new: true }
  );

  if (!action) throw new AppError('Disciplinary action not found', 404);

  return action;
};

/**
 * Get student discipline summary
 * @param {string} schoolId
 * @param {string} studentId
 * @returns {Promise<Object>} Summary data
 */
exports.getStudentDisciplineSummary = async (schoolId, studentId) => {
  const [incidents, records, actions] = await Promise.all([
    Incident.countDocuments({ studentId, schoolId }),
    DisciplineRecord.countDocuments({ studentId, schoolId }),
    DisciplinaryAction.countDocuments({ studentId, schoolId, status: { $in: ['ISSUED', 'ACTIVE', 'SERVING'] } })
  ]);

  const severeIncidents = await Incident.countDocuments({
    studentId,
    schoolId,
    severity: { $in: ['SERIOUS', 'CRITICAL'] }
  });

  const repeatOffender = await DisciplineRecord.findOne({
    studentId,
    schoolId,
    isRepeatOffender: true
  });

  return {
    totalIncidents: incidents,
    totalRecords: records,
    activeActions: actions,
    severeIncidents,
    isRepeatOffender: !!repeatOffender,
    riskLevel: actions > 3 ? 'HIGH' : actions > 1 ? 'MEDIUM' : 'LOW'
  };
};

/**
 * Get discipline statistics
 * @param {string} schoolId
 * @returns {Promise<Object>} Statistics
 */
exports.getDisciplineStatistics = async (schoolId) => {
  const stats = await Promise.all([
    Incident.countDocuments({ schoolId }),
    Incident.countDocuments({ schoolId, severity: 'CRITICAL' }),
    DisciplineRecord.countDocuments({ schoolId }),
    DisciplinaryAction.countDocuments({ schoolId, status: 'COMPLETED' })
  ]);

  return {
    totalIncidents: stats[0],
    criticalIncidents: stats[1],
    totalRecords: stats[2],
    completedActions: stats[3]
  };
};

/**
 * Generate discipline report
 * @param {string} schoolId
 * @param {Object} filters - { startDate, endDate, incidentType }
 * @returns {Promise<Object>} Report data
 */
exports.generateDisciplineReport = async (schoolId, filters) => {
  const { startDate, endDate, incidentType } = filters;

  const query = { schoolId };
  if (startDate || endDate) {
    query.incidentDate = {};
    if (startDate) query.incidentDate.$gte = new Date(startDate);
    if (endDate) query.incidentDate.$lte = new Date(endDate);
  }
  if (incidentType) query.incidentType = incidentType;

  const incidents = await Incident.find(query)
    .populate('studentId', 'firstName lastName rollNumber')
    .lean();

  return {
    totalIncidents: incidents.length,
    byType: incidents.reduce((acc, inc) => {
      acc[inc.incidentType] = (acc[inc.incidentType] || 0) + 1;
      return acc;
    }, {}),
    bySeverity: incidents.reduce((acc, inc) => {
      acc[inc.severity] = (acc[inc.severity] || 0) + 1;
      return acc;
    }, {}),
    incidents
  };
};

module.exports = exports;
