/**
 * Timetable Controller
 * Timetable management and schedule views
 */

const Timetable = require('../models/timetable/Timetable.model');
const PeriodConfig = require('../models/timetable/PeriodConfig.model');
const TeacherTimetable = require('../models/timetable/TeacherTimetable.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class TimetableController {
  /**
   * Create period configuration
   */
  static async createPeriodConfig(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { periodName, startTime, endTime, duration } = req.body;

      if (!periodName || !startTime || !endTime) {
        throw new ValidationError('Missing required fields');
      }

      const config = new PeriodConfig({
        schoolId,
        periodName,
        startTime,
        endTime,
        duration,
        createdBy: req.user.userId
      });

      await config.save();

      return responseHelper.created(res, config, 'Period configuration created successfully');
    } catch (error) {
      logger.error('Error creating period config', error);
      next(error);
    }
  }

  /**
   * Get period configurations
   */
  static async getPeriodConfigs(req, res, next) {
    try {
      const { page = 1, limit = 12 } = req.query;
      const schoolId = req.user.schoolId;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await PeriodConfig.countDocuments({ schoolId });
      const configs = await PeriodConfig.find({ schoolId })
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: 1 });

      return responseHelper.paginated(res, configs, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching period configs', error);
      next(error);
    }
  }

  /**
   * Create class timetable
   */
  static async createTimetable(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { timetableName, class: classId, section, academicYear, dayWiseSchedule, description } = req.body;

      if (!timetableName || !classId || !academicYear || !Array.isArray(dayWiseSchedule)) {
        throw new ValidationError('Missing or invalid required fields');
      }

      const timetable = new Timetable({
        schoolId,
        timetableName,
        class: classId,
        section,
        academicYear,
        dayWiseSchedule,
        description,
        createdBy: req.user.userId,
        status: 'ACTIVE'
      });

      await timetable.save();

      return responseHelper.created(res, timetable, 'Timetable created successfully');
    } catch (error) {
      logger.error('Error creating timetable', error);
      next(error);
    }
  }

  /**
   * Get timetables
   */
  static async getTimetables(req, res, next) {
    try {
      const { page = 1, limit = 12, class: classId = '', academicYear = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (classId) filter.class = classId;
      if (academicYear) filter.academicYear = academicYear;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Timetable.countDocuments(filter);
      const timetables = await Timetable.find(filter)
        .populate('class', 'name code')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, timetables, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching timetables', error);
      next(error);
    }
  }

  /**
   * Get timetable by ID
   */
  static async getTimetableById(req, res, next) {
    try {
      const { timetableId } = req.params;
      const schoolId = req.user.schoolId;

      const timetable = await Timetable.findOne({ _id: timetableId, schoolId })
        .populate('class', 'name code')
        .populate('section', 'name code')
        .lean();

      if (!timetable) throw new AppError('Timetable not found', 404);

      return responseHelper.success(res, timetable, 'Timetable retrieved successfully');
    } catch (error) {
      logger.error('Error fetching timetable', error);
      next(error);
    }
  }

  /**
   * Update timetable
   */
  static async updateTimetable(req, res, next) {
    try {
      const { timetableId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const timetable = await Timetable.findOneAndUpdate(
        { _id: timetableId, schoolId },
        updateData,
        { new: true }
      );

      if (!timetable) throw new AppError('Timetable not found', 404);

      return responseHelper.success(res, timetable, 'Timetable updated successfully');
    } catch (error) {
      logger.error('Error updating timetable', error);
      next(error);
    }
  }

  /**
   * Delete timetable
   */
  static async deleteTimetable(req, res, next) {
    try {
      const { timetableId } = req.params;
      const schoolId = req.user.schoolId;

      const timetable = await Timetable.findOneAndDelete({ _id: timetableId, schoolId });

      if (!timetable) throw new AppError('Timetable not found', 404);

      return responseHelper.noContent(res, 'Timetable deleted successfully');
    } catch (error) {
      logger.error('Error deleting timetable', error);
      next(error);
    }
  }

  /**
   * Get class schedule for a day
   */
  static async getClassScheduleByDay(req, res, next) {
    try {
      const { timetableId } = req.params;
      const { day } = req.query;
      const schoolId = req.user.schoolId;

      if (!day) throw new ValidationError('Day is required');

      const timetable = await Timetable.findOne({ _id: timetableId, schoolId }).lean();

      if (!timetable) throw new AppError('Timetable not found', 404);

      const daySchedule = timetable.dayWiseSchedule.find(d => d.dayOfWeek === day);

      if (!daySchedule) throw new AppError(`No schedule for ${day}`, 404);

      return responseHelper.success(res, daySchedule, `${day} schedule retrieved successfully`);
    } catch (error) {
      logger.error('Error fetching class schedule', error);
      next(error);
    }
  }

  /**
   * Create teacher timetable
   */
  static async createTeacherTimetable(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { teacher, academicYear, schedule } = req.body;

      if (!teacher || !academicYear) {
        throw new ValidationError('Missing required fields');
      }

      const teacherTimetable = new TeacherTimetable({
        schoolId,
        teacher,
        academicYear,
        schedule,
        createdBy: req.user.userId
      });

      await teacherTimetable.save();

      return responseHelper.created(res, teacherTimetable, 'Teacher timetable created successfully');
    } catch (error) {
      logger.error('Error creating teacher timetable', error);
      next(error);
    }
  }

  /**
   * Get teacher timetable
   */
  static async getTeacherTimetable(req, res, next) {
    try {
      const { teacherId } = req.params;
      const { academicYear } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId, teacher: teacherId };
      if (academicYear) filter.academicYear = academicYear;

      const timetable = await TeacherTimetable.findOne(filter)
        .populate('teacher', 'firstName lastName employeeId')
        .lean();

      if (!timetable) throw new AppError('Teacher timetable not found', 404);

      return responseHelper.success(res, timetable, 'Teacher timetable retrieved successfully');
    } catch (error) {
      logger.error('Error fetching teacher timetable', error);
      next(error);
    }
  }

  /**
   * Get teacher free periods
   */
  static async getTeacherFreePeriods(req, res, next) {
    try {
      const { teacherId } = req.params;
      const { day } = req.query;
      const schoolId = req.user.schoolId;

      const timetable = await TeacherTimetable.findOne({ schoolId, teacher: teacherId }).lean();

      if (!timetable) throw new AppError('Teacher timetable not found', 404);

      const daySchedule = timetable.schedule.find(s => s.dayOfWeek === day);
      const freePeriods = daySchedule ? daySchedule.periods.filter(p => !p.subject) : [];

      return responseHelper.success(res, { day, freePeriods }, 'Free periods retrieved successfully');
    } catch (error) {
      logger.error('Error fetching free periods', error);
      next(error);
    }
  }

  /**
   * Validate timetable conflicts
   */
  static async validateTimetableConflicts(req, res, next) {
    try {
      const { timetableId } = req.params;
      const schoolId = req.user.schoolId;

      const timetable = await Timetable.findOne({ _id: timetableId, schoolId }).lean();

      if (!timetable) throw new AppError('Timetable not found', 404);

      const conflicts = [];

      timetable.dayWiseSchedule.forEach(day => {
        day.periods.forEach((period, index) => {
          if (period.teacherId && period.classroomId) {
            const duplicate = day.periods.slice(0, index).find(
              p => p.teacherId === period.teacherId && p.startTime === period.startTime
            );
            if (duplicate) {
              conflicts.push({
                type: 'TEACHER_CONFLICT',
                teacher: period.teacherId,
                day: day.dayOfWeek,
                period: index + 1
              });
            }
          }
        });
      });

      return responseHelper.success(res, { hasConflicts: conflicts.length > 0, conflicts }, 'Timetable validation completed');
    } catch (error) {
      logger.error('Error validating timetable', error);
      next(error);
    }
  }
}

