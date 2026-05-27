/**
 * Class Controller
 * CRUD operations for classes/sections management
 */

const Class = require('../models/academic/Class.model');
require('../models/academic/Section.model');
require('../models/academic/Subject.model');
require('../models/academic/AcademicYear.model');
require('../models/user/User.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class ClassController {
  /**
   * Get all classes with pagination and filters
   */
  static async getClasses(req, res, next) {
    try {
      const { page = 1, limit = 12, search = '', status = '', academicYear = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (status) filter.status = status;
      if (academicYear) filter.academicYear = academicYear;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Class.countDocuments(filter);
      const classes = await Class.find(filter)
        .populate('classTeacher', 'firstName lastName email')
        .populate('academicYear', 'name')
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ classNumber: 1 });

      const mappedClasses = classes.map(c => ({
        ...c,
        section: c.section || (c.sections && c.sections[0] ? c.sections[0].name : 'A'),
        academicYear: c.academicYear ? (c.academicYear.name || '2025-2026') : '2025-2026',
        classTeacher: c.classTeacher ? `${c.classTeacher.firstName} ${c.classTeacher.lastName}`.trim() : 'Unassigned',
        teacherId: c.classTeacher ? (c.classTeacher.email || 'N/A') : 'N/A',
      }));

      return responseHelper.paginated(res, mappedClasses, {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      });
    } catch (error) {
      logger.error('Error fetching classes', error);
      next(error);
    }
  }

  /**
   * Get single class by ID
   */
  static async getClass(req, res, next) {
    try {
      const { classId } = req.params;
      const schoolId = req.user.schoolId;

      const classData = await Class.findOne({ _id: classId, schoolId })
        .populate('classTeacher', 'firstName lastName email phone')
        .populate('academicYear', 'name startDate endDate')
        .populate('subjects', 'name code')
        .populate('sections', 'name code')
        .lean();

      if (!classData) throw new AppError('Class not found', 404);

      // Map to frontend compatible fields
      const mappedClassData = {
        ...classData,
        section: classData.section || (classData.sections && classData.sections[0] ? classData.sections[0].name : 'A'),
        academicYear: classData.academicYear ? (classData.academicYear.name || '2025-2026') : '2025-2026',
        classTeacher: classData.classTeacher ? `${classData.classTeacher.firstName} ${classData.classTeacher.lastName}`.trim() : 'Unassigned',
        teacherId: classData.classTeacher ? (classData.classTeacher.email || 'N/A') : 'N/A',
      };

      return responseHelper.success(res, mappedClassData, 'Class retrieved successfully');
    } catch (error) {
      logger.error('Error fetching class', error);
      next(error);
    }
  }

  /**
   * Create new class
   */
  static async createClass(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const mongoose = require('mongoose');
      const { name, code, classNumber, academicYear, stream, capacity, classTeacher, teacherId, description } = req.body;

      if (!name) {
        throw new ValidationError('Class name is required');
      }

      // --- 1. Resolve / Auto-generate code ---
      let resolvedCode = code || name.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase();
      if (!resolvedCode) {
        resolvedCode = 'CLASS-' + Math.floor(1000 + Math.random() * 9000);
      }

      // Ensure unique code in the database
      let codeExists = await Class.findOne({ schoolId, code: resolvedCode });
      if (codeExists) {
        resolvedCode = `${resolvedCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // --- 2. Resolve / Auto-generate classNumber ---
      let resolvedClassNumber = classNumber;
      if (resolvedClassNumber === undefined || resolvedClassNumber === null || resolvedClassNumber === '') {
        const match = name.match(/\d+/);
        resolvedClassNumber = match ? parseInt(match[0], 10) : 10;
      }

      // --- 3. Resolve Academic Year to a valid ObjectId ---
      const AcademicYear = require('../models/academic/AcademicYear.model');
      let resolvedAcademicYearId;

      if (academicYear && mongoose.Types.ObjectId.isValid(academicYear)) {
        resolvedAcademicYearId = academicYear;
      } else {
        // Search by year name or code
        let yearDoc = await AcademicYear.findOne({
          schoolId,
          $or: [
            { name: academicYear },
            { code: academicYear }
          ]
        });
        if (!yearDoc) {
          // Fallback to active year or first available year
          yearDoc = await AcademicYear.findOne({ schoolId, isActive: true }) || await AcademicYear.findOne({ schoolId });
        }
        if (yearDoc) {
          resolvedAcademicYearId = yearDoc._id;
        } else {
          throw new ValidationError('Academic year not found. Please create an Academic Year first.');
        }
      }

      // --- 4. Resolve Class Teacher to a valid ObjectId ---
      let resolvedTeacherId;
      const teacherToResolve = classTeacher || teacherId;
      if (teacherToResolve && mongoose.Types.ObjectId.isValid(teacherToResolve)) {
        resolvedTeacherId = teacherToResolve;
      } else {
        // Fallback to the currently logged in admin user
        resolvedTeacherId = req.user.userId;
      }

      const newClass = new Class({
        schoolId,
        name,
        code: resolvedCode,
        classNumber: parseInt(resolvedClassNumber, 10),
        academicYear: resolvedAcademicYearId,
        stream: stream && mongoose.Types.ObjectId.isValid(stream) ? stream : undefined,
        capacity: parseInt(capacity, 10) || 50,
        classTeacher: resolvedTeacherId,
        description,
        createdBy: req.user.userId,
        status: 'ACTIVE'
      });

      await newClass.save();
      await newClass.populate('classTeacher', 'firstName lastName email');
      await newClass.populate('academicYear', 'name');

      return responseHelper.created(res, newClass, 'Class created successfully');
    } catch (error) {
      logger.error('Error creating class', error);
      next(error);
    }
  }

  /**
   * Update class
   */
  static async updateClass(req, res, next) {
    try {
      const { classId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const classData = await Class.findOneAndUpdate(
        { _id: classId, schoolId },
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).populate('classTeacher', 'firstName lastName email')
        .populate('academicYear', 'yearName');

      if (!classData) throw new AppError('Class not found', 404);

      return responseHelper.success(res, classData, 'Class updated successfully');
    } catch (error) {
      logger.error('Error updating class', error);
      next(error);
    }
  }

  /**
   * Delete class
   */
  static async deleteClass(req, res, next) {
    try {
      const { classId } = req.params;
      const schoolId = req.user.schoolId;

      const classData = await Class.findOneAndDelete({ _id: classId, schoolId });

      if (!classData) throw new AppError('Class not found', 404);

      return responseHelper.noContent(res, 'Class deleted successfully');
    } catch (error) {
      logger.error('Error deleting class', error);
      next(error);
    }
  }

  /**
   * Assign teacher to class
   */
  static async assignClassTeacher(req, res, next) {
    try {
      const { classId } = req.params;
      const { teacherId } = req.body;
      const schoolId = req.user.schoolId;

      if (!teacherId) throw new ValidationError('Teacher ID is required');

      const classData = await Class.findOneAndUpdate(
        { _id: classId, schoolId },
        { classTeacher: teacherId },
        { new: true }
      ).populate('classTeacher', 'firstName lastName email');

      if (!classData) throw new AppError('Class not found', 404);

      return responseHelper.success(res, classData, 'Teacher assigned successfully');
    } catch (error) {
      logger.error('Error assigning teacher', error);
      next(error);
    }
  }

  /**
   * Assign subject to class
   */
  static async assignSubject(req, res, next) {
    try {
      const { classId } = req.params;
      const { subjectId } = req.body;
      const schoolId = req.user.schoolId;

      if (!subjectId) throw new ValidationError('Subject ID is required');

      const classData = await Class.findOneAndUpdate(
        { _id: classId, schoolId },
        { $addToSet: { subjects: subjectId } },
        { new: true }
      ).populate('subjects', 'name code');

      if (!classData) throw new AppError('Class not found', 404);

      return responseHelper.success(res, classData, 'Subject assigned successfully');
    } catch (error) {
      logger.error('Error assigning subject', error);
      next(error);
    }
  }

  /**
   * Remove subject from class
   */
  static async removeSubject(req, res, next) {
    try {
      const { classId } = req.params;
      const { subjectId } = req.body;
      const schoolId = req.user.schoolId;

      if (!subjectId) throw new ValidationError('Subject ID is required');

      const classData = await Class.findOneAndUpdate(
        { _id: classId, schoolId },
        { $pull: { subjects: subjectId } },
        { new: true }
      ).populate('subjects', 'name code');

      if (!classData) throw new AppError('Class not found', 404);

      return responseHelper.success(res, classData, 'Subject removed successfully');
    } catch (error) {
      logger.error('Error removing subject', error);
      next(error);
    }
  }

  /**
   * Add section to class
   */
  static async addSection(req, res, next) {
    try {
      const { classId } = req.params;
      const { sectionId } = req.body;
      const schoolId = req.user.schoolId;

      if (!sectionId) throw new ValidationError('Section ID is required');

      const classData = await Class.findOneAndUpdate(
        { _id: classId, schoolId },
        { $addToSet: { sections: sectionId } },
        { new: true }
      ).populate('sections', 'name code');

      if (!classData) throw new AppError('Class not found', 404);

      return responseHelper.success(res, classData, 'Section added successfully');
    } catch (error) {
      logger.error('Error adding section', error);
      next(error);
    }
  }

  /**
   * Update total strength
   */
  static async updateStrength(req, res, next) {
    try {
      const { classId } = req.params;
      const { strength } = req.body;
      const schoolId = req.user.schoolId;

      if (!strength || strength < 0) throw new ValidationError('Invalid strength value');

      const classData = await Class.findOneAndUpdate(
        { _id: classId, schoolId },
        { totalStrength: strength },
        { new: true }
      );

      if (!classData) throw new AppError('Class not found', 404);

      return responseHelper.success(res, classData, 'Class strength updated successfully');
    } catch (error) {
      logger.error('Error updating strength', error);
      next(error);
    }
  }

  /**
   * Get class statistics
   */
  static async getClassStatistics(req, res, next) {
    try {
      const { classId } = req.params;
      const schoolId = req.user.schoolId;

      const classData = await Class.findOne({ _id: classId, schoolId }).lean();

      if (!classData) throw new AppError('Class not found', 404);

      const statistics = {
        classId: classData._id,
        name: classData.name,
        code: classData.code,
        totalCapacity: classData.capacity || 0,
        totalStrength: classData.totalStrength || 0,
        availableSeats: (classData.capacity || 0) - (classData.totalStrength || 0),
        occupancyPercentage: classData.capacity ? Math.round((classData.totalStrength / classData.capacity) * 100) : 0,
        totalSubjects: classData.subjects?.length || 0,
        sectionsCount: classData.sections?.length || 0
      };

      return responseHelper.success(res, statistics, 'Class statistics retrieved successfully');
    } catch (error) {
      logger.error('Error fetching class statistics', error);
      next(error);
    }
  }
}

module.exports = ClassController;
