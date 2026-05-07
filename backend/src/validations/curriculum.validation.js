const Joi = require('joi');

const createCurriculumSchema = Joi.object({
  curriculumName: Joi.string().min(5).max(200).required(),
  curriculumType: Joi.string()
    .valid('NATIONAL', 'STATE', 'INTERNATIONAL', 'CBSE', 'ICSE', 'IB', 'CUSTOM')
    .required(),
  description: Joi.string().optional(),
  academicYear: Joi.string().required(),
  applicableClasses: Joi.array().items(Joi.object({
    classId: Joi.string().length(24).hex(),
    className: Joi.string(),
  })),
  subjectsIncluded: Joi.array().items(Joi.object({
    subjectId: Joi.string().length(24).hex(),
    subjectName: Joi.string(),
  })),
  overallObjectives: Joi.array().items(Joi.string()).optional(),
});

const getCurriculumsSchema = Joi.object({
  curriculumType: Joi.string().valid('NATIONAL', 'STATE', 'INTERNATIONAL', 'CBSE', 'ICSE', 'IB', 'CUSTOM'),
  status: Joi.string().valid('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED', 'REVISED', 'ARCHIVED'),
  academicYear: Joi.string(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createSyllabusSchema = Joi.object({
  curriculumId: Joi.string().length(24).hex().required(),
  subjectId: Joi.string().length(24).hex().required(),
  classId: Joi.string().length(24).hex().required(),
  academicYear: Joi.string().required(),
  syllabusTitle: Joi.string().min(5).required(),
  description: Joi.string().optional(),
  learningObjectives: Joi.array().items(Joi.object({
    objective: Joi.string(),
    bloomLevel: Joi.string().valid('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE'),
  })),
  syllabusStructure: Joi.array().items(Joi.object().unknown(true)).optional(),
});

const getSyllabusSchema = Joi.object({
  curriculumId: Joi.string().length(24).hex(),
  subjectId: Joi.string().length(24).hex(),
  classId: Joi.string().length(24).hex(),
  academicYear: Joi.string(),
  status: Joi.string().valid('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED', 'REVISED', 'ARCHIVED'),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createChapterMappingSchema = Joi.object({
  syllabusId: Joi.string().length(24).hex().required(),
  subjectId: Joi.string().length(24).hex().required(),
  classId: Joi.string().length(24).hex().required(),
  academicYear: Joi.string().required(),
  chapterNumber: Joi.number().required(),
  chapterName: Joi.string().required(),
  topics: Joi.array().items(Joi.object({
    topicName: Joi.string().required(),
    duration: Joi.object({
      hours: Joi.number(),
    }),
  })).optional(),
});

const getChapterMappingsSchema = Joi.object({
  syllabusId: Joi.string().length(24).hex(),
  subjectId: Joi.string().length(24).hex(),
  classId: Joi.string().length(24).hex(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REVISED'),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createLearningOutcomeSchema = Joi.object({
  curriculumId: Joi.string().length(24).hex().required(),
  subjectId: Joi.string().length(24).hex().required(),
  classId: Joi.string().length(24).hex().required(),
  academicYear: Joi.string().required(),
  outcomeStatement: Joi.string().required(),
  bloomLevel: Joi.string()
    .valid('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE')
    .required(),
  outcomeType: Joi.string().valid('KNOWLEDGE', 'SKILL', 'ATTITUDE', 'COMPETENCY'),
  domain: Joi.string().valid('COGNITIVE', 'AFFECTIVE', 'PSYCHOMOTOR'),
  assessmentMethods: Joi.array().items(Joi.object({
    method: Joi.string().valid('QUIZ', 'ASSIGNMENT', 'PROJECT', 'PRESENTATION', 'PRACTICAL', 'OBSERVATION', 'PORTFOLIO'),
  })).optional(),
});

const getLearningOutcomesSchema = Joi.object({
  subjectId: Joi.string().length(24).hex(),
  classId: Joi.string().length(24).hex(),
  bloomLevel: Joi.string().valid('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE'),
  outcomeType: Joi.string().valid('KNOWLEDGE', 'SKILL', 'ATTITUDE', 'COMPETENCY'),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createAssessmentFrameworkSchema = Joi.object({
  curriculumId: Joi.string().length(24).hex().required(),
  frameworkName: Joi.string().required(),
  academicYear: Joi.string().required(),
  assessmentType: Joi.string()
    .valid('FORMATIVE', 'SUMMATIVE', 'DIAGNOSTIC', 'BENCHMARK', 'PORTFOLIO')
    .required(),
  totalMarks: Joi.number().required(),
  passingMarks: Joi.number().required(),
  assessmentComponents: Joi.array().items(Joi.object({
    componentName: Joi.string(),
    assessmentMethod: Joi.string(),
    maxMarks: Joi.number(),
    weightage: Joi.number().min(0).max(100),
  })).optional(),
});

module.exports = {
  createCurriculumSchema,
  getCurriculumsSchema,
  createSyllabusSchema,
  getSyllabusSchema,
  createChapterMappingSchema,
  getChapterMappingsSchema,
  createLearningOutcomeSchema,
  getLearningOutcomesSchema,
  createAssessmentFrameworkSchema,
};
