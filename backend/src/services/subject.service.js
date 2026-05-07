/**
 * Subject Service
 * Business logic for subject and curriculum management
 */

const Subject = require('../models/academic/Subject.model');
const Curriculum = require('../models/academic/Curriculum.model');
const TeacherSubject = require('../models/academic/TeacherSubject.model');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class SubjectService {
  async createSubject(schoolId, data, userId) {
    const existing = await Subject.findOne({ schoolId, code: data.code });
    if (existing) {
      throw new ValidationError('Subject with this code already exists');
    }

    const subject = new Subject({
      ...data,
      schoolId,
      createdBy: userId,
    });

    await subject.save();
    logger.info('Subject created', { schoolId, code: data.code });

    return subject;
  }

  async getSubjects(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.category) query.category = filters.category;

    const subjects = await Subject.find(query).populate('streams');
    return subjects;
  }

  async getSubjectById(schoolId, subjectId) {
    const subject = await Subject.findOne({ _id: subjectId, schoolId }).populate('streams');
    if (!subject) {
      throw new AppError('Subject not found', 404);
    }
    return subject;
  }

  async updateSubject(schoolId, subjectId, data, userId) {
    const subject = await Subject.findOne({ _id: subjectId, schoolId });
    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    Object.assign(subject, data);
    await subject.save();

    logger.info('Subject updated', { schoolId, subjectId });
    return subject;
  }

  // ============================================================
  // CURRICULUM MANAGEMENT
  // ============================================================

  async createCurriculum(schoolId, data, userId) {
    const curriculum = new Curriculum({
      ...data,
      schoolId,
      createdBy: userId,
    });

    await curriculum.save();
    logger.info('Curriculum created', { schoolId, subject: data.subject, class: data.class });

    return curriculum;
  }

  async getCurriculums(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.subject) query.subject = filters.subject;
    if (filters.class) query.class = filters.class;
    if (filters.academicYear) query.academicYear = filters.academicYear;
    if (filters.status) query.status = filters.status;

    const curriculums = await Curriculum.find(query)
      .populate('subject')
      .populate('class')
      .populate('academicYear')
      .populate('createdBy', 'firstName lastName');

    return curriculums;
  }

  async getCurriculumById(schoolId, curriculumId) {
    const curriculum = await Curriculum.findOne({ _id: curriculumId, schoolId })
      .populate('subject')
      .populate('class')
      .populate('academicYear')
      .populate('createdBy', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName');

    if (!curriculum) {
      throw new AppError('Curriculum not found', 404);
    }

    return curriculum;
  }

  async updateCurriculum(schoolId, curriculumId, data, userId) {
    const curriculum = await Curriculum.findOne({ _id: curriculumId, schoolId });
    if (!curriculum) {
      throw new AppError('Curriculum not found', 404);
    }

    Object.assign(curriculum, data);
    await curriculum.save();

    logger.info('Curriculum updated', { schoolId, curriculumId });
    return curriculum;
  }

  async approveCurriculum(schoolId, curriculumId, userId) {
    const curriculum = await Curriculum.findOne({ _id: curriculumId, schoolId });
    if (!curriculum) {
      throw new AppError('Curriculum not found', 404);
    }

    curriculum.status = 'APPROVED';
    curriculum.approvedBy = userId;
    await curriculum.save();

    logger.info('Curriculum approved', { schoolId, curriculumId, approvedBy: userId });
    return curriculum;
  }

  async activateCurriculum(schoolId, curriculumId, userId) {
    const curriculum = await Curriculum.findOne({ _id: curriculumId, schoolId });
    if (!curriculum) {
      throw new AppError('Curriculum not found', 404);
    }

    if (curriculum.status !== 'APPROVED') {
      throw new ValidationError('Only approved curriculums can be activated');
    }

    curriculum.status = 'ACTIVE';
    await curriculum.save();

    logger.info('Curriculum activated', { schoolId, curriculumId });
    return curriculum;
  }

  // ============================================================
  // TEACHER SUBJECT ASSIGNMENT
  // ============================================================

  async assignTeacherToSubject(schoolId, data, userId) {
    const existing = await TeacherSubject.findOne({
      schoolId,
      teacher: data.teacher,
      subject: data.subject,
      academicYear: data.academicYear,
    });

    if (existing) {
      throw new ValidationError('Teacher already assigned to this subject for this academic year');
    }

    const assignment = new TeacherSubject({
      ...data,
      schoolId,
      createdBy: userId,
    });

    await assignment.save();
    logger.info('Teacher assigned to subject', { schoolId, teacher: data.teacher, subject: data.subject });

    return assignment;
  }

  async getTeacherSubjectAssignments(schoolId, teacherId, academicYear) {
    const assignments = await TeacherSubject.find({
      schoolId,
      teacher: teacherId,
      academicYear,
    })
      .populate('subject')
      .populate('classes')
      .populate('academicYear');

    return assignments;
  }

  async removeTeacherFromSubject(schoolId, assignmentId, userId) {
    const assignment = await TeacherSubject.findOne({ _id: assignmentId, schoolId });
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    assignment.status = 'INACTIVE';
    await assignment.save();

    logger.info('Teacher removed from subject', { schoolId, assignmentId });
    return assignment;
  }
}

module.exports = new SubjectService();
