const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const curriculumController = require('../controllers/curriculum.controller');

const router = express.Router();

// Curriculum Routes
router.post('/curriculums', authenticate, authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']), curriculumController.createCurriculum);
router.get('/curriculums', authenticate, curriculumController.getCurriculums);
router.get('/curriculums/:curriculumId', authenticate, curriculumController.getCurriculumById);
router.put('/curriculums/:curriculumId', authenticate, authorize(['ADMIN', 'PRINCIPAL']), curriculumController.updateCurriculum);
router.get('/curriculums/:curriculumId/summary', authenticate, curriculumController.getCurriculumSummary);

// Syllabus Routes
router.post('/syllabuses', authenticate, authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']), curriculumController.createSyllabus);
router.get('/syllabuses', authenticate, curriculumController.getSyllabus);
router.get('/syllabuses/:syllabusId', authenticate, curriculumController.getSyllabusById);
router.put('/syllabuses/:syllabusId', authenticate, authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']), curriculumController.updateSyllabus);
router.get('/classes/:classId/syllabuses', authenticate, curriculumController.getSyllabusForClass);
router.get('/syllabuses/:syllabusId/completion-status', authenticate, curriculumController.getCurriculumCompletionStatus);
router.post('/syllabuses/:syllabusId/validate', authenticate, curriculumController.validateSyllabusStructure);

// Chapter Mapping Routes
router.post('/chapter-mappings', authenticate, authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']), curriculumController.createChapterMapping);
router.get('/chapter-mappings', authenticate, curriculumController.getChapterMappings);
router.get('/chapter-mappings/:mappingId', authenticate, curriculumController.getChapterMappingById);
router.put('/chapter-mappings/:mappingId', authenticate, authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']), curriculumController.updateChapterMapping);
router.get('/subjects/:subjectId/classes/:classId/chapters', authenticate, curriculumController.getChaptersBySubject);

// Learning Outcome Routes
router.post('/learning-outcomes', authenticate, authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']), curriculumController.createLearningOutcome);
router.get('/learning-outcomes', authenticate, curriculumController.getLearningOutcomes);
router.get('/learning-outcomes/bloom/:bloomLevel/classes/:classId', authenticate, curriculumController.getOutcomesByBloomLevel);

// Assessment Framework Routes
router.post('/assessment-frameworks', authenticate, authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']), curriculumController.createAssessmentFramework);
router.get('/classes/:classId/assessment-frameworks', authenticate, curriculumController.getAssessmentFrameworksByClass);

// Class Curriculum Mapping
router.get('/classes/:classId/curriculum-mapping', authenticate, curriculumController.getClassCurriculumMapping);

module.exports = router;
