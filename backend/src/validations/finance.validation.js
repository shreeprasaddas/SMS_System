const Joi = require('joi');

// Create Budget
exports.createBudgetSchema = Joi.object({
  budgetName: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Budget name is required'
  }),
  description: Joi.string().max(500),
  fiscalYear: Joi.number().integer().min(1900).required(),
  budgetYear: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required()
  }),
  budgetAllocations: Joi.array().items(
    Joi.object({
      category: Joi.string()
        .valid('STAFF_SALARY', 'UTILITIES', 'MAINTENANCE', 'INFRASTRUCTURE', 'EQUIPMENT', 'SUPPLIES', 'EVENTS', 'SCHOLARSHIP', 'OPERATIONS', 'OTHER')
        .required(),
      allocatedAmount: Joi.number().min(0).required(),
      description: Joi.string().max(200)
    })
  ).required(),
  totalBudget: Joi.number().min(0).required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED')
});

// Update Budget
exports.updateBudgetSchema = Joi.object({
  budgetName: Joi.string().min(2).max(100),
  description: Joi.string().max(500),
  budgetAllocations: Joi.array().items(
    Joi.object({
      category: Joi.string()
        .valid('STAFF_SALARY', 'UTILITIES', 'MAINTENANCE', 'INFRASTRUCTURE', 'EQUIPMENT', 'SUPPLIES', 'EVENTS', 'SCHOLARSHIP', 'OPERATIONS', 'OTHER'),
      allocatedAmount: Joi.number().min(0),
      description: Joi.string().max(200)
    })
  ),
  totalBudget: Joi.number().min(0),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED')
});

// Record Expense
exports.recordExpenseSchema = Joi.object({
  category: Joi.string()
    .valid('STAFF_SALARY', 'UTILITIES', 'MAINTENANCE', 'INFRASTRUCTURE', 'EQUIPMENT', 'SUPPLIES', 'EVENTS', 'SCHOLARSHIP', 'OPERATIONS', 'OTHER')
    .required(),
  description: Joi.string().min(5).max(500).required(),
  amount: Joi.number().min(0).required(),
  expenseDate: Joi.date().required(),
  paymentMethod: Joi.string()
    .valid('CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER', 'CREDIT_CARD', 'OTHER')
    .required(),
  vendor: Joi.string().max(200),
  vendorContact: Joi.string(),
  invoiceNumber: Joi.string(),
  billNumber: Joi.string(),
  department: Joi.string().valid('ACADEMIC', 'ADMINISTRATION', 'INFRASTRUCTURE', 'SUPPORT', 'OTHER'),
  budgetAllocationId: Joi.string().hex().length(24),
  notes: Joi.string().max(500)
});

// Approve Expense
exports.approveExpenseSchema = Joi.object({
  approvedBy: Joi.string().hex().length(24).required(),
  remarks: Joi.string().max(500)
});

// Record Income
exports.recordIncomeSchema = Joi.object({
  incomeSource: Joi.string()
    .valid('STUDENT_FEES', 'DONATIONS', 'GRANTS', 'TUITION_FEES', 'MISCELLANEOUS', 'TRANSPORT_FEES', 'HOSTEL_FEES', 'INTEREST', 'OTHER')
    .required(),
  description: Joi.string().min(5).max(500).required(),
  amount: Joi.number().min(0).required(),
  incomeDate: Joi.date().required(),
  receiptNumber: Joi.string(),
  paymentMethod: Joi.string()
    .valid('CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER', 'CREDIT_CARD', 'OTHER')
    .required(),
  payerName: Joi.string().max(100),
  payerContact: Joi.string(),
  category: Joi.string().valid('ACADEMIC', 'NON_ACADEMIC', 'DONATIONS', 'GRANTS', 'OTHER'),
  notes: Joi.string().max(500)
});

// Create Voucher
exports.createVoucherSchema = Joi.object({
  voucherType: Joi.string()
    .valid('PAYMENT', 'RECEIPT', 'JOURNAL', 'CONTRA')
    .required(),
  voucherDate: Joi.date().required(),
  referenceNumber: Joi.string().required(),
  description: Joi.string().min(5).max(500).required(),
  journalEntries: Joi.array().items(
    Joi.object({
      ledgerAccount: Joi.string().required(),
      accountType: Joi.string()
        .valid('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE')
        .required(),
      debit: Joi.number().min(0),
      credit: Joi.number().min(0),
      narration: Joi.string().max(300)
    })
  ).required(),
  paymentMethod: Joi.string().valid('CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER', 'OTHER'),
  remarks: Joi.string().max(500)
});

// Generate Financial Report
exports.generateReportSchema = Joi.object({
  reportType: Joi.string()
    .valid('INCOME_STATEMENT', 'BALANCE_SHEET', 'CASH_FLOW', 'EXPENSE_REPORT', 'REVENUE_REPORT', 'BUDGET_vs_ACTUAL')
    .required(),
  reportName: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500),
  fiscalYear: Joi.number().integer().min(1900).required(),
  reportPeriod: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required()
  }).required()
});

// List Filters
exports.listBudgetsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
  fiscalYear: Joi.number().integer().min(1900)
});

exports.listExpensesSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  category: Joi.string(),
  status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED'),
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref('startDate'))
});

exports.listIncomeSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  incomeSource: Joi.string(),
  status: Joi.string().valid('PENDING', 'VERIFIED', 'REJECTED', 'RECONCILED', 'CANCELLED'),
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref('startDate'))
});

exports.listVouchersSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  voucherType: Joi.string().valid('PAYMENT', 'RECEIPT', 'JOURNAL', 'CONTRA'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED')
});

exports.listReportsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  reportType: Joi.string()
    .valid('INCOME_STATEMENT', 'BALANCE_SHEET', 'CASH_FLOW', 'EXPENSE_REPORT', 'REVENUE_REPORT', 'BUDGET_vs_ACTUAL'),
  status: Joi.string().valid('DRAFT', 'FINALIZED', 'ARCHIVED')
});