module.exports = TimetableController;
    const config = await timetableService.createPeriodConfig(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, config, 'Period configuration created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/timetable/period-configs - Get all period configurations
 */
exports.getAllPeriodConfigs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const { configs, total } = await timetableService.getAllPeriodConfigs(
      req.user.schoolId,
      {
        status,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, configs, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/timetable/period-configs/:id - Get period config by ID
 */
exports.getPeriodConfigById = async (req, res, next) => {
  try {
    const config = await timetableService.getPeriodConfigById(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, config);
  } catch (err) {
    next(err);
  }
};

// ============== TIME SLOTS ==============

/**
 * POST /api/v1/timetable/time-slots - Create time slot
 */
exports.createTimeSlot = async (req, res, next) => {
  try {
    const slot = await timetableService.createTimeSlot(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, slot, 'Time slot created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/timetable/time-slots - Get all time slots
 */
exports.getAllTimeSlots = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const { slots, total } = await timetableService.getAllTimeSlots(
      req.user.schoolId,
      {
        status,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, slots, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

// ============== TIMETABLE MANAGEMENT ==============

/**
 * POST /api/v1/timetable - Create timetable
 */
exports.createTimetable = async (req, res, next) => {
  try {
    const timetable = await timetableService.createTimetable(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, timetable, 'Timetable created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/timetable - Get all timetables
 */
exports.getAllTimetables = async (req, res, next) => {
  try {
    const { status, classId, isActive, page = 1, limit = 20 } = req.query;

    const { timetables, total } = await timetableService.getAllTimetables(
      req.user.schoolId,
      {
        status,
        classId,
        isActive: isActive === 'true',
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, timetables, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/timetable/:id - Get timetable by ID
 */
exports.getTimetableById = async (req, res, next) => {
  try {
    const timetable = await timetableService.getTimetableById(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, timetable);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/timetable/:id - Update timetable
 */
exports.updateTimetable = async (req, res, next) => {
  try {
    const timetable = await timetableService.updateTimetable(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, timetable, 'Timetable updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/timetable/:id/publish - Publish timetable
 */
exports.publishTimetable = async (req, res, next) => {
  try {
    const timetable = await timetableService.publishTimetable(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, timetable, 'Timetable published successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/timetable/:id/activate - Activate timetable
 */
exports.activateTimetable = async (req, res, next) => {
  try {
    const timetable = await timetableService.activateTimetable(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, timetable, 'Timetable activated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/timetable/:id/statistics - Get timetable statistics
 */
exports.getTimetableStatistics = async (req, res, next) => {
  try {
    const stats = await timetableService.getTimetableStatistics(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, stats);
  } catch (err) {
    next(err);
  }
};

// ============== TEACHER TIMETABLE ==============

/**
 * POST /api/v1/timetable/teachers/:teacherId - Create teacher timetable
 */
exports.createTeacherTimetable = async (req, res, next) => {
  try {
    const teacherTimetable = await timetableService.createTeacherTimetable(
      req.user.schoolId,
      req.params.teacherId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, teacherTimetable, 'Teacher timetable created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/timetable/teachers/:teacherId - Get teacher timetable
 */
exports.getTeacherTimetable = async (req, res, next) => {
  try {
    const teacherTimetable = await timetableService.getTeacherTimetable(
      req.user.schoolId,
      req.params.teacherId
    );

    return responseHelper.success(res, teacherTimetable);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/timetable/teachers/:teacherId/confirm - Confirm teacher timetable
 */
exports.confirmTeacherTimetable = async (req, res, next) => {
  try {
    const teacherTimetable = await timetableService.confirmTeacherTimetable(
      req.user.schoolId,
      req.params.teacherId,
      req.user.userId
    );

    return responseHelper.success(res, teacherTimetable, 'Teacher timetable confirmed successfully');
  } catch (err) {
    next(err);
  }
};

// ============== TIMETABLE CHANGES ==============

/**
 * POST /api/v1/timetable/:timetableId/changes - Request timetable change
 */
exports.requestTimetableChange = async (req, res, next) => {
  try {
    const change = await timetableService.requestTimetableChange(
      req.user.schoolId,
      req.params.timetableId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, change, 'Timetable change request submitted');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/timetable/changes - Get all timetable changes
 */
exports.getTimetableChanges = async (req, res, next) => {
  try {
    const { status, changeType, page = 1, limit = 20 } = req.query;

    const { changes, total } = await timetableService.getTimetableChanges(
      req.user.schoolId,
      {
        status,
        changeType,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, changes, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/timetable/changes/:changeId/approve - Approve timetable change
 */
exports.approveTimetableChange = async (req, res, next) => {
  try {
    const change = await timetableService.approveTimetableChange(
      req.user.schoolId,
      req.params.changeId,
      req.body,
      req.user.userId
    );

    return responseHelper.success(res, change, 'Timetable change approved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/timetable/changes/:changeId/reject - Reject timetable change
 */
exports.rejectTimetableChange = async (req, res, next) => {
  try {
    const change = await timetableService.rejectTimetableChange(
      req.user.schoolId,
      req.params.changeId,
      req.body,
      req.user.userId
    );

    return responseHelper.success(res, change, 'Timetable change rejected successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/timetable/changes/:changeId/implement - Implement timetable change
 */
exports.implementTimetableChange = async (req, res, next) => {
  try {
    const change = await timetableService.implementTimetableChange(
      req.user.schoolId,
      req.params.changeId,
      req.user.userId
    );

    return responseHelper.success(res, change, 'Timetable change implemented successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
