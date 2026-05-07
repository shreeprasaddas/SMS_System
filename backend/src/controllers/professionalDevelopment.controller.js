const professionalDevelopmentService = require('../services/professionalDevelopment.service');
const {
  createProgramSchema,
  getProgramsSchema,
  enrollEmployeeSchema,
  getEmployeeTrainingSchema,
  updateTrainingStatusSchema,
  createCertificationSchema,
  getStaffCertificationsSchema,
  createSkillAssessmentSchema,
  getSkillAssessmentsSchema,
  createProviderSchema,
  getProvidersSchema,
} = require('../validations/professionalDevelopment.validation');
const ResponseHelper = require('../utils/responseHelper');

const professionalDevelopmentController = {
  // Program Management Handlers
  createProgram: async (req, res, next) => {
    try {
      await createProgramSchema.validateAsync(req.body);
      const program = await professionalDevelopmentService.createProgram(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Program created successfully', program);
    } catch (error) {
      next(error);
    }
  },

  getPrograms: async (req, res, next) => {
    try {
      await getProgramsSchema.validateAsync(req.query);
      const result = await professionalDevelopmentService.getPrograms(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Programs retrieved', result.programs, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getProgramById: async (req, res, next) => {
    try {
      const program = await professionalDevelopmentService.getProgramById(req.params.programId, req.user.schoolId);
      ResponseHelper.success(res, 'Program retrieved', program);
    } catch (error) {
      next(error);
    }
  },

  updateProgram: async (req, res, next) => {
    try {
      const program = await professionalDevelopmentService.updateProgram(
        req.params.programId,
        req.user.schoolId,
        req.body
      );
      ResponseHelper.success(res, 'Program updated', program);
    } catch (error) {
      next(error);
    }
  },

  getProgramParticipants: async (req, res, next) => {
    try {
      const participants = await professionalDevelopmentService.getProgramParticipants(
        req.params.programId,
        req.user.schoolId
      );
      ResponseHelper.success(res, 'Program participants retrieved', participants);
    } catch (error) {
      next(error);
    }
  },

  getUpcomingPrograms: async (req, res, next) => {
    try {
      const days = req.query.daysAhead || 30;
      const programs = await professionalDevelopmentService.getUpcomingPrograms(req.user.schoolId, days);
      ResponseHelper.success(res, 'Upcoming programs retrieved', programs);
    } catch (error) {
      next(error);
    }
  },

  // Employee Training Handlers
  enrollEmployee: async (req, res, next) => {
    try {
      await enrollEmployeeSchema.validateAsync(req.body);
      const enrollment = await professionalDevelopmentService.enrollEmployee(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Employee enrolled successfully', enrollment);
    } catch (error) {
      next(error);
    }
  },

  getEmployeeTrainingHistory: async (req, res, next) => {
    try {
      await getEmployeeTrainingSchema.validateAsync(req.query);
      const result = await professionalDevelopmentService.getEmployeeTrainingHistory(
        req.params.employeeId || req.user._id,
        req.user.schoolId,
        req.query
      );
      ResponseHelper.paginated(res, 'Training history retrieved', result.trainings, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  updateTrainingStatus: async (req, res, next) => {
    try {
      await updateTrainingStatusSchema.validateAsync(req.body);
      const training = await professionalDevelopmentService.updateEmployeeTrainingStatus(
        req.params.trainingId,
        req.user.schoolId,
        req.body
      );
      ResponseHelper.success(res, 'Training status updated', training);
    } catch (error) {
      next(error);
    }
  },

  getStaffDevelopmentProfile: async (req, res, next) => {
    try {
      const profile = await professionalDevelopmentService.getStaffDevelopmentProfile(
        req.params.employeeId || req.user._id,
        req.user.schoolId
      );
      ResponseHelper.success(res, 'Development profile retrieved', profile);
    } catch (error) {
      next(error);
    }
  },

  // Certification Handlers
  createCertification: async (req, res, next) => {
    try {
      await createCertificationSchema.validateAsync(req.body);
      const certification = await professionalDevelopmentService.createCertification(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Certification recorded', certification);
    } catch (error) {
      next(error);
    }
  },

  getStaffCertifications: async (req, res, next) => {
    try {
      await getStaffCertificationsSchema.validateAsync(req.query);
      const result = await professionalDevelopmentService.getStaffCertifications(
        req.params.employeeId || req.user._id,
        req.user.schoolId,
        req.query
      );
      ResponseHelper.paginated(res, 'Certifications retrieved', result.certifications, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getExpiringCertifications: async (req, res, next) => {
    try {
      const daysThreshold = req.query.daysThreshold || 90;
      const expiringCerts = await professionalDevelopmentService.getExpiringCertifications(
        req.user.schoolId,
        daysThreshold
      );
      ResponseHelper.success(res, 'Expiring certifications retrieved', expiringCerts);
    } catch (error) {
      next(error);
    }
  },

  // Skill Assessment Handlers
  createSkillAssessment: async (req, res, next) => {
    try {
      await createSkillAssessmentSchema.validateAsync(req.body);
      const assessment = await professionalDevelopmentService.createSkillAssessment(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Skill assessment created', assessment);
    } catch (error) {
      next(error);
    }
  },

  getSkillAssessments: async (req, res, next) => {
    try {
      await getSkillAssessmentsSchema.validateAsync(req.query);
      const result = await professionalDevelopmentService.getSkillAssessments(
        req.params.employeeId || req.user._id,
        req.user.schoolId,
        req.query
      );
      ResponseHelper.paginated(res, 'Skill assessments retrieved', result.assessments, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  // Training Provider Handlers
  createTrainingProvider: async (req, res, next) => {
    try {
      await createProviderSchema.validateAsync(req.body);
      const provider = await professionalDevelopmentService.createTrainingProvider(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Training provider created', provider);
    } catch (error) {
      next(error);
    }
  },

  getTrainingProviders: async (req, res, next) => {
    try {
      await getProvidersSchema.validateAsync(req.query);
      const result = await professionalDevelopmentService.getTrainingProviders(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Training providers retrieved', result.providers, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  // Dashboard & Summary Handlers
  getDevelopmentSummary: async (req, res, next) => {
    try {
      const summary = await professionalDevelopmentService.getDevelopmentSummary(
        req.user.schoolId,
        req.query.academicYear
      );
      ResponseHelper.success(res, 'Development summary retrieved', summary);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = professionalDevelopmentController;
