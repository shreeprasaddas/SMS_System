const Timetable = require('../models/timetable/Timetable.model');
const TimeSlot = require('../models/timetable/TimeSlot.model');
const PeriodConfig = require('../models/timetable/PeriodConfig.model');
const TeacherTimetable = require('../models/timetable/TeacherTimetable.model');
const TimetableChange = require('../models/timetable/TimetableChange.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create period configuration
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createPeriodConfig = async (schoolId, data, userId) => {
  const periodConfig = await PeriodConfig.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return periodConfig;
};

/**
 * Get all period configurations
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{configs: Array, total: number}>}
 */
exports.getAllPeriodConfigs = async (schoolId, filters) => {
  const { status, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;

  const skip = (page - 1) * limit;

  const [configs, total] = await Promise.all([
    PeriodConfig.find(filterObj)
      .populate('academicYearId', 'yearName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    PeriodConfig.countDocuments(filterObj)
  ]);

  return { configs, total };
};

/**
 * Get period config by ID
 * @param {string} schoolId
 * @param {string} configId
 * @returns {Promise<Object>}
 */
exports.getPeriodConfigById = async (schoolId, configId) => {
  const config = await PeriodConfig.findOne({
    _id: configId,
    schoolId
  }).populate('academicYearId');

  if (!config) throw new AppError('Period configuration not found', 404);

  return config;
};

/**
 * Create time slot
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createTimeSlot = async (schoolId, data, userId) => {
  const timeSlot = await TimeSlot.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return timeSlot;
};

/**
 * Get all time slots
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{slots: Array, total: number}>}
 */
exports.getAllTimeSlots = async (schoolId, filters) => {
  const { status, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;

  const skip = (page - 1) * limit;

  const [slots, total] = await Promise.all([
    TimeSlot.find(filterObj)
      .populate('academicYearId', 'yearName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ periodNumber: 1 })
      .lean(),
    TimeSlot.countDocuments(filterObj)
  ]);

  return { slots, total };
};

/**
 * Create timetable
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createTimetable = async (schoolId, data, userId) => {
  const timetable = await Timetable.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return timetable;
};

/**
 * Get all timetables
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{timetables: Array, total: number}>}
 */
exports.getAllTimetables = async (schoolId, filters) => {
  const { status, classId, isActive, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (classId) filterObj.classId = classId;
  if (isActive !== undefined) filterObj.isActive = isActive;

  const skip = (page - 1) * limit;

  const [timetables, total] = await Promise.all([
    Timetable.find(filterObj)
      .populate('classId', 'className')
      .populate('academicYearId', 'yearName')
      .populate('createdBy', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    Timetable.countDocuments(filterObj)
  ]);

  return { timetables, total };
};

/**
 * Get timetable by ID
 * @param {string} schoolId
 * @param {string} timetableId
 * @returns {Promise<Object>}
 */
exports.getTimetableById = async (schoolId, timetableId) => {
  const timetable = await Timetable.findOne({
    _id: timetableId,
    schoolId
  })
    .populate('classId')
    .populate('academicYearId')
    .populate('createdBy', 'firstName lastName');

  if (!timetable) throw new AppError('Timetable not found', 404);

  return timetable;
};

/**
 * Update timetable
 * @param {string} schoolId
 * @param {string} timetableId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
exports.updateTimetable = async (schoolId, timetableId, updateData) => {
  const timetable = await Timetable.findOneAndUpdate(
    { _id: timetableId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!timetable) throw new AppError('Timetable not found', 404);

  return timetable;
};

/**
 * Publish timetable
 * @param {string} schoolId
 * @param {string} timetableId
 * @returns {Promise<Object>}
 */
exports.publishTimetable = async (schoolId, timetableId) => {
  const timetable = await Timetable.findOneAndUpdate(
    { _id: timetableId, schoolId },
    { $set: { status: 'APPROVED' } },
    { new: true }
  );

  if (!timetable) throw new AppError('Timetable not found', 404);

  return timetable;
};

/**
 * Activate timetable
 * @param {string} schoolId
 * @param {string} timetableId
 * @returns {Promise<Object>}
 */
exports.activateTimetable = async (schoolId, timetableId) => {
  const timetable = await Timetable.findOneAndUpdate(
    { _id: timetableId, schoolId },
    { $set: { status: 'ACTIVE', isActive: true, activatedDate: new Date() } },
    { new: true }
  );

  if (!timetable) throw new AppError('Timetable not found', 404);

  return timetable;
};

/**
 * Create teacher timetable
 * @param {string} schoolId
 * @param {string} teacherId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createTeacherTimetable = async (schoolId, teacherId, data, userId) => {
  const teacherTimetable = await TeacherTimetable.create({
    ...data,
    schoolId,
    teacherId,
    createdBy: userId
  });
  return teacherTimetable;
};

/**
 * Get teacher timetable
 * @param {string} schoolId
 * @param {string} teacherId
 * @returns {Promise<Object>}
 */
exports.getTeacherTimetable = async (schoolId, teacherId) => {
  const teacherTimetable = await TeacherTimetable.find({
    schoolId,
    teacherId
  })
    .populate('teacherId', 'firstName lastName')
    .populate('assignedClasses.classId', 'className')
    .populate('assignedClasses.subjectId', 'subjectName');

  return teacherTimetable;
};

/**
 * Confirm teacher timetable
 * @param {string} schoolId
 * @param {string} teacherTimetableId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.confirmTeacherTimetable = async (schoolId, teacherTimetableId, userId) => {
  const teacherTimetable = await TeacherTimetable.findOneAndUpdate(
    { _id: teacherTimetableId, schoolId },
    {
      $set: {
        isConfirmed: true,
        confirmedDate: new Date(),
        confirmedBy: userId,
        status: 'CONFIRMED'
      }
    },
    { new: true }
  );

  if (!teacherTimetable) throw new AppError('Teacher timetable not found', 404);

  return teacherTimetable;
};

/**
 * Request timetable change
 * @param {string} schoolId
 * @param {string} timetableId
 * @param {Object} changeData
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.requestTimetableChange = async (schoolId, timetableId, changeData, userId) => {
  const timetable = await Timetable.findOne({ _id: timetableId, schoolId });
  if (!timetable) throw new AppError('Timetable not found', 404);

  const change = await TimetableChange.create({
    ...changeData,
    timetableId,
    schoolId,
    academicYearId: timetable.academicYearId,
    requestedBy: userId
  });

  return change;
};

/**
 * Get timetable changes
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{changes: Array, total: number}>}
 */
exports.getTimetableChanges = async (schoolId, filters) => {
  const { status, changeType, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (changeType) filterObj.changeType = changeType;

  const skip = (page - 1) * limit;

  const [changes, total] = await Promise.all([
    TimetableChange.find(filterObj)
      .populate('timetableId', 'timetableName')
      .populate('requestedBy', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ changeDate: -1 })
      .lean(),
    TimetableChange.countDocuments(filterObj)
  ]);

  return { changes, total };
};

/**
 * Approve timetable change
 * @param {string} schoolId
 * @param {string} changeId
 * @param {Object} approvalData
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.approveTimetableChange = async (schoolId, changeId, approvalData, userId) => {
  const change = await TimetableChange.findOneAndUpdate(
    { _id: changeId, schoolId },
    {
      $set: {
        status: 'APPROVED',
        approvedBy: userId,
        approvalDate: new Date(),
        approvalComments: approvalData.comments
      }
    },
    { new: true }
  );

  if (!change) throw new AppError('Timetable change not found', 404);

  return change;
};

/**
 * Reject timetable change
 * @param {string} schoolId
 * @param {string} changeId
 * @param {Object} rejectionData
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.rejectTimetableChange = async (schoolId, changeId, rejectionData, userId) => {
  const change = await TimetableChange.findOneAndUpdate(
    { _id: changeId, schoolId },
    {
      $set: {
        status: 'REJECTED',
        rejectedBy: userId,
        rejectionDate: new Date(),
        rejectionReason: rejectionData.reason
      }
    },
    { new: true }
  );

  if (!change) throw new AppError('Timetable change not found', 404);

  return change;
};

/**
 * Implement timetable change
 * @param {string} schoolId
 * @param {string} changeId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.implementTimetableChange = async (schoolId, changeId, userId) => {
  const change = await TimetableChange.findOneAndUpdate(
    { _id: changeId, schoolId },
    {
      $set: {
        status: 'IMPLEMENTED',
        implementedBy: userId,
        implementationDate: new Date()
      }
    },
    { new: true }
  );

  if (!change) throw new AppError('Timetable change not found', 404);

  return change;
};

/**
 * Get timetable statistics
 * @param {string} schoolId
 * @param {string} timetableId
 * @returns {Promise<Object>}
 */
exports.getTimetableStatistics = async (schoolId, timetableId) => {
  const timetable = await Timetable.findOne({ _id: timetableId, schoolId });
  if (!timetable) throw new AppError('Timetable not found', 404);

  const teacherTimetables = await TeacherTimetable.countDocuments({ timetableId, schoolId });
  const changes = await TimetableChange.countDocuments({ timetableId, schoolId });
  const pendingChanges = await TimetableChange.countDocuments({
    timetableId,
    schoolId,
    status: 'PENDING_APPROVAL'
  });

  return {
    timetableStatus: timetable.status,
    isActive: timetable.isActive,
    totalTeacherAssignments: teacherTimetables,
    totalChanges: changes,
    pendingChanges,
    workingDays: timetable.totalWorkingDays,
    totalPeriods: timetable.totalPeriods
  };
};

module.exports = exports;
