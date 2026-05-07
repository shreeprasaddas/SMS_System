/**
 * Class Service
 * Business logic for class management
 */

const Class = require('../models/academic/Class.model');
const ClassTeacher = require('../models/academic/ClassTeacher.model');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class ClassService {
  async createClass(schoolId, data, userId) {
    const existing = await Class.findOne({ schoolId, code: data.code });
    if (existing) {
      throw new ValidationError('Class with this code already exists');
    }

    const classDoc = new Class({
      ...data,
      schoolId,
      createdBy: userId,
    });

    await classDoc.save();
    logger.info('Class created', { schoolId, code: data.code });

    return classDoc;
  }

  async getClasses(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.academicYear) query.academicYear = filters.academicYear;
    if (filters.stream) query.stream = filters.stream;
    if (filters.status) query.status = filters.status;

    const classes = await Class.find(query)
      .populate('stream')
      .populate('academicYear')
      .populate('sections')
      .populate('classTeacher')
      .populate('subjects');

    return classes;
  }

  async getClassById(schoolId, classId) {
    const classDoc = await Class.findOne({ _id: classId, schoolId })
      .populate('stream')
      .populate('academicYear')
      .populate('sections')
      .populate('classTeacher')
      .populate('subjects');

    if (!classDoc) {
      throw new AppError('Class not found', 404);
    }

    return classDoc;
  }

  async updateClass(schoolId, classId, data, userId) {
    const classDoc = await Class.findOne({ _id: classId, schoolId });
    if (!classDoc) {
      throw new AppError('Class not found', 404);
    }

    Object.assign(classDoc, data);
    await classDoc.save();

    logger.info('Class updated', { schoolId, classId });
    return classDoc.populate('stream', 'academicYear', 'sections', 'classTeacher', 'subjects');
  }

  async assignSubjectToClass(schoolId, classId, subjectId) {
    const classDoc = await Class.findOne({ _id: classId, schoolId });
    if (!classDoc) {
      throw new AppError('Class not found', 404);
    }

    if (!classDoc.subjects.includes(subjectId)) {
      classDoc.subjects.push(subjectId);
      await classDoc.save();
    }

    logger.info('Subject assigned to class', { schoolId, classId, subjectId });
    return classDoc;
  }

  async assignClassTeacher(schoolId, classId, teacherId, userId) {
    const classDoc = await Class.findOne({ _id: classId, schoolId });
    if (!classDoc) {
      throw new AppError('Class not found', 404);
    }

    classDoc.classTeacher = teacherId;
    await classDoc.save();

    // Create ClassTeacher record
    await ClassTeacher.create({
      schoolId,
      teacher: teacherId,
      class: classId,
      academicYear: classDoc.academicYear,
      isMainClassTeacher: true,
      role: 'CLASS_TEACHER',
      createdBy: userId,
    });

    logger.info('Class teacher assigned', { schoolId, classId, teacherId });
    return classDoc;
  }

  async addSectionToClass(schoolId, classId, sectionId) {
    const classDoc = await Class.findOne({ _id: classId, schoolId });
    if (!classDoc) {
      throw new AppError('Class not found', 404);
    }

    if (!classDoc.sections.includes(sectionId)) {
      classDoc.sections.push(sectionId);
      await classDoc.save();
    }

    logger.info('Section added to class', { schoolId, classId, sectionId });
    return classDoc;
  }

  async updateTotalStrength(schoolId, classId, strength) {
    const classDoc = await Class.findOne({ _id: classId, schoolId });
    if (!classDoc) {
      throw new AppError('Class not found', 404);
    }

    classDoc.totalStrength = strength;
    await classDoc.save();

    logger.info('Class strength updated', { schoolId, classId, strength });
    return classDoc;
  }
}

module.exports = new ClassService();
