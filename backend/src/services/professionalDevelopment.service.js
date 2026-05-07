const ProfessionalDevelopmentProgram = require('../models/ProfessionalDevelopmentProgram.model');
const EmployeeTraining = require('../models/EmployeeTraining.model');
const StaffCertification = require('../models/StaffCertification.model');
const StaffSkillAssessment = require('../models/StaffSkillAssessment.model');
const TrainingProvider = require('../models/TrainingProvider.model');
const AppError = require('../utils/errorHandler');

class ProfessionalDevelopmentService {
  // 1. Create Professional Development Program
  async createProgram(data, schoolId) {
    const program = new ProfessionalDevelopmentProgram({
      ...data,
      schoolId,
    });
    return program.save();
  }

  // 2. Get All Programs
  async getPrograms(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.programType) query.programType = filters.programType;
    if (filters.programCategory) query.programCategory = filters.programCategory;
    if (filters.status) query.status = filters.status;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const programs = await ProfessionalDevelopmentProgram.find(query)
      .lean()
      .sort({ 'schedule.startDate': -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProfessionalDevelopmentProgram.countDocuments(query);
    return { programs, total, page, limit };
  }

  // 3. Get Program By ID
  async getProgramById(programId, schoolId) {
    const program = await ProfessionalDevelopmentProgram.findOne({
      _id: programId,
      schoolId,
    });
    if (!program) throw new AppError('Program not found', 404);
    return program;
  }

  // 4. Update Program
  async updateProgram(programId, schoolId, updateData) {
    const program = await ProfessionalDevelopmentProgram.findOneAndUpdate(
      { _id: programId, schoolId },
      {
        $set: updateData,
        $push: { auditLog: { action: 'UPDATE', timestamp: Date.now() } },
      },
      { new: true, runValidators: true }
    );
    if (!program) throw new AppError('Program not found', 404);
    return program;
  }

  // 5. Enroll Employee in Training
  async enrollEmployee(data, schoolId) {
    const enrollment = new EmployeeTraining({
      ...data,
      schoolId,
    });

    // Update program registered participants count
    await ProfessionalDevelopmentProgram.findByIdAndUpdate(data.programId, {
      $inc: { 'capacity.registeredParticipants': 1 },
    });

    return enrollment.save();
  }

  // 6. Get Employee Training History
  async getEmployeeTrainingHistory(employeeId, schoolId, filters = {}) {
    const query = { schoolId, employeeId };
    if (filters.enrollmentStatus) query.enrollmentStatus = filters.enrollmentStatus;
    if (filters.academicYear) query.academicYear = filters.academicYear;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const trainings = await EmployeeTraining.find(query)
      .lean()
      .sort({ enrollmentDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await EmployeeTraining.countDocuments(query);
    return { trainings, total, page, limit };
  }

  // 7. Update Employee Training Status
  async updateEmployeeTrainingStatus(trainingId, schoolId, statusData) {
    const training = await EmployeeTraining.findOneAndUpdate(
      { _id: trainingId, schoolId },
      {
        $set: statusData,
        $push: { auditLog: { action: 'STATUS_UPDATE', timestamp: Date.now() } },
      },
      { new: true, runValidators: true }
    );
    if (!training) throw new AppError('Training record not found', 404);
    return training;
  }

  // 8. Create Staff Certification Record
  async createCertification(data, schoolId) {
    const certification = new StaffCertification({
      ...data,
      schoolId,
    });
    return certification.save();
  }

  // 9. Get Staff Certifications
  async getStaffCertifications(employeeId, schoolId, filters = {}) {
    const query = { schoolId, employeeId };
    if (filters.certificationType) query.certificationType = filters.certificationType;
    if (filters.validityStatus) query.validityStatus = filters.validityStatus;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const certifications = await StaffCertification.find(query)
      .lean()
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StaffCertification.countDocuments(query);
    return { certifications, total, page, limit };
  }

  // 10. Get Expiring Certifications (Renewal Alert)
  async getExpiringCertifications(schoolId, daysThreshold = 90) {
    const futureDate = new Date(Date.now() + daysThreshold * 24 * 60 * 60 * 1000);
    const expiringCerts = await StaffCertification.find({
      schoolId,
      expiryDate: { $lte: futureDate, $gte: new Date() },
      validityStatus: { $ne: 'EXPIRED' },
    })
      .lean()
      .sort({ expiryDate: 1 });

    return expiringCerts;
  }

  // 11. Create Skill Assessment
  async createSkillAssessment(data, schoolId) {
    const assessment = new StaffSkillAssessment({
      ...data,
      schoolId,
    });
    return assessment.save();
  }

  // 12. Get Skill Assessments
  async getSkillAssessments(employeeId, schoolId, filters = {}) {
    const query = { schoolId, employeeId };
    if (filters.assessmentType) query.assessmentType = filters.assessmentType;
    if (filters.academicYear) query.academicYear = filters.academicYear;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const assessments = await StaffSkillAssessment.find(query)
      .lean()
      .sort({ assessmentDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StaffSkillAssessment.countDocuments(query);
    return { assessments, total, page, limit };
  }

  // 13. Create/Update Training Provider
  async createTrainingProvider(data, schoolId) {
    const provider = new TrainingProvider({
      ...data,
      schoolId,
    });
    return provider.save();
  }

  // 14. Get Training Providers
  async getTrainingProviders(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.providerType) query.providerType = filters.providerType;
    if (filters.status) query['partnershipStatus.status'] = filters.status;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const providers = await TrainingProvider.find(query)
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await TrainingProvider.countDocuments(query);
    return { providers, total, page, limit };
  }

  // 15. Get Professional Development Dashboard/Summary
  async getDevelopmentSummary(schoolId, academicYear) {
    try {
      const [programs, trainings, certifications, assessments, providers] = await Promise.all([
        ProfessionalDevelopmentProgram.countDocuments({
          schoolId,
          status: { $ne: 'CANCELLED' },
        }),
        EmployeeTraining.countDocuments({
          schoolId,
          enrollmentStatus: 'COMPLETED',
        }),
        StaffCertification.countDocuments({
          schoolId,
          validityStatus: 'ACTIVE',
        }),
        StaffSkillAssessment.countDocuments({
          schoolId,
          academicYear,
        }),
        TrainingProvider.countDocuments({
          schoolId,
          'partnershipStatus.status': 'ACTIVE',
        }),
      ]);

      const completedTrainings = await EmployeeTraining.aggregate([
        { $match: { schoolId, enrollmentStatus: 'COMPLETED' } },
        {
          $group: {
            _id: '$employeeId',
            trainingsCompleted: { $sum: 1 },
            averageScore: { $avg: '$performance.assessmentScore' },
          },
        },
      ]);

      const expiringCerts = await this.getExpiringCertifications(schoolId, 90);

      const skillGaps = await StaffSkillAssessment.find({
        schoolId,
        academicYear,
        skillGapSummary: 'CRITICAL_GAPS',
      })
        .lean()
        .select('employeeId employeeName skillGaps');

      return {
        totalPrograms: programs,
        completedTrainings: trainings,
        activeCertifications: certifications,
        assessmentsConducted: assessments,
        activeProviders: providers,
        employeeTrainingStats: completedTrainings,
        expiringCertificationsCount: expiringCerts.length,
        expiringCertifications: expiringCerts.slice(0, 5),
        employeesWithSkillGaps: skillGaps.length,
        generatedAt: new Date(),
      };
    } catch (error) {
      throw new AppError('Error generating development summary', 500);
    }
  }

  // Additional helper methods
  async getProgramParticipants(programId, schoolId) {
    const participants = await EmployeeTraining.find({
      programId,
      schoolId,
    })
      .lean()
      .select('employeeId employeeName enrollmentStatus performance.assessmentStatus');

    return participants;
  }

  async getStaffDevelopmentProfile(employeeId, schoolId) {
    const [trainings, certifications, assessments] = await Promise.all([
      EmployeeTraining.find({ employeeId, schoolId, enrollmentStatus: 'COMPLETED' })
        .lean()
        .sort({ enrollmentDate: -1 })
        .limit(5),
      StaffCertification.find({ employeeId, schoolId, validityStatus: 'ACTIVE' }).lean(),
      StaffSkillAssessment.find({ employeeId, schoolId })
        .lean()
        .sort({ assessmentDate: -1 })
        .limit(1),
    ]);

    return {
      employeeId,
      completedTrainings: trainings,
      activeCertifications: certifications,
      latestSkillAssessment: assessments[0],
      totalTrainingsCompleted: trainings.length,
      totalCertifications: certifications.length,
    };
  }

  async getUpcomingPrograms(schoolId, daysAhead = 30) {
    const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    const programs = await ProfessionalDevelopmentProgram.find({
      schoolId,
      'schedule.startDate': { $gte: new Date(), $lte: futureDate },
      status: { $in: ['SCHEDULED', 'PLANNING'] },
    })
      .lean()
      .sort({ 'schedule.startDate': 1 });

    return programs;
  }
}

module.exports = new ProfessionalDevelopmentService();
