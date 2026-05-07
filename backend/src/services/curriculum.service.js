const Curriculum = require('../models/Curriculum.model');
const Syllabus = require('../models/Syllabus.model');
const ChapterMapping = require('../models/ChapterMapping.model');
const LearningOutcome = require('../models/LearningOutcome.model');
const AssessmentFramework = require('../models/AssessmentFramework.model');
const AppError = require('../utils/errorHandler');

class CurriculumService {
  // 1. Create Curriculum
  async createCurriculum(data, schoolId) {
    const curriculum = new Curriculum({
      ...data,
      schoolId,
    });
    return curriculum.save();
  }

  // 2. Get Curriculums
  async getCurriculums(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.curriculumType) query.curriculumType = filters.curriculumType;
    if (filters.status) query.developmentStatus = filters.status;
    if (filters.academicYear) query.academicYear = filters.academicYear;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const curriculums = await Curriculum.find(query)
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Curriculum.countDocuments(query);
    return { curriculums, total, page, limit };
  }

  // 3. Get Curriculum By ID
  async getCurriculumById(curriculumId, schoolId) {
    const curriculum = await Curriculum.findOne({
      _id: curriculumId,
      schoolId,
    });
    if (!curriculum) throw new AppError('Curriculum not found', 404);
    return curriculum;
  }

  // 4. Update Curriculum
  async updateCurriculum(curriculumId, schoolId, updateData) {
    const curriculum = await Curriculum.findOneAndUpdate(
      { _id: curriculumId, schoolId },
      {
        $set: updateData,
        $push: { auditLog: { action: 'UPDATE', timestamp: Date.now() } },
      },
      { new: true, runValidators: true }
    );
    if (!curriculum) throw new AppError('Curriculum not found', 404);
    return curriculum;
  }

  // 5. Create Syllabus
  async createSyllabus(data, schoolId) {
    const syllabus = new Syllabus({
      ...data,
      schoolId,
    });
    return syllabus.save();
  }

  // 6. Get Syllabus
  async getSyllabus(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.curriculumId) query.curriculumId = filters.curriculumId;
    if (filters.subjectId) query.subjectId = filters.subjectId;
    if (filters.classId) query.classId = filters.classId;
    if (filters.academicYear) query.academicYear = filters.academicYear;
    if (filters.status) query.status = filters.status;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const syllabus = await Syllabus.find(query)
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Syllabus.countDocuments(query);
    return { syllabus, total, page, limit };
  }

  // 7. Get Syllabus By ID
  async getSyllabusById(syllabusId, schoolId) {
    const syllabus = await Syllabus.findOne({
      _id: syllabusId,
      schoolId,
    });
    if (!syllabus) throw new AppError('Syllabus not found', 404);
    return syllabus;
  }

  // 8. Update Syllabus
  async updateSyllabus(syllabusId, schoolId, updateData) {
    const syllabus = await Syllabus.findOneAndUpdate(
      { _id: syllabusId, schoolId },
      {
        $set: updateData,
        $push: { auditLog: { action: 'UPDATE', timestamp: Date.now() } },
      },
      { new: true, runValidators: true }
    );
    if (!syllabus) throw new AppError('Syllabus not found', 404);
    return syllabus;
  }

  // 9. Create Chapter Mapping
  async createChapterMapping(data, schoolId) {
    const mapping = new ChapterMapping({
      ...data,
      schoolId,
    });
    return mapping.save();
  }

  // 10. Get Chapter Mappings
  async getChapterMappings(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.syllabusId) query.syllabusId = filters.syllabusId;
    if (filters.subjectId) query.subjectId = filters.subjectId;
    if (filters.classId) query.classId = filters.classId;
    if (filters.status) query.status = filters.status;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const mappings = await ChapterMapping.find(query)
      .lean()
      .sort({ chapterNumber: 1 })
      .skip(skip)
      .limit(limit);

    const total = await ChapterMapping.countDocuments(query);
    return { mappings, total, page, limit };
  }

  // 11. Get Chapter Mapping By ID
  async getChapterMappingById(mappingId, schoolId) {
    const mapping = await ChapterMapping.findOne({
      _id: mappingId,
      schoolId,
    });
    if (!mapping) throw new AppError('Chapter mapping not found', 404);
    return mapping;
  }

  // 12. Update Chapter Mapping
  async updateChapterMapping(mappingId, schoolId, updateData) {
    const mapping = await ChapterMapping.findOneAndUpdate(
      { _id: mappingId, schoolId },
      {
        $set: updateData,
        $push: { auditLog: { action: 'UPDATE', timestamp: Date.now() } },
      },
      { new: true, runValidators: true }
    );
    if (!mapping) throw new AppError('Chapter mapping not found', 404);
    return mapping;
  }

  // 13. Create Learning Outcome
  async createLearningOutcome(data, schoolId) {
    const outcome = new LearningOutcome({
      ...data,
      schoolId,
    });
    return outcome.save();
  }

  // 14. Get Learning Outcomes
  async getLearningOutcomes(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.subjectId) query.subjectId = filters.subjectId;
    if (filters.classId) query.classId = filters.classId;
    if (filters.bloomLevel) query.bloomLevel = filters.bloomLevel;
    if (filters.outcomeType) query.outcomeType = filters.outcomeType;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const outcomes = await LearningOutcome.find(query)
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LearningOutcome.countDocuments(query);
    return { outcomes, total, page, limit };
  }

  // 15. Create Assessment Framework
  async createAssessmentFramework(data, schoolId) {
    const framework = new AssessmentFramework({
      ...data,
      schoolId,
    });
    return framework.save();
  }

  // Additional helper methods
  async getSyllabusForClass(classId, schoolId, academicYear) {
    const syllabus = await Syllabus.find({
      schoolId,
      classId,
      academicYear,
    })
      .lean()
      .sort({ createdAt: -1 });
    return syllabus;
  }

  async getChaptersBySubject(subjectId, classId, schoolId) {
    const chapters = await ChapterMapping.find({
      schoolId,
      subjectId,
      classId,
    })
      .lean()
      .sort({ chapterNumber: 1 });
    return chapters;
  }

  async getCurriculumCompletionStatus(syllabusId, schoolId) {
    const syllabus = await Syllabus.findOne({ _id: syllabusId, schoolId }).lean();
    if (!syllabus) throw new AppError('Syllabus not found', 404);

    const chapters = await ChapterMapping.find({ syllabusId, schoolId }).lean();
    const completed = chapters.filter((c) => c.status === 'COMPLETED').length;
    const total = chapters.length;

    return {
      syllabusId,
      totalChapters: total,
      completedChapters: completed,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      status: syllabus.status,
    };
  }

  async getCurriculumSummary(curriculumId, schoolId) {
    try {
      const [curriculum, syllabus, assessmentFramework] = await Promise.all([
        Curriculum.findOne({ _id: curriculumId, schoolId }).lean(),
        Syllabus.countDocuments({ curriculumId, schoolId }),
        AssessmentFramework.countDocuments({ curriculumId, schoolId }),
      ]);

      if (!curriculum) throw new AppError('Curriculum not found', 404);

      return {
        curriculum,
        syllabusCount: syllabus,
        assessmentFrameworkCount: assessmentFramework,
        generatedAt: new Date(),
      };
    } catch (error) {
      throw new AppError('Error generating curriculum summary', 500);
    }
  }

  async getClassCurriculumMapping(classId, schoolId, academicYear) {
    const syllabuses = await Syllabus.find({
      classId,
      schoolId,
      academicYear,
    })
      .lean()
      .select('subjectName status implementationPeriod');

    const subjects = syllabuses.map((s) => ({
      subject: s.subjectName,
      status: s.status,
      startDate: s.implementationPeriod?.startDate,
      endDate: s.implementationPeriod?.endDate,
    }));

    return {
      classId,
      academicYear,
      subjects,
      totalSubjects: subjects.length,
    };
  }

  async getOutcomesByBloomLevel(schoolId, classId, bloomLevel) {
    const outcomes = await LearningOutcome.find({
      schoolId,
      classId,
      bloomLevel,
    })
      .lean()
      .sort({ createdAt: -1 });

    return outcomes;
  }

  async getAssessmentFrameworksByClass(classId, schoolId, academicYear) {
    const frameworks = await AssessmentFramework.find({
      schoolId,
      academicYear,
      applicableClasses: { $elemMatch: { classId } },
    }).lean();

    return frameworks;
  }

  async validateSyllabusStructure(syllabusId, schoolId) {
    const syllabus = await Syllabus.findOne({ _id: syllabusId, schoolId }).lean();
    if (!syllabus) throw new AppError('Syllabus not found', 404);

    const issues = [];

    // Validate total hours
    if (syllabus.syllabusStructure) {
      let totalHours = 0;
      syllabus.syllabusStructure.forEach((unit) => {
        if (unit.chapters) {
          unit.chapters.forEach((chapter) => {
            if (chapter.topics) {
              chapter.topics.forEach((topic) => {
                totalHours += topic.estimatedHours || 0;
              });
            }
          });
        }
      });

      if (totalHours === 0) {
        issues.push('No estimated hours allocated');
      }
    }

    // Validate learning outcomes mapping
    const outcomes = await LearningOutcome.countDocuments({ syllabusId, schoolId });
    if (outcomes === 0) {
      issues.push('No learning outcomes mapped');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}

module.exports = new CurriculumService();
