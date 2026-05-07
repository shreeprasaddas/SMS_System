const HRStaff = require('../models/hr/HRStaff.model');
const SalaryStructure = require('../models/hr/SalaryStructure.model');
const Payroll = require('../models/hr/Payroll.model');
const StaffAttendance = require('../models/hr/StaffAttendance.model');
const PerformanceAppraisal = require('../models/hr/PerformanceAppraisal.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Register new staff member
 * @param {object} data - Staff details
 * @param {string} schoolId - School ID
 * @returns {Promise<object>} Created staff
 */
exports.registerStaff = async (data, schoolId) => {
  const staff = await HRStaff.create({
    ...data,
    schoolId
  });
  return staff;
};

/**
 * Get all staff members
 * @param {string} schoolId
 * @param {object} filters - { status, designation, department, page, limit }
 * @returns {Promise<object>} { staff, total, pagination }
 */
exports.getAllStaff = async (schoolId, filters = {}) => {
  const { status, designation, department, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (status) query.status = status;
  if (designation) query.designation = designation;
  if (department) query.department = department;

  const skip = (page - 1) * limit;
  const [staff, total] = await Promise.all([
    HRStaff.find(query)
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    HRStaff.countDocuments(query)
  ]);

  return { staff, total, page: Number(page), limit: Number(limit) };
};

/**
 * Get staff by ID
 * @param {string} staffId
 * @param {string} schoolId
 * @returns {Promise<object>} Staff details
 */
exports.getStaffById = async (staffId, schoolId) => {
  const staff = await HRStaff.findOne({ _id: staffId, schoolId })
    .populate('userId', 'firstName lastName email')
    .populate('salaryStructureId', 'name designation')
    .lean();
  if (!staff) throw new AppError('Staff member not found', 404);
  return staff;
};

/**
 * Update staff details
 * @param {string} staffId
 * @param {object} data
 * @param {string} schoolId
 * @returns {Promise<object>} Updated staff
 */
exports.updateStaff = async (staffId, data, schoolId) => {
  const staff = await HRStaff.findOneAndUpdate(
    { _id: staffId, schoolId },
    { 
      ...data,
      $push: { 
        auditLog: { 
          action: 'UPDATE', 
          performedBy: data.performedBy,
          changes: data
        }
      }
    },
    { new: true, runValidators: true }
  );
  if (!staff) throw new AppError('Staff member not found', 404);
  return staff;
};

/**
 * Create salary structure
 * @param {object} data - Salary structure details
 * @param {string} schoolId
 * @returns {Promise<object>} Created salary structure
 */
exports.createSalaryStructure = async (data, schoolId) => {
  const structure = await SalaryStructure.create({
    ...data,
    schoolId
  });
  return structure;
};

/**
 * Get all salary structures
 * @param {string} schoolId
 * @param {object} filters - { status, designation, page, limit }
 * @returns {Promise<object>} { structures, total, pagination }
 */
exports.getAllSalaryStructures = async (schoolId, filters = {}) => {
  const { status, designation, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (status) query.status = status;
  if (designation) query.designation = designation;

  const skip = (page - 1) * limit;
  const [structures, total] = await Promise.all([
    SalaryStructure.find(query)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    SalaryStructure.countDocuments(query)
  ]);

  return { structures, total, page: Number(page), limit: Number(limit) };
};

/**
 * Process payroll for staff member
 * @param {string} staffId
 * @param {object} payrollData - Monthly payroll details
 * @param {string} schoolId
 * @returns {Promise<object>} Created payroll record
 */
exports.processPayroll = async (staffId, payrollData, schoolId) => {
  // Get staff details
  const staff = await HRStaff.findOne({ _id: staffId, schoolId });
  if (!staff) throw new AppError('Staff member not found', 404);

  // Calculate net salary if earnings/deductions provided
  let totalEarnings = 0;
  let totalDeductions = 0;

  if (payrollData.earnings) {
    totalEarnings = payrollData.earnings.reduce((sum, e) => sum + (e.amount || 0), 0);
  }
  if (payrollData.deductions) {
    totalDeductions = payrollData.deductions.reduce((sum, d) => sum + (d.amount || 0), 0);
  }

  const baseSalary = payrollData.baseSalary || staff.basicSalary || 0;
  const grossSalary = baseSalary + totalEarnings;
  const netSalary = grossSalary - totalDeductions;

  const payroll = await Payroll.create({
    staffId,
    staffName: staff.staffName,
    designation: staff.designation,
    ...payrollData,
    totalEarnings,
    totalDeductions,
    grossSalary,
    netSalary,
    baseSalary,
    schoolId
  });
  return payroll;
};

/**
 * Get payroll records
 * @param {string} schoolId
 * @param {object} filters - { staffId, paymentStatus, month, year, page, limit }
 * @returns {Promise<object>} { payrolls, total, pagination }
 */
exports.getPayrollRecords = async (schoolId, filters = {}) => {
  const { staffId, paymentStatus, payrollMonth, payrollYear, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (staffId) query.staffId = staffId;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (payrollMonth) query.payrollMonth = payrollMonth;
  if (payrollYear) query.payrollYear = payrollYear;

  const skip = (page - 1) * limit;
  const [payrolls, total] = await Promise.all([
    Payroll.find(query)
      .sort({ processDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Payroll.countDocuments(query)
  ]);

  return { payrolls, total, page: Number(page), limit: Number(limit) };
};

/**
 * Mark staff attendance
 * @param {string} staffId
 * @param {object} attendanceData - Attendance details
 * @param {string} schoolId
 * @returns {Promise<object>} Created attendance record
 */
exports.markAttendance = async (staffId, attendanceData, schoolId) => {
  const staff = await HRStaff.findOne({ _id: staffId, schoolId });
  if (!staff) throw new AppError('Staff member not found', 404);

  const attendance = await StaffAttendance.create({
    staffId,
    staffName: staff.staffName,
    designation: staff.designation,
    department: staff.department,
    ...attendanceData,
    schoolId
  });
  return attendance;
};

/**
 * Get attendance records
 * @param {string} schoolId
 * @param {object} filters - { staffId, startDate, endDate, status, page, limit }
 * @returns {Promise<object>} { records, total, pagination }
 */
exports.getAttendanceRecords = async (schoolId, filters = {}) => {
  const { staffId, startDate, endDate, attendanceStatus, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (staffId) query.staffId = staffId;
  if (attendanceStatus) query.attendanceStatus = attendanceStatus;

  if (startDate || endDate) {
    query.attendanceDate = {};
    if (startDate) query.attendanceDate.$gte = new Date(startDate);
    if (endDate) query.attendanceDate.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [records, total] = await Promise.all([
    StaffAttendance.find(query)
      .sort({ attendanceDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    StaffAttendance.countDocuments(query)
  ]);

  return { records, total, page: Number(page), limit: Number(limit) };
};

/**
 * Create performance appraisal
 * @param {string} staffId
 * @param {object} appraisalData - Appraisal details
 * @param {string} schoolId
 * @returns {Promise<object>} Created appraisal
 */
exports.createAppraisal = async (staffId, appraisalData, schoolId) => {
  const staff = await HRStaff.findOne({ _id: staffId, schoolId });
  if (!staff) throw new AppError('Staff member not found', 404);

  const appraisal = await PerformanceAppraisal.create({
    staffId,
    staffName: staff.staffName,
    designation: staff.designation,
    ...appraisalData,
    schoolId
  });
  return appraisal;
};

/**
 * Get appraisals
 * @param {string} schoolId
 * @param {object} filters - { staffId, status, year, page, limit }
 * @returns {Promise<object>} { appraisals, total, pagination }
 */
exports.getAppraisals = async (schoolId, filters = {}) => {
  const { staffId, status, appraisalYear, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (staffId) query.staffId = staffId;
  if (status) query.status = status;
  if (appraisalYear) query.appraisalYear = appraisalYear;

  const skip = (page - 1) * limit;
  const [appraisals, total] = await Promise.all([
    PerformanceAppraisal.find(query)
      .sort({ appraisalDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    PerformanceAppraisal.countDocuments(query)
  ]);

  return { appraisals, total, page: Number(page), limit: Number(limit) };
};

/**
 * Approve payroll
 * @param {string} payrollId
 * @param {string} schoolId
 * @param {object} approvalData - Approval details
 * @returns {Promise<object>} Updated payroll
 */
exports.approvePayroll = async (payrollId, schoolId, approvalData) => {
  const payroll = await Payroll.findOneAndUpdate(
    { _id: payrollId, schoolId },
    {
      approvalStatus: 'APPROVED',
      approvedBy: approvalData.approvedBy,
      approvalDate: new Date(),
      $push: {
        auditLog: {
          action: 'APPROVED',
          performedBy: approvalData.approvedBy,
          timestamp: new Date()
        }
      }
    },
    { new: true }
  );
  if (!payroll) throw new AppError('Payroll record not found', 404);
  return payroll;
};

/**
 * Get HR statistics
 * @param {string} schoolId
 * @returns {Promise<object>} Statistics
 */
exports.getHRStatistics = async (schoolId) => {
  const [totalStaff, activeStaff, inactiveStaff, totalPayroll, pendingAppraisals] = await Promise.all([
    HRStaff.countDocuments({ schoolId }),
    HRStaff.countDocuments({ schoolId, status: 'ACTIVE' }),
    HRStaff.countDocuments({ schoolId, status: 'INACTIVE' }),
    Payroll.countDocuments({ schoolId }),
    PerformanceAppraisal.countDocuments({ schoolId, status: { $in: ['DRAFT', 'SUBMITTED'] } })
  ]);

  return {
    totalStaff,
    activeStaff,
    inactiveStaff,
    totalPayrollRecords: totalPayroll,
    pendingAppraisals,
    timestamp: new Date()
  };
};

/**
 * Deactivate staff member
 * @param {string} staffId
 * @param {string} schoolId
 * @param {object} reason
 * @returns {Promise<object>} Updated staff
 */
exports.deactivateStaff = async (staffId, schoolId, reason) => {
  const staff = await HRStaff.findOneAndUpdate(
    { _id: staffId, schoolId },
    {
      status: 'INACTIVE',
      dateOfLeaving: new Date(),
      $push: {
        auditLog: {
          action: 'DEACTIVATE',
          performedBy: null,
          timestamp: new Date(),
          changes: { reason }
        }
      }
    },
    { new: true }
  );
  if (!staff) throw new AppError('Staff member not found', 404);
  return staff;
};

module.exports = exports;
    ]);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Approve overtime
   */
  static async approveOvertime(schoolId, overtimeId, userId) {
    const overtime = await Overtime.findOne({ _id: overtimeId, schoolId });

    if (!overtime) throw new AppError('Overtime record not found', 404);

    overtime.status = 'APPROVED';
    overtime.approvedDate = new Date();
    overtime.approvedBy = userId;
    overtime.approvedHours = overtime.hoursWorked;

    await overtime.save();
    return overtime;
  }

  /**
   * Reject overtime
   */
  static async rejectOvertime(schoolId, overtimeId, rejectionReason, userId) {
    const overtime = await Overtime.findOneAndUpdate(
      { _id: overtimeId, schoolId },
      {
        status: 'REJECTED',
        rejectionReason,
        approvedBy: userId,
      },
      { new: true }
    );

    if (!overtime) throw new AppError('Overtime record not found', 404);
    return overtime;
  }

  /**
   * Get employee designation designations
   */
  static async getEmployeesByDesignation(schoolId, designation) {
    const employees = await User.find(
      {
        schoolId,
        designation,
        role: { $in: ['TEACHER', 'HR_MANAGER', 'ACCOUNTANT', 'PRINCIPAL'] },
      },
      'firstName lastName email designation'
    );

    return employees;
  }

  /**
   * Get HR dashboard statistics
   */
  static async getHRDashboardStats(schoolId) {
    const [
      totalEmployees,
      activeOvertime,
      pendingLeaves,
      pendingAppraisals,
    ] = await Promise.all([
      User.countDocuments({
        schoolId,
        role: { $in: ['TEACHER', 'LIBRARIAN', 'ACCOUNTANT', 'PRINCIPAL', 'HR_MANAGER'] },
      }),
      Overtime.countDocuments({ schoolId, status: 'APPROVED' }),
      require('../models/hr/LeaveRequest.model').countDocuments({ schoolId, status: 'SUBMITTED' }),
      require('../models/hr/EmployeeAppraisal.model').countDocuments({
        schoolId,
        status: { $in: ['DRAFT', 'SUBMITTED'] },
      }),
    ]);

    return {
      totalEmployees,
      activeOvertime,
      pendingLeaves,
      pendingAppraisals,
    };
  }
}

module.exports = HRService;
