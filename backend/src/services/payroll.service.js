/**
 * Payroll Service
 * Business logic for salary processing and payslip generation
 */

const EmployeePayroll = require('../models/hr/EmployeePayroll.model');
const Payslip = require('../models/hr/Payslip.model');
const SalaryStructure = require('../models/hr/SalaryStructure.model');
const User = require('../models/auth/User.model');
const { AppError } = require('../utils/errorHelper');

class PayrollService {
  /**
   * Create payroll for employee
   */
  static async createPayroll(schoolId, payrollData, userId) {
    const { employee, payrollMonth, payrollYear, salaryStructure } = payrollData;

    // Get salary structure
    const structure = await SalaryStructure.findOne({ _id: salaryStructure, schoolId });
    if (!structure) throw new AppError('Salary structure not found', 404);

    // Calculate earnings
    let totalEarnings = structure.baseSalary;
    const earnings = [{ component: 'BASIC', amount: structure.baseSalary }];

    structure.earnings.forEach((earning) => {
      const amount = earning.percentage
        ? (structure.baseSalary * earning.percentage) / 100
        : earning.amount;
      earnings.push({ component: earning.component, amount });
      totalEarnings += amount;
    });

    // Calculate deductions
    let totalDeductions = 0;
    const deductions = [];

    structure.deductions.forEach((deduction) => {
      const amount = deduction.percentage
        ? (totalEarnings * deduction.percentage) / 100
        : deduction.amount;
      deductions.push({ component: deduction.component, amount });
      totalDeductions += amount;
    });

    const netSalary = totalEarnings - totalDeductions;

    const payroll = new EmployeePayroll({
      schoolId,
      employee,
      payrollMonth,
      payrollYear,
      salaryStructure,
      baseSalary: structure.baseSalary,
      earnings,
      totalEarnings,
      deductions,
      totalDeductions,
      grossSalary: totalEarnings,
      netSalary,
      processedBy: userId,
    });

    await payroll.save();
    return payroll.populate(['employee', 'salaryStructure']);
  }

