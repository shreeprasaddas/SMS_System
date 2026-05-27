/**
 * Subject Controller
 * Subject management and curriculum
 */

const Subject = require('../models/academic/Subject.model');
const Curriculum = require('../models/academic/Curriculum.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class SubjectController {
  /**
   * Create subject
   */
  static async createSubject(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { name, code, description, category, maxMarks, passingMarks, creditHours, isTheoryBased, isPracticalBased } = req.body;

      if (!name || !code) {
        throw new ValidationError('Name and code are required');
      }

      const existingSubject = await Subject.findOne({ schoolId, code });
      if (existingSubject) {
        throw new ValidationError('Subject with this code already exists');
      }

      const subject = new Subject({
        schoolId,
        name,
        code,
        description,
        category: category || 'CORE',
        maxMarks: maxMarks || 100,
        passingMarks: passingMarks || 40,
        creditHours,
        isTheoryBased: isTheoryBased !== false,
        isPracticalBased: isPracticalBased || false,
        createdBy: req.user.userId,
        status: 'ACTIVE'
      });

      await subject.save();

      return responseHelper.created(res, subject, 'Subject created successfully');
    } catch (error) {
      logger.error('Error creating subject', error);
      next(error);
    }
  }

  /**
   * Get all subjects
   */
  static async getSubjects(req, res, next) {
    try {
      const { page = 1, limit = 12, search = '', category = '', status = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (status) filter.status = status;
      if (category) filter.category = category;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Subject.countDocuments(filter);
      const subjects = await Subject.find(filter)
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ name: 1 });

      return responseHelper.paginated(res, subjects, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching subjects', error);
      next(error);
    }
  }

  /**
   * Get subject by ID
   */
  static async getSubject(req, res, next) {
    try {
      const { subjectId } = req.params;
      const schoolId = req.user.schoolId;

      const subject = await Subject.findOne({ _id: subjectId, schoolId }).lean();

      if (!subject) throw new AppError('Subject not found', 404);

      return responseHelper.success(res, subject, 'Subject retrieved successfully');
    } catch (error) {
      logger.error('Error fetching subject', error);
      next(error);
    }
  }

  /**
   * Update subject
   */
  static async updateSubject(req, res, next) {
    try {
      const { subjectId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const subject = await Subject.findOneAndUpdate(
        { _id: subjectId, schoolId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!subject) throw new AppError('Subject not found', 404);

      return responseHelper.success(res, subject, 'Subject updated successfully');
    } catch (error) {
      logger.error('Error updating subject', error);
      next(error);
    }
  }

  /**
   * Delete subject
   */
  static async deleteSubject(req, res, next) {
    try {
      const { subjectId } = req.params;
      const schoolId = req.user.schoolId;

      const subject = await Subject.findOneAndDelete({ _id: subjectId, schoolId });

      if (!subject) throw new AppError('Subject not found', 404);

      return responseHelper.noContent(res, 'Subject deleted successfully');
    } catch (error) {
      logger.error('Error deleting subject', error);
      next(error);
    }
  }

  /**
   * Create curriculum
   */
  static async createCurriculum(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { name, academicYear, class: classId, subjects, description } = req.body;

      if (!name || !academicYear || !classId || !Array.isArray(subjects)) {
        throw new ValidationError('Missing or invalid required fields');
      }

      const curriculum = new Curriculum({
        schoolId,
        name,
        academicYear,
        class: classId,
        subjects,
        description,
        createdBy: req.user.userId
      });

      await curriculum.save();
      await curriculum.populate('subjects', 'name code');

      return responseHelper.created(res, curriculum, 'Curriculum created successfully');
    } catch (error) {
      logger.error('Error creating curriculum', error);
      next(error);
    }
  }

  /**
   * Get curriculums
   */
  static async getCurriculums(req, res, next) {
    try {
      const { page = 1, limit = 12, academicYear = '', class: classId = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (academicYear) filter.academicYear = academicYear;
      if (classId) filter.class = classId;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Curriculum.countDocuments(filter);
      const curriculums = await Curriculum.find(filter)
        .populate('subjects', 'name code')
        .populate('class', 'name code')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, curriculums, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching curriculums', error);
      next(error);
    }
  }

  /**
   * Update curriculum
   */
  static async updateCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;
      const schoolId = req.user.schoolId;
      const { subjects, description } = req.body;

      const curriculum = await Curriculum.findOneAndUpdate(
        { _id: curriculumId, schoolId },
        { subjects, description },
        { new: true }
      ).populate('subjects', 'name code');

      if (!curriculum) throw new AppError('Curriculum not found', 404);

      return responseHelper.success(res, curriculum, 'Curriculum updated successfully');
    } catch (error) {
      logger.error('Error updating curriculum', error);
      next(error);
    }
  }

  /**
   * Delete curriculum
   */
  static async deleteCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;
      const schoolId = req.user.schoolId;

      const curriculum = await Curriculum.findOneAndDelete({ _id: curriculumId, schoolId });

      if (!curriculum) throw new AppError('Curriculum not found', 404);

      return responseHelper.noContent(res, 'Curriculum deleted successfully');
    } catch (error) {
      logger.error('Error deleting curriculum', error);
      next(error);
    }
  }

  /**
   * Get subjects by category
   */
  static async getSubjectsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const schoolId = req.user.schoolId;

      const subjects = await Subject.find({ schoolId, category, status: 'ACTIVE' })
        .lean()
        .sort({ name: 1 });

      return responseHelper.success(res, subjects, `${category} subjects retrieved successfully`);
    } catch (error) {
      logger.error('Error fetching subjects by category', error);
      next(error);
    }
  }

  /**
   * Add subject to curriculum
   */
  static async addSubjectToCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;
      const { subjectId } = req.body;
      const schoolId = req.user.schoolId;

      if (!subjectId) throw new ValidationError('Subject ID is required');

      const curriculum = await Curriculum.findOneAndUpdate(
        { _id: curriculumId, schoolId },
        { $addToSet: { subjects: subjectId } },
        { new: true }
      ).populate('subjects', 'name code');

      if (!curriculum) throw new AppError('Curriculum not found', 404);

      return responseHelper.success(res, curriculum, 'Subject added to curriculum successfully');
    } catch (error) {
      logger.error('Error adding subject to curriculum', error);
      next(error);
    }
  }

  /**
   * Remove subject from curriculum
   */
  static async removeSubjectFromCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;
      const { subjectId } = req.body;
      const schoolId = req.user.schoolId;

      if (!subjectId) throw new ValidationError('Subject ID is required');

      const curriculum = await Curriculum.findOneAndUpdate(
        { _id: curriculumId, schoolId },
        { $pull: { subjects: subjectId } },
        { new: true }
      ).populate('subjects', 'name code');

      if (!curriculum) throw new AppError('Curriculum not found', 404);

      return responseHelper.success(res, curriculum, 'Subject removed from curriculum successfully');
    } catch (error) {
      logger.error('Error removing subject from curriculum', error);
      next(error);
    }
  }

  /**
   * Get single curriculum by ID
   */
  static async getCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;
      const schoolId = req.user.schoolId;

      const curriculum = await Curriculum.findOne({ _id: curriculumId, schoolId })
        .populate('subjects', 'name code')
        .populate('class', 'name code')
        .lean();

      if (!curriculum) throw new AppError('Curriculum not found', 404);

      return responseHelper.success(res, curriculum, 'Curriculum retrieved successfully');
    } catch (error) {
      logger.error('Error fetching curriculum', error);
      next(error);
    }
  }

  /**
   * Approve curriculum
   */
  static async approveCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;
      const schoolId = req.user.schoolId;

      const curriculum = await Curriculum.findOneAndUpdate(
        { _id: curriculumId, schoolId },
        { status: 'APPROVED', approvedBy: req.user.userId, approvedAt: new Date() },
        { new: true }
      );

      if (!curriculum) throw new AppError('Curriculum not found', 404);

      return responseHelper.success(res, curriculum, 'Curriculum approved successfully');
    } catch (error) {
      logger.error('Error approving curriculum', error);
      next(error);
    }
  }

  /**
   * Activate curriculum
   */
  static async activateCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;
      const schoolId = req.user.schoolId;

      const curriculum = await Curriculum.findOneAndUpdate(
        { _id: curriculumId, schoolId },
        { status: 'ACTIVE', activatedAt: new Date() },
        { new: true }
      );

      if (!curriculum) throw new AppError('Curriculum not found', 404);

      return responseHelper.success(res, curriculum, 'Curriculum activated successfully');
    } catch (error) {
      logger.error('Error activating curriculum', error);
      next(error);
    }
  }

  /**
   * Assign teacher to subject
   */
  static async assignTeacher(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { subjectId, teacherId, classId, academicYear } = req.body;

      if (!subjectId || !teacherId) {
        throw new ValidationError('Subject ID and Teacher ID are required');
      }

      // Store as a field on the subject or in a separate collection
      const subject = await Subject.findOneAndUpdate(
        { _id: subjectId, schoolId },
        { $addToSet: { assignedTeachers: teacherId } },
        { new: true }
      );

      if (!subject) throw new AppError('Subject not found', 404);

      return responseHelper.created(res, { subject }, 'Teacher assigned to subject successfully');
    } catch (error) {
      logger.error('Error assigning teacher', error);
      next(error);
    }
  }

  /**
   * Get teacher subject assignments
   */
  static async getTeacherAssignments(req, res, next) {
    try {
      const { teacherId } = req.params;
      const schoolId = req.user.schoolId;

      const subjects = await Subject.find({
        schoolId,
        assignedTeachers: teacherId,
        status: 'ACTIVE'
      }).lean().sort({ name: 1 });

      return responseHelper.success(res, subjects, 'Teacher assignments retrieved successfully');
    } catch (error) {
      logger.error('Error fetching teacher assignments', error);
      next(error);
    }
  }

  /**
   * Remove teacher from subject
   */
  static async removeTeacher(req, res, next) {
    try {
      const { assignmentId } = req.params;
      const schoolId = req.user.schoolId;

      // assignmentId here could be interpreted as subjectId for removal
      const subject = await Subject.findOneAndUpdate(
        { _id: assignmentId, schoolId },
        { $set: { assignedTeachers: [] } },
        { new: true }
      );

      if (!subject) throw new AppError('Assignment not found', 404);

      return responseHelper.success(res, null, 'Teacher removed from subject successfully');
    } catch (error) {
      logger.error('Error removing teacher', error);
      next(error);
    }
  }
}

module.exports = SubjectController;

