const Joi = require('joi');

// Register/Create Staff Member
exports.registerStaffSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid user ID',
    'any.required': 'User ID is required'
  }),
  staffName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Staff name must be at least 2 characters',
    'any.required': 'Staff name is required'
  }),
  designation: Joi.string()
    .valid('PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER', 'LIBRARIAN', 'ACCOUNTANT', 'TRANSPORT_MANAGER', 'HOSTEL_MANAGER', 'HR_MANAGER', 'SUPPORT_STAFF')
    .required()
    .messages({
      'any.required': 'Designation is required',
      'any.only': 'Invalid designation'
    }),
  department: Joi.string().max(100),
  employmentType: Joi.string()
    .valid('PERMANENT', 'CONTRACT', 'TEMPORARY', 'PART_TIME')
    .required(),
  dateOfBirth: Joi.date().required().messages({
    'any.required': 'Date of birth is required'
  }),
  dateOfJoining: Joi.date().required().messages({
    'any.required': 'Date of joining is required'
  }),
  phone: Joi.string().regex(/^\d{10}$/).required().messages({
    'string.pattern.base': 'Phone must be 10 digits',
    'any.required': 'Phone is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  address: Joi.object({
    street: Joi.string().max(255),
    city: Joi.string().max(100),
    state: Joi.string().max(100),
    postalCode: Joi.string().max(20),
    country: Joi.string().max(100)
  }),
  bankAccountNumber: Joi.string().max(20),
  bankName: Joi.string().max(100),
  ifscCode: Joi.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),
  panNumber: Joi.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  aadharNumber: Joi.string().regex(/^\d{12}$/),
  qualifications: Joi.array().items(
    Joi.object({
      degree: Joi.string().required(),
      specialization: Joi.string(),
      institution: Joi.string().required(),
      yearOfCompletion: Joi.number().integer().min(1900).max(new Date().getFullYear())
    })
  ),
  experience: Joi.object({
    totalYears: Joi.number().min(0),
    previousEmployers: Joi.array().items(
      Joi.object({
        companyName: Joi.string(),
        designation: Joi.string(),
        years: Joi.number()
      })
    )
  }),
  salaryStructureId: Joi.string().hex().length(24),
  basicSalary: Joi.number().min(0),
  reportingTo: Joi.string().hex().length(24),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RESIGNED')
});

// Update Staff Member
exports.updateStaffSchema = Joi.object({
  staffName: Joi.string().min(2).max(100),
  designation: Joi.string().valid('PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER', 'LIBRARIAN', 'ACCOUNTANT', 'TRANSPORT_MANAGER', 'HOSTEL_MANAGER', 'HR_MANAGER', 'SUPPORT_STAFF'),
  department: Joi.string().max(100),
  phone: Joi.string().regex(/^\d{10}$/),
  email: Joi.string().email(),
  address: Joi.object({
    street: Joi.string().max(255),
    city: Joi.string().max(100),
    state: Joi.string().max(100),
    postalCode: Joi.string().max(20),
    country: Joi.string().max(100)
  }),
  salaryStructureId: Joi.string().hex().length(24),
  basicSalary: Joi.number().min(0),
  reportingTo: Joi.string().hex().length(24),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RESIGNED')
});

// Create Salary Structure
exports.createSalaryStructureSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Salary structure name is required'
  }),
  description: Joi.string().max(500),
  designation: Joi.string()
    .valid('PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER', 'LIBRARIAN', 'ACCOUNTANT', 'TRANSPORT_MANAGER', 'HOSTEL_MANAGER', 'HR_MANAGER', 'SUPPORT_STAFF')
    .required(),
  baseSalary: Joi.number().min(0).required().messages({
    'number.min': 'Base salary cannot be negative',
    'any.required': 'Base salary is required'
  }),
  earnings: Joi.array().items(
    Joi.object({
      component: Joi.string().valid('HRA', 'DA', 'BONUS', 'ALLOWANCE', 'INCENTIVE', 'OTHER').required(),
      amount: Joi.number().min(0),
      percentage: Joi.number().min(0).max(100),
      description: Joi.string().max(200)
    })
  ),
  deductions: Joi.array().items(
    Joi.object({
      component: Joi.string().valid('PF', 'ESI', 'INCOME_TAX', 'INSURANCE', 'OTHER').required(),
      amount: Joi.number().min(0),
      percentage: Joi.number().min(0).max(100),
      description: Joi.string().max(200)
    })
  ),
  effectiveFrom: Joi.date().required().messages({
    'any.required': 'Effective from date is required'
  }),
  effectiveTo: Joi.date().greater(Joi.ref('effectiveFrom')),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED')
});

