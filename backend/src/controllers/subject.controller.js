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
}

module.exports = SubjectController;

class SubjectController {
  /**
   * Create a new subject
   * POST /api/v1/subjects
   */
  static async createSubject(req, res, next) {
    try {
      const subject = await subjectService.createSubject(
        req.user.schoolId,
        req.body,
        req.user.userId
      );

      responseHelper.created(res, { subject }, 'Subject created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all subjects
   * GET /api/v1/subjects
   */
  static async getSubjects(req, res, next) {
    try {
      const { category } = req.query;

      const subjects = await subjectService.getSubjects(req.user.schoolId, { category });

      responseHelper.success(res, { subjects }, 'Subjects retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get subject by ID
   * GET /api/v1/subjects/:subjectId
   */
  static async getSubject(req, res, next) {
    try {
      const { subjectId } = req.params;

      const subject = await subjectService.getSubjectById(req.user.schoolId, subjectId);

      responseHelper.success(res, { subject }, 'Subject retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update subject
   * PUT /api/v1/subjects/:subjectId
   */
  static async updateSubject(req, res, next) {
    try {
      const { subjectId } = req.params;

      const subject = await subjectService.updateSubject(
        req.user.schoolId,
        subjectId,
        req.body,
        req.user.userId
      );

      responseHelper.success(res, { subject }, 'Subject updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete subject
   * DELETE /api/v1/subjects/:subjectId
   */
  static async deleteSubject(req, res, next) {
    try {
      const { subjectId } = req.params;

      await subjectService.updateSubject(
        req.user.schoolId,
        subjectId,
        { status: 'INACTIVE' },
        req.user.userId
      );

      responseHelper.success(res, null, 'Subject deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // CURRICULUM ENDPOINTS
  // ============================================================

  /**
   * Create curriculum
   * POST /api/v1/subjects/:subjectId/curriculum
   */
  static async createCurriculum(req, res, next) {
    try {
      const curriculum = await subjectService.createCurriculum(
        req.user.schoolId,
        req.body,
        req.user.userId
      );

      responseHelper.created(res, { curriculum }, 'Curriculum created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get curriculums
   * GET /api/v1/subjects/curriculum
   */
  static async getCurriculums(req, res, next) {
    try {
      const { subject, class: classId, academicYear, status } = req.query;

      const curriculums = await subjectService.getCurriculums(req.user.schoolId, {
        subject,
        class: classId,
        academicYear,
        status,
      });

      responseHelper.success(res, { curriculums }, 'Curriculums retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get curriculum by ID
   * GET /api/v1/subjects/curriculum/:curriculumId
   */
  static async getCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;

      const curriculum = await subjectService.getCurriculumById(req.user.schoolId, curriculumId);

      responseHelper.success(res, { curriculum }, 'Curriculum retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update curriculum
   * PUT /api/v1/subjects/curriculum/:curriculumId
   */
  static async updateCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;

      const curriculum = await subjectService.updateCurriculum(
        req.user.schoolId,
        curriculumId,
        req.body,
        req.user.userId
      );

      responseHelper.success(res, { curriculum }, 'Curriculum updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve curriculum
   * PATCH /api/v1/subjects/curriculum/:curriculumId/approve
   */
  static async approveCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;

      const curriculum = await subjectService.approveCurriculum(
        req.user.schoolId,
        curriculumId,
        req.user.userId
      );

      responseHelper.success(res, { curriculum }, 'Curriculum approved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activate curriculum
   * PATCH /api/v1/subjects/curriculum/:curriculumId/activate
   */
  static async activateCurriculum(req, res, next) {
    try {
      const { curriculumId } = req.params;

      const curriculum = await subjectService.activateCurriculum(
        req.user.schoolId,
        curriculumId,
        req.user.userId
      );

      responseHelper.success(res, { curriculum }, 'Curriculum activated successfully');
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // TEACHER SUBJECT ASSIGNMENT
  // ============================================================

  /**
   * Assign teacher to subject
   * POST /api/v1/subjects/:subjectId/assign-teacher
   */
  static async assignTeacher(req, res, next) {
    try {
      const assignment = await subjectService.assignTeacherToSubject(
        req.user.schoolId,
        req.body,
        req.user.userId
      );

      responseHelper.created(res, { assignment }, 'Teacher assigned to subject successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get teacher subject assignments
   * GET /api/v1/subjects/teacher/:teacherId/assignments
   */
  static async getTeacherAssignments(req, res, next) {
    try {
      const { teacherId } = req.params;
      const { academicYear } = req.query;

      const assignments = await subjectService.getTeacherSubjectAssignments(
        req.user.schoolId,
        teacherId,
        academicYear
      );

      responseHelper.success(res, { assignments }, 'Assignments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove teacher from subject
   * DELETE /api/v1/subjects/assignment/:assignmentId
   */
  static async removeTeacher(req, res, next) {
    try {
      const { assignmentId } = req.params;

      await subjectService.removeTeacherFromSubject(req.user.schoolId, assignmentId, req.user.userId);

      responseHelper.success(res, null, 'Teacher removed from subject successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SubjectController;
