/**
 * Student Controller
 * Handles all student-related operations
 */

const Student = require('../models/user/Student.model');
require('../models/academic/Class.model');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class StudentController {
  /**
   * Get all students with pagination, search, filters
   */
  static async getStudents(req, res, next) {
    try {
      const { page = 1, limit = 12, search = '', class: queryClass, classId: queryClassId, status = '' } = req.query;
      const classId = queryClass || queryClassId;
      const schoolId = req.user.schoolId;

      // Build filter
      const filter = { schoolId };
      
      if (search) {
        const searchConditions = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];

        // Safe numeric search for roll number
        const numericSearch = Number(search);
        if (!isNaN(numericSearch)) {
          searchConditions.push({ rollNumber: numericSearch });
        }

        filter.$or = searchConditions;
      }

      if (classId) {
        filter.class = classId;
      }

      if (status) {
        filter.status = status;
      }

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Student.countDocuments(filter);
      
      const students = await Student.find(filter)
        .populate('class', 'name code')
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

      const student = await Student.findOne({ _id: studentId, schoolId })
        .populate('class', 'name code')
        .lean();

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
      const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        gender,
        classId,
        rollNumber,
        section,
        parentName,
        parentPhone,
        parentEmail,
        address,
        city,
        state,
        postalCode,
        admissionDate,
        bloodGroup,
      } = req.body;

      // Check if email already exists (globally, since email has a unique index)
      const User = require('../models/user/User.model');
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('Email already registered. Please use a different email address.', 400);
      }

      // Resolve classId to a valid ObjectId
      const Class = require('../models/academic/Class.model');
      let resolvedClassId = classId;
      const mongoose = require('mongoose');
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        // Fallback to the first available class
        const defaultClass = await Class.findOne({ schoolId });
        if (defaultClass) {
          resolvedClassId = defaultClass._id;
        } else {
          throw new AppError('No class found in the database. Please create a class first.', 400);
        }
      } else {
        // Double check if the provided ObjectId exists
        const classExists = await Class.findOne({ _id: classId, schoolId });
        if (!classExists) {
          const defaultClass = await Class.findOne({ schoolId });
          if (defaultClass) {
            resolvedClassId = defaultClass._id;
          }
        }
      }

      // Generate hashed default password for the student
      const bcryptjs = require('bcryptjs');
      const hashedPassword = await bcryptjs.hash('student123', 12);

      // Format guardians array if parent details are provided
      const guardians = [];
      if (parentName || parentPhone || parentEmail) {
        guardians.push({
          name: parentName || '',
          relationship: 'Parent',
          phone: parentPhone || '',
          email: parentEmail || '',
          address: address || '',
        });
      }

      const student = new Student({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'STUDENT',
        phone,
        dateOfBirth,
        gender,
        bloodGroup,
        class: resolvedClassId, // Map classId to class (ref: 'Class')
        section: section || 'A',
        rollNumber: rollNumber || 0,
        enrollmentNumber: req.body.enrollmentNumber || 'ENR-' + Math.floor(100000 + Math.random() * 900000),
        schoolId,
        status: 'ACTIVE',
        address: {
          street: address || '',
          city: city || '',
          state: state || '',
          postalCode: postalCode || '',
          country: 'India',
        },
        guardians,
        admissionDate: admissionDate || new Date(),
      });

      await student.save();

      return responseHelper.success(res, student, 'Student created successfully', 201);
    } catch (error) {
      // Handle MongoDB duplicate key errors gracefully
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || 'field';
        return responseHelper.error(res, `A student with this ${field} already exists.`, 400);
      }
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
      const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        gender,
        classId,
        rollNumber,
        section,
        parentName,
        parentPhone,
        parentEmail,
        address,
        city,
        state,
        postalCode,
        admissionDate,
        bloodGroup,
        status,
      } = req.body;

      // Build update payload mapping flat inputs to the database structures
      const updatePayload = {};
      if (firstName !== undefined) updatePayload.firstName = firstName;
      if (lastName !== undefined) updatePayload.lastName = lastName;
      if (email !== undefined) updatePayload.email = email;
      if (phone !== undefined) updatePayload.phone = phone;
      if (dateOfBirth !== undefined) updatePayload.dateOfBirth = dateOfBirth;
      if (gender !== undefined) updatePayload.gender = gender;
      if (bloodGroup !== undefined) updatePayload.bloodGroup = bloodGroup;
      if (section !== undefined) updatePayload.section = section;
      if (rollNumber !== undefined) updatePayload.rollNumber = rollNumber;
      if (admissionDate !== undefined) updatePayload.admissionDate = admissionDate;
      if (status !== undefined) updatePayload.status = status;

      // Handle classId mapping
      if (classId !== undefined) {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(classId)) {
          updatePayload.class = classId;
        }
      }

      // Merge & construct nested address
      if (address !== undefined || city !== undefined || state !== undefined || postalCode !== undefined) {
        const currentStudent = await Student.findOne({ _id: studentId, schoolId }).lean();
        const currentAddress = currentStudent?.address || {};
        updatePayload.address = {
          street: address !== undefined ? address : (currentAddress.street || ''),
          city: city !== undefined ? city : (currentAddress.city || ''),
          state: state !== undefined ? state : (currentAddress.state || ''),
          postalCode: postalCode !== undefined ? postalCode : (currentAddress.postalCode || ''),
          country: currentAddress.country || 'India',
        };
      }

      // Merge & construct nested guardians array
      if (parentName !== undefined || parentPhone !== undefined || parentEmail !== undefined) {
        const currentStudent = await Student.findOne({ _id: studentId, schoolId }).lean();
        const currentGuardian = currentStudent?.guardians?.[0] || {};
        updatePayload.guardians = [{
          name: parentName !== undefined ? parentName : (currentGuardian.name || ''),
          relationship: 'Parent',
          phone: parentPhone !== undefined ? parentPhone : (currentGuardian.phone || ''),
          email: parentEmail !== undefined ? parentEmail : (currentGuardian.email || ''),
          address: address !== undefined ? address : (currentGuardian.address || ''),
        }];
      }

      const student = await Student.findOneAndUpdate(
        { _id: studentId, schoolId },
        updatePayload,
        { new: true, runValidators: true }
      ).populate('class', 'name code');

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