// Create Payroll
exports.createPayrollSchema = Joi.object({
  staffId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid staff ID',
    'any.required': 'Staff ID is required'
  }),
  payrollMonth: Joi.number().integer().min(1).max(12).required(),
  payrollYear: Joi.number().integer().min(1900).required(),
  processDate: Joi.date().required(),
  salaryStructureId: Joi.string().hex().length(24),
  baseSalary: Joi.number().min(0).required(),
  earnings: Joi.array().items(
    Joi.object({
      component: Joi.string().required(),
      amount: Joi.number().min(0),
      percentage: Joi.number().min(0).max(100)
    })
  ),
  deductions: Joi.array().items(
    Joi.object({
      component: Joi.string().required(),
      amount: Joi.number().min(0),
      percentage: Joi.number().min(0).max(100)
    })
  ),
  attendanceDays: Joi.number().min(0).max(31),
  workingDays: Joi.number().min(0).max(31),
  overtimeHours: Joi.number().min(0),
  overtimeAmount: Joi.number().min(0),
  paymentMode: Joi.string().valid('BANK_TRANSFER', 'CHEQUE', 'CASH', 'OTHER'),
  remarks: Joi.string().max(500)
});

// Approve Payroll
exports.approvePayrollSchema = Joi.object({
  approvedBy: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid user ID',
    'any.required': 'Approver ID is required'
  }),
  remarks: Joi.string().max(500)
});

// Mark Staff Attendance
exports.markAttendanceSchema = Joi.object({
  staffId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid staff ID',
    'any.required': 'Staff ID is required'
  }),
  attendanceDate: Joi.date().required().messages({
    'any.required': 'Attendance date is required'
  }),
  attendanceStatus: Joi.string()
    .valid('PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'EARLY_LEAVE', 'ON_LEAVE', 'WEEKEND', 'HOLIDAY')
    .required()
    .messages({
      'any.required': 'Attendance status is required'
    }),
  checkInTime: Joi.date(),
  checkOutTime: Joi.date(),
  workingHours: Joi.number().min(0),
  remarks: Joi.string().max(500),
  markedBy: Joi.string().hex().length(24)
});

// Create Performance Appraisal
exports.createAppraisalSchema = Joi.object({
  staffId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid staff ID',
    'any.required': 'Staff ID is required'
  }),
  appraisalYear: Joi.number().integer().min(1900).required(),
  appraisalType: Joi.string().valid('QUARTERLY', 'HALF_YEARLY', 'ANNUAL', 'SPECIAL'),
  appraisalPeriod: Joi.object({
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate'))
  }),
  performanceMetrics: Joi.array().items(
    Joi.object({
      metric: Joi.string().required(),
      rating: Joi.number().integer().min(1).max(5).required(),
      comments: Joi.string().max(500),
      weight: Joi.number().min(0).max(100)
    })
  ),
  strengths: Joi.string().max(1000),
  areasForImprovement: Joi.string().max(1000),
  developmentPlan: Joi.array().items(
    Joi.object({
      goal: Joi.string().required(),
      timeline: Joi.string(),
      action: Joi.string()
    })
  ),
  appraisedBy: Joi.string().hex().length(24).required(),
  recommendations: Joi.string().max(1000),
  promotioneEligible: Joi.boolean(),
  increaseRecommended: Joi.boolean(),
  increasePercentage: Joi.number().min(0).max(100)
});

// List Filters
exports.listStaffSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RESIGNED'),
  designation: Joi.string(),
  department: Joi.string()
});

exports.listPayrollSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  staffId: Joi.string().hex().length(24),
  paymentStatus: Joi.string().valid('PENDING', 'PROCESSED', 'PAID', 'CANCELLED'),
  payrollMonth: Joi.number().integer().min(1).max(12),
  payrollYear: Joi.number().integer().min(1900)
});

exports.listAttendanceSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  staffId: Joi.string().hex().length(24),
  attendanceStatus: Joi.string().valid('PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'EARLY_LEAVE', 'ON_LEAVE', 'WEEKEND', 'HOLIDAY'),
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref('startDate'))
});

exports.listAppraisalsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  staffId: Joi.string().hex().length(24),
  status: Joi.string().valid('DRAFT', 'SUBMITTED', 'REVIEWED', 'ACKNOWLEDGED', 'COMPLETED'),
  appraisalYear: Joi.number().integer().min(1900)
});