  /**
   * Get payroll records
   */
  static async getPayrolls(schoolId, filters = {}) {
    const { page = 1, limit = 10, employee, payrollMonth, status } = filters;

    const query = { schoolId };
    if (employee) query.employee = employee;
    if (payrollMonth) query.payrollMonth = payrollMonth;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      EmployeePayroll.find(query)
        .populate('employee', 'firstName lastName email')
        .populate('salaryStructure', 'name baseSalary')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      EmployeePayroll.countDocuments(query),
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
   * Get payroll by ID
   */
  static async getPayrollById(schoolId, payrollId) {
    const payroll = await EmployeePayroll.findOne({ _id: payrollId, schoolId }).populate([
      { path: 'employee', select: 'firstName lastName email' },
      { path: 'salaryStructure', select: 'name baseSalary' },
    ]);

    if (!payroll) throw new AppError('Payroll not found', 404);
    return payroll;
  }

  /**
   * Process payroll (calculate final amounts)
   */
  static async processPayroll(schoolId, payrollId, processData, userId) {
    const payroll = await EmployeePayroll.findOne({ _id: payrollId, schoolId });
    if (!payroll) throw new AppError('Payroll not found', 404);

    const { presentDays, leavesTaken, bonus, overtime } = processData;

    payroll.presentDays = presentDays;
    payroll.leavesTaken = leavesTaken;
    payroll.bonus = bonus || 0;

    if (overtime) {
      payroll.overtime = overtime;
      payroll.totalEarnings += overtime.amount;
    }

    // Calculate attendance deduction if applicable
    if (payroll.workingDays && presentDays) {
      const attendancePercentage = (presentDays / payroll.workingDays) * 100;
      if (attendancePercentage < 80) {
        const deductionPercentage = 100 - attendancePercentage;
        payroll.attendanceDeduction = (payroll.baseSalary * deductionPercentage) / 100;
        payroll.netSalary = payroll.totalEarnings - payroll.totalDeductions - payroll.attendanceDeduction;
      }
    }

    payroll.status = 'PROCESSED';
    payroll.processedDate = new Date();
    payroll.processedBy = userId;

    await payroll.save();
    return payroll;
  }

  /**
   * Approve payroll
   */
  static async approvePayroll(schoolId, payrollId, userId) {
    const payroll = await EmployeePayroll.findOneAndUpdate(
      { _id: payrollId, schoolId, status: 'PROCESSED' },
      {
        status: 'APPROVED',
        approvedDate: new Date(),
        approvedBy: userId,
      },
      { new: true }
    );

    if (!payroll) throw new AppError('Payroll not found or not processed', 404);
    return payroll;
  }

  /**
   * Generate payslip
   */
  static async generatePayslip(schoolId, payrollId, userId) {
    const payroll = await EmployeePayroll.findOne({ _id: payrollId, schoolId }).populate(
      'employee'
    );
    if (!payroll) throw new AppError('Payroll not found', 404);

    const payslip = new Payslip({
      schoolId,
      employee: payroll.employee._id,
      employeePayroll: payrollId,
      payrollMonth: payroll.payrollMonth,
      payrollYear: payroll.payrollYear,
      employeeDetails: {
        employeeId: payroll.employee.employeeId,
        name: `${payroll.employee.firstName} ${payroll.employee.lastName}`,
        designation: payroll.employee.designation,
        department: payroll.employee.department,
      },
      baseSalary: payroll.baseSalary,
      earnings: payroll.earnings,
      totalEarnings: payroll.totalEarnings,
      deductions: payroll.deductions,
      totalDeductions: payroll.totalDeductions,
      grossSalary: payroll.grossSalary,
      netSalary: payroll.netSalary,
      bankDetails: payroll.bankDetails,
      paymentMode: payroll.paymentMode,
      generatedBy: userId,
      status: 'GENERATED',
    });

    await payslip.save();
    return payslip;
  }

  /**
   * Get payslip
   */
  static async getPayslip(schoolId, payslipId) {
    const payslip = await Payslip.findOne({ _id: payslipId, schoolId }).populate([
      { path: 'employee', select: 'firstName lastName email' },
    ]);

    if (!payslip) throw new AppError('Payslip not found', 404);
    return payslip;
  }

  /**
   * Send payslips
   */
  static async sendPayslips(schoolId, payrollMonth, payrollYear, userId) {
    const payslips = await Payslip.updateMany(
      {
        schoolId,
        payrollMonth,
        payrollYear,
        status: 'GENERATED',
      },
      {
        status: 'SENT',
        sentDate: new Date(),
      }
    );

    return {
      message: `${payslips.modifiedCount} payslips sent`,
      count: payslips.modifiedCount,
    };
  }

  /**
   * Mark payroll as paid
   */
  static async markPayrollAsPaid(schoolId, payrollId, paymentData, userId) {
    const payroll = await EmployeePayroll.findOneAndUpdate(
      { _id: payrollId, schoolId, status: 'APPROVED' },
      {
        status: 'PAID',
        paidDate: new Date(),
        paidBy: userId,
        paymentMode: paymentData.paymentMode,
        bankDetails: paymentData.bankDetails,
      },
      { new: true }
    );

    if (!payroll) throw new AppError('Payroll not found or not approved', 404);
    return payroll;
  }

  /**
   * Get payroll summary
   */
  static async getPayrollSummary(schoolId, payrollMonth, payrollYear) {
    const payrolls = await EmployeePayroll.find({
      schoolId,
      payrollMonth,
      payrollYear,
    });

    if (payrolls.length === 0) throw new AppError('No payroll records found', 404);

    const summary = {
      totalEmployees: payrolls.length,
      totalGross: payrolls.reduce((sum, p) => sum + (p.grossSalary || 0), 0),
      totalDeductions: payrolls.reduce((sum, p) => sum + (p.totalDeductions || 0), 0),
      totalNet: payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0),
      processed: payrolls.filter((p) => p.status === 'PROCESSED').length,
      approved: payrolls.filter((p) => p.status === 'APPROVED').length,
      paid: payrolls.filter((p) => p.status === 'PAID').length,
      pending: payrolls.filter((p) => ['DRAFT', 'PROCESSED'].includes(p.status)).length,
    };

    return summary;
  }
}

module.exports = PayrollService;
