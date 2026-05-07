/**
 * Student Controller
 * Handles all student-related operations
 */

const Student = require('../models/user/Student.model');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class StudentController {
  /**
   * Get all students with pagination, search, filters
   */
  static async getStudents(req, res, next) {
    try {
      const { page = 1, limit = 12, search = '', class: classId = '', status = '' } = req.query;
      const schoolId = req.user.schoolId;

      // Build filter
      const filter = { schoolId };
      
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
        ];
      }

      if (classId) {
        filter.classId = classId;
      }

      if (status) {
        filter.status = status;
      }

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Student.countDocuments(filter);
      
      const students = await Student.find(filter)
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.success(res, {
        students,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      }, 'Students fetched successfully');
    } catch (error) {
      logger.error('Error fetching students', error);
      next(error);
    }
  }

  /**
   * Get single student by ID
   */
  static async getStudentById(req, res, next) {
    try {
      const { studentId } = req.params;
      const schoolId = req.user.schoolId;

      const student = await Student.findOne({ _id: studentId, schoolId }).lean();

      if (!student) {
        throw new AppError('Student not found', 404);
      }

      return responseHelper.success(res, student, 'Student fetched successfully');
    } catch (error) {
      logger.error('Error fetching student', error);
      next(error);
    }
  }

  /**
   * Get student statistics
   */
  static async getStudentStats(req, res, next) {
    try {
      const schoolId = req.user.schoolId;

      const totalStudents = await Student.countDocuments({ schoolId });
      const activeStudents = await Student.countDocuments({ schoolId, status: 'ACTIVE' });
      const inactiveStudents = await Student.countDocuments({ schoolId, status: 'INACTIVE' });

      return responseHelper.success(res, {
        totalStudents,
        activeStudents,
        inactiveStudents,
      }, 'Student statistics fetched successfully');
    } catch (error) {
      logger.error('Error fetching student stats', error);
      next(error);
    }
  }

  /**
   * Create new student
   */
  static async createStudent(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { firstName, lastName, email, phone, dateOfBirth, gender, classId, rollNumber } = req.body;

      // Check if email already exists
      const existingStudent = await Student.findOne({ email, schoolId });
      if (existingStudent) {
        throw new AppError('Email already registered', 400);
      }

      const student = new Student({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        gender,
        classId,
        rollNumber,
        schoolId,
        status: 'ACTIVE',
      });

      await student.save();

      return responseHelper.success(res, student, 'Student created successfully', 201);
    } catch (error) {
      logger.error('Error creating student', error);
      next(error);
    }
  }

  /**
   * Update student
   */
  static async updateStudent(req, res, next) {
    try {
      const { studentId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const student = await Student.findOneAndUpdate(
        { _id: studentId, schoolId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!student) {
        throw new AppError('Student not found', 404);
      }

      return responseHelper.success(res, student, 'Student updated successfully');
    } catch (error) {
      logger.error('Error updating student', error);
      next(error);
    }
  }

  /**
   * Partial update student
   */
  static async patchStudent(req, res, next) {
    try {
      const { studentId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const student = await Student.findOneAndUpdate(
        { _id: studentId, schoolId },
        { $set: updateData },
        { new: true }
      );

      if (!student) {
        throw new AppError('Student not found', 404);
      }

      return responseHelper.success(res, student, 'Student updated successfully');
    } catch (error) {
      logger.error('Error patching student', error);
      next(error);
    }
  }

  /**
   * Delete student
   */
  static async deleteStudent(req, res, next) {
    try {
      const { studentId } = req.params;
      const schoolId = req.user.schoolId;

      const student = await Student.findOneAndDelete({ _id: studentId, schoolId });

      if (!student) {
        throw new AppError('Student not found', 404);
      }

      return responseHelper.success(res, { _id: studentId }, 'Student deleted successfully');
    } catch (error) {
      logger.error('Error deleting student', error);
      next(error);
    }
  }

  /**
   * Bulk import students
   */
  static async bulkImportStudents(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { students } = req.body;

      const result = await Student.insertMany(
        students.map(s => ({ ...s, schoolId }))
      );

      return responseHelper.success(res, {
        imported: result.length,
        students: result,
      }, `${result.length} students imported successfully`, 201);
    } catch (error) {
      logger.error('Error bulk importing students', error);
      next(error);
    }
  }

  /**
   * Export students
   */
  static async exportStudents(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const students = await Student.find({ schoolId }).lean();

      // CSV conversion would happen here
      return responseHelper.success(res, students, 'Students exported successfully');
    } catch (error) {
      logger.error('Error exporting students', error);
      next(error);
    }
  }
}

module.exports = StudentController;
