const curriculumService = require('../services/curriculum.service');
const {
  createCurriculumSchema,
  getCurriculumsSchema,
  createSyllabusSchema,
  getSyllabusSchema,
  createChapterMappingSchema,
  getChapterMappingsSchema,
  createLearningOutcomeSchema,
  getLearningOutcomesSchema,
  createAssessmentFrameworkSchema,
} = require('../validations/curriculum.validation');
const ResponseHelper = require('../utils/responseHelper');

const curriculumController = {
  // Curriculum Handlers
  createCurriculum: async (req, res, next) => {
    try {
      await createCurriculumSchema.validateAsync(req.body);
      const curriculum = await curriculumService.createCurriculum(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Curriculum created successfully', curriculum);
    } catch (error) {
      next(error);
    }
  },

  getCurriculums: async (req, res, next) => {
    try {
      await getCurriculumsSchema.validateAsync(req.query);
      const result = await curriculumService.getCurriculums(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Curriculums retrieved', result.curriculums, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getCurriculumById: async (req, res, next) => {
    try {
      const curriculum = await curriculumService.getCurriculumById(req.params.curriculumId, req.user.schoolId);
      ResponseHelper.success(res, 'Curriculum retrieved', curriculum);
    } catch (error) {
      next(error);
    }
  },

  updateCurriculum: async (req, res, next) => {
    try {
      const curriculum = await curriculumService.updateCurriculum(
        req.params.curriculumId,
        req.user.schoolId,
        req.body
      );
      ResponseHelper.success(res, 'Curriculum updated', curriculum);
    } catch (error) {
      next(error);
    }
  },

  getCurriculumSummary: async (req, res, next) => {
    try {
      const summary = await curriculumService.getCurriculumSummary(req.params.curriculumId, req.user.schoolId);
      ResponseHelper.success(res, 'Curriculum summary retrieved', summary);
    } catch (error) {
      next(error);
    }
  },

  // Syllabus Handlers
  createSyllabus: async (req, res, next) => {
    try {
      await createSyllabusSchema.validateAsync(req.body);
      const syllabus = await curriculumService.createSyllabus(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Syllabus created successfully', syllabus);
    } catch (error) {
      next(error);
    }
  },

  getSyllabus: async (req, res, next) => {
    try {
      await getSyllabusSchema.validateAsync(req.query);
      const result = await curriculumService.getSyllabus(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Syllabus retrieved', result.syllabus, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getSyllabusById: async (req, res, next) => {
    try {
      const syllabus = await curriculumService.getSyllabusById(req.params.syllabusId, req.user.schoolId);
      ResponseHelper.success(res, 'Syllabus retrieved', syllabus);
    } catch (error) {
      next(error);
    }
  },

  updateSyllabus: async (req, res, next) => {
    try {
      const syllabus = await curriculumService.updateSyllabus(req.params.syllabusId, req.user.schoolId, req.body);
      ResponseHelper.success(res, 'Syllabus updated', syllabus);
    } catch (error) {
      next(error);
    }
  },

  getSyllabusForClass: async (req, res, next) => {
    try {
      const syllabus = await curriculumService.getSyllabusForClass(
        req.params.classId,
        req.user.schoolId,
        req.query.academicYear
      );
      ResponseHelper.success(res, 'Class syllabus retrieved', syllabus);
    } catch (error) {
      next(error);
    }
  },

  getCurriculumCompletionStatus: async (req, res, next) => {
    try {
      const status = await curriculumService.getCurriculumCompletionStatus(
        req.params.syllabusId,
        req.user.schoolId
      );
      ResponseHelper.success(res, 'Curriculum completion status', status);
    } catch (error) {
      next(error);
    }
  },

  // Chapter Mapping Handlers
  createChapterMapping: async (req, res, next) => {
    try {
      await createChapterMappingSchema.validateAsync(req.body);
      const mapping = await curriculumService.createChapterMapping(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Chapter mapping created', mapping);
    } catch (error) {
      next(error);
    }
  },

  getChapterMappings: async (req, res, next) => {
    try {
      await getChapterMappingsSchema.validateAsync(req.query);
      const result = await curriculumService.getChapterMappings(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Chapter mappings retrieved', result.mappings, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getChapterMappingById: async (req, res, next) => {
    try {
      const mapping = await curriculumService.getChapterMappingById(req.params.mappingId, req.user.schoolId);
      ResponseHelper.success(res, 'Chapter mapping retrieved', mapping);
    } catch (error) {
      next(error);
    }
  },

  updateChapterMapping: async (req, res, next) => {
    try {
      const mapping = await curriculumService.updateChapterMapping(
        req.params.mappingId,
        req.user.schoolId,
        req.body
      );
      ResponseHelper.success(res, 'Chapter mapping updated', mapping);
    } catch (error) {
      next(error);
    }
  },

  getChaptersBySubject: async (req, res, next) => {
    try {
      const chapters = await curriculumService.getChaptersBySubject(
        req.params.subjectId,
        req.params.classId,
        req.user.schoolId
      );
      ResponseHelper.success(res, 'Chapters retrieved', chapters);
    } catch (error) {
      next(error);
    }
  },

  // Learning Outcome Handlers
  createLearningOutcome: async (req, res, next) => {
    try {
      await createLearningOutcomeSchema.validateAsync(req.body);
      const outcome = await curriculumService.createLearningOutcome(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Learning outcome created', outcome);
    } catch (error) {
      next(error);
    }
  },

  getLearningOutcomes: async (req, res, next) => {
    try {
      await getLearningOutcomesSchema.validateAsync(req.query);
      const result = await curriculumService.getLearningOutcomes(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Learning outcomes retrieved', result.outcomes, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getOutcomesByBloomLevel: async (req, res, next) => {
    try {
      const outcomes = await curriculumService.getOutcomesByBloomLevel(
        req.user.schoolId,
        req.params.classId,
        req.query.bloomLevel
      );
      ResponseHelper.success(res, 'Outcomes by Bloom level retrieved', outcomes);
    } catch (error) {
      next(error);
    }
  },

  // Assessment Framework Handlers
  createAssessmentFramework: async (req, res, next) => {
    try {
      await createAssessmentFrameworkSchema.validateAsync(req.body);
      const framework = await curriculumService.createAssessmentFramework(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Assessment framework created', framework);
    } catch (error) {
      next(error);
    }
  },

  getAssessmentFrameworksByClass: async (req, res, next) => {
    try {
      const frameworks = await curriculumService.getAssessmentFrameworksByClass(
        req.params.classId,
        req.user.schoolId,
        req.query.academicYear
      );
      ResponseHelper.success(res, 'Assessment frameworks retrieved', frameworks);
    } catch (error) {
      next(error);
    }
  },

  validateSyllabusStructure: async (req, res, next) => {
    try {
      const validation = await curriculumService.validateSyllabusStructure(
        req.params.syllabusId,
        req.user.schoolId
      );
      ResponseHelper.success(res, 'Syllabus validation result', validation);
    } catch (error) {
      next(error);
    }
  },

  getClassCurriculumMapping: async (req, res, next) => {
    try {
      const mapping = await curriculumService.getClassCurriculumMapping(
        req.params.classId,
        req.user.schoolId,
        req.query.academicYear
      );
      ResponseHelper.success(res, 'Class curriculum mapping retrieved', mapping);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = curriculumController;
