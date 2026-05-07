/**
 * Academic Service
 * Business logic for academic foundation (years, streams, sections, subjects)
 */

const AcademicYear = require('../models/academic/AcademicYear.model');
const Stream = require('../models/academic/Stream.model');
const Section = require('../models/academic/Section.model');
const Subject = require('../models/academic/Subject.model');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class AcademicService {
  // ============================================================
  // ACADEMIC YEAR MANAGEMENT
  // ============================================================

  async createAcademicYear(schoolId, data, userId) {
    const existing = await AcademicYear.findOne({ schoolId, code: data.code });
    if (existing) {
      throw new ValidationError('Academic year with this code already exists');
    }

    const academicYear = new AcademicYear({
      ...data,
      schoolId,
      createdBy: userId,
    });

    await academicYear.save();
    logger.info('Academic year created', { schoolId, code: data.code });

    return academicYear;
  }

  async getAcademicYears(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.status) query.status = filters.status;

    const years = await AcademicYear.find(query).sort({ startDate: -1 });
    return years;
  }

  async getAcademicYearById(schoolId, yearId) {
    const year = await AcademicYear.findOne({ _id: yearId, schoolId });
    if (!year) {
      throw new AppError('Academic year not found', 404);
    }
    return year;
  }

  async updateAcademicYear(schoolId, yearId, data, userId) {
    const year = await AcademicYear.findOne({ _id: yearId, schoolId });
    if (!year) {
      throw new AppError('Academic year not found', 404);
    }

    Object.assign(year, data);
    year.updatedBy = userId;
    await year.save();

    logger.info('Academic year updated', { schoolId, yearId });
    return year;
  }

  async activateAcademicYear(schoolId, yearId, userId) {
    // Deactivate all other academic years
    await AcademicYear.updateMany(
      { schoolId, isActive: true },
      { isActive: false }
    );

    const year = await AcademicYear.findOne({ _id: yearId, schoolId });
    if (!year) {
      throw new AppError('Academic year not found', 404);
    }

    year.isActive = true;
    year.status = 'ACTIVE';
    year.updatedBy = userId;
    await year.save();

    logger.info('Academic year activated', { schoolId, yearId });
    return year;
  }

  // ============================================================
  // STREAM MANAGEMENT
  // ============================================================

  async createStream(schoolId, data, userId) {
    const existing = await Stream.findOne({ schoolId, name: data.name });
    if (existing) {
      throw new ValidationError('Stream already exists');
    }

    const stream = new Stream({
      ...data,
      schoolId,
      createdBy: userId,
    });

    await stream.save();
    logger.info('Stream created', { schoolId, name: data.name });

    return stream;
  }

  async getStreams(schoolId) {
    const streams = await Stream.find({ schoolId }).populate('subjects');
    return streams;
  }

  async getStreamById(schoolId, streamId) {
    const stream = await Stream.findOne({ _id: streamId, schoolId }).populate('subjects');
    if (!stream) {
      throw new AppError('Stream not found', 404);
    }
    return stream;
  }

  async updateStream(schoolId, streamId, data, userId) {
    const stream = await Stream.findOne({ _id: streamId, schoolId });
    if (!stream) {
      throw new AppError('Stream not found', 404);
    }

    Object.assign(stream, data);
    await stream.save();

    logger.info('Stream updated', { schoolId, streamId });
    return stream;
  }

  // ============================================================
  // SECTION MANAGEMENT
  // ============================================================

  async createSection(schoolId, data, userId) {
    const existing = await Section.findOne({ code: data.code });
    if (existing) {
      throw new ValidationError('Section code already exists');
    }

    const section = new Section({
      ...data,
      schoolId,
      createdBy: userId,
    });

    await section.save();
    logger.info('Section created', { schoolId, code: data.code });

    return section;
  }

  async getSections(schoolId) {
    const sections = await Section.find({ schoolId });
    return sections;
  }

  async getSectionById(schoolId, sectionId) {
    const section = await Section.findOne({ _id: sectionId, schoolId });
    if (!section) {
      throw new AppError('Section not found', 404);
    }
    return section;
  }

  async updateSection(schoolId, sectionId, data, userId) {
    const section = await Section.findOne({ _id: sectionId, schoolId });
    if (!section) {
      throw new AppError('Section not found', 404);
    }

    Object.assign(section, data);
    await section.save();

    logger.info('Section updated', { schoolId, sectionId });
    return section;
  }

  // ============================================================
  // SUBJECT MANAGEMENT
  // ============================================================

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
    if (filters.streamId) query.streams = filters.streamId;

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

  async assignSubjectToStream(schoolId, subjectId, streamId) {
    const subject = await Subject.findOne({ _id: subjectId, schoolId });
    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    if (!subject.streams.includes(streamId)) {
      subject.streams.push(streamId);
      await subject.save();
    }

    logger.info('Subject assigned to stream', { schoolId, subjectId, streamId });
    return subject;
  }
}

module.exports = new AcademicService();
