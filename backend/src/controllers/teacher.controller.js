/**
 * Teacher Controller
 * Handles all teacher-related operations
 */

const Teacher = require('../models/user/Teacher.model');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class TeacherController {
  /**
   * Get all teachers
   */
  static async getTeachers(req, res, next) {
    try {
      const { page = 1, limit = 12, search = '', department = '', status = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      if (department) {
        filter.department = department;
      }

      if (status) {
        filter.status = status;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Teacher.countDocuments(filter);
      
      const teachers = await Teacher.find(filter)
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.success(res, {
        teachers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      }, 'Teachers fetched successfully');
    } catch (error) {
      logger.error('Error fetching teachers', error);
      next(error);
    }
  }

  /**
   * Get single teacher by ID
   */
  static async getTeacherById(req, res, next) {
    try {
      const { teacherId } = req.params;
      const schoolId = req.user.schoolId;

      const teacher = await Teacher.findOne({ _id: teacherId, schoolId }).lean();

      if (!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      return responseHelper.success(res, teacher, 'Teacher fetched successfully');
    } catch (error) {
      logger.error('Error fetching teacher', error);
      next(error);
    }
  }

  /**
   * Get teacher statistics
   */
  static async getTeacherStats(req, res, next) {
    try {
      const schoolId = req.user.schoolId;

      const totalTeachers = await Teacher.countDocuments({ schoolId });
      const activeTeachers = await Teacher.countDocuments({ schoolId, status: 'ACTIVE' });

      return responseHelper.success(res, {
        totalTeachers,
        activeTeachers,
      }, 'Teacher statistics fetched successfully');
    } catch (error) {
      logger.error('Error fetching teacher stats', error);
      next(error);
    }
  }

  /**
   * Create teacher
   */
  static async createTeacher(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { firstName, lastName, email, phone, department, qualification } = req.body;

      const existingTeacher = await Teacher.findOne({ email, schoolId });
      if (existingTeacher) {
        throw new AppError('Email already registered', 400);
      }

      const teacher = new Teacher({
        firstName,
        lastName,
        email,
        phone,
        department,
        qualification,
        schoolId,
        status: 'ACTIVE',
      });

      await teacher.save();

      return responseHelper.success(res, teacher, 'Teacher created successfully', 201);
    } catch (error) {
      logger.error('Error creating teacher', error);
      next(error);
    }
  }

  /**
   * Update teacher
   */
  static async updateTeacher(req, res, next) {
    try {
      const { teacherId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const teacher = await Teacher.findOneAndUpdate(
        { _id: teacherId, schoolId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      return responseHelper.success(res, teacher, 'Teacher updated successfully');
    } catch (error) {
      logger.error('Error updating teacher', error);
      next(error);
    }
  }

  /**
   * Partial update teacher
   */
  static async patchTeacher(req, res, next) {
    try {
      const { teacherId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const teacher = await Teacher.findOneAndUpdate(
        { _id: teacherId, schoolId },
        { $set: updateData },
        { new: true }
      );

      if (!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      return responseHelper.success(res, teacher, 'Teacher updated successfully');
    } catch (error) {
      logger.error('Error patching teacher', error);
      next(error);
    }
  }

  /**
   * Delete teacher
   */
  static async deleteTeacher(req, res, next) {
    try {
      const { teacherId } = req.params;
      const schoolId = req.user.schoolId;

      const teacher = await Teacher.findOneAndDelete({ _id: teacherId, schoolId });

      if (!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      return responseHelper.success(res, { _id: teacherId }, 'Teacher deleted successfully');
    } catch (error) {
      logger.error('Error deleting teacher', error);
      next(error);
    }
  }
}

module.exports = TeacherController;
