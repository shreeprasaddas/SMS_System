/**
 * Hostel Validation Schemas
 * Request validation for hostel operations
 */

const Joi = require('joi');

// Create Hostel
exports.createHostelSchema = Joi.object({
  hostelName: Joi.string().min(2).max(100).required(),
  hostelType: Joi.string().valid('BOYS', 'GIRLS', 'MIXED').required(),
  principalInCharge: Joi.string().hex().length(24),
  warden: Joi.string().hex().length(24),
  assistantWarden: Joi.string().hex().length(24),
  totalCapacity: Joi.number().integer().min(1).required(),
  totalRooms: Joi.number().integer().min(1).required(),
  facilities: Joi.array().items(
    Joi.object({
      facilityName: Joi.string().max(100),
      description: Joi.string().max(500),
      available: Joi.boolean(),
      maintenanceSchedule: Joi.string().max(100)
    })
  ),
  address: Joi.object({
    street: Joi.string().max(200),
    city: Joi.string().max(50),
    state: Joi.string().max(50),
    postalCode: Joi.string().max(20),
    country: Joi.string().max(50)
  }),
  contactNumber: Joi.string().max(20),
  emergencyContact: Joi.object({
    name: Joi.string().max(100),
    phone: Joi.string().max(20)
  }),
  email: Joi.string().email(),
  visitingHours: Joi.object({
    startTime: Joi.string(),
    endTime: Joi.string()
  }),
  rules: Joi.array().items(
    Joi.object({
      ruleTitle: Joi.string().max(100),
      description: Joi.string().max(500),
      penalty: Joi.string().max(200)
    })
  ),
  accommodationType: Joi.string().valid('SHARED', 'SINGLE', 'DOUBLE', 'TRIPLE', 'MULTIPLE').required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE', 'CLOSED')
});

// Add Room
exports.addRoomSchema = Joi.object({
  hostelId: Joi.string().hex().length(24).required(),
  roomNumber: Joi.string().max(50).required(),
  floor: Joi.number().integer().min(0).required(),
  roomType: Joi.string().valid('SINGLE', 'DOUBLE', 'TRIPLE', 'QUADRUPLE', 'MULTIPLE').required(),
  capacity: Joi.number().integer().min(1).max(10).required(),
  facilities: Joi.array().items(
    Joi.object({
      facilityName: Joi.string().max(100),
      available: Joi.boolean()
    })
  ),
  monthlyRent: Joi.number().min(0).required(),
  securityDeposit: Joi.number().min(0).required(),
  roomCondition: Joi.string().valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
  status: Joi.string().valid('AVAILABLE', 'OCCUPIED', 'UNDER_MAINTENANCE', 'RESERVED', 'CLOSED')
});

// Allocate Student
exports.allocateStudentSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  hostelId: Joi.string().hex().length(24).required(),
  roomId: Joi.string().hex().length(24).required(),
  bedNumber: Joi.number().integer().min(1).required(),
  academicYear: Joi.string().required(),
  allocationDate: Joi.date().required(),
  expectedCheckoutDate: Joi.date(),
  monthlyRent: Joi.number().min(0).required(),
  securityDeposit: Joi.number().min(0).required(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    relationship: Joi.string().required()
  }).required(),
  medicalInfo: Joi.object({
    bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allergies: Joi.string().max(500),
    medications: Joi.string().max(500)
  })
});

// Record Fee
exports.recordFeeSchema = Joi.object({
  studentHostelId: Joi.string().hex().length(24).required(),
  studentId: Joi.string().hex().length(24).required(),
  hostelId: Joi.string().hex().length(24).required(),
  academicYear: Joi.string().required(),
  feeType: Joi.string().valid('MONTHLY_RENT', 'SECURITY_DEPOSIT', 'MAINTENANCE_FEE', 'MESS_FEE', 'UTILITY_FEE', 'OTHER').required(),
  amount: Joi.number().min(0).required(),
  lateFee: Joi.number().min(0),
  discount: Joi.number().min(0),
  totalAmount: Joi.number().min(0).required(),
  dueDate: Joi.date().required(),
  paymentMethod: Joi.string().valid('CASH', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE', 'CARD', 'UPIPI'),
  transactionId: Joi.string().max(100),
  description: Joi.string().max(500)
});

// File Complaint
exports.fileComplaintSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  hostelId: Joi.string().hex().length(24).required(),
  roomId: Joi.string().hex().length(24),
  complaintType: Joi.string().valid('ROOM_CONDITION', 'AMENITIES', 'STAFF_CONDUCT', 'FOOD_QUALITY', 'NOISE', 'MAINTENANCE', 'SECURITY', 'OTHER').required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).max(1000).required(),
  location: Joi.string().max(200),
  attachments: Joi.array().items(
    Joi.object({
      fileUrl: Joi.string(),
      fileName: Joi.string().max(200)
    })
  )
});

// Update Complaint Status
exports.updateComplaintStatusSchema = Joi.object({
  complaintStatus: Joi.string().valid('OPEN', 'IN_PROGRESS', 'PENDING_STUDENT_RESPONSE', 'CLOSED', 'REJECTED'),
  assignedTo: Joi.string().hex().length(24),
  resolutionNotes: Joi.string().max(1000),
  resolutionStatus: Joi.string().valid('RESOLVED', 'PARTIALLY_RESOLVED', 'NOT_RESOLVED')
});

// List Filters
exports.listHostelsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  hostelType: Joi.string().valid('BOYS', 'GIRLS', 'MIXED'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE', 'CLOSED')
});

exports.listRoomsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  hostelId: Joi.string().hex().length(24),
  roomType: Joi.string().valid('SINGLE', 'DOUBLE', 'TRIPLE', 'QUADRUPLE', 'MULTIPLE'),
  status: Joi.string().valid('AVAILABLE', 'OCCUPIED', 'UNDER_MAINTENANCE', 'RESERVED', 'CLOSED')
});

exports.listAllocationsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  hostelId: Joi.string().hex().length(24),
  allocationStatus: Joi.string().valid('ACTIVE', 'CHECKED_OUT', 'SUSPENDED', 'TERMINATED'),
  academicYear: Joi.string()
});

exports.listFeesSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  studentId: Joi.string().hex().length(24),
  paymentStatus: Joi.string().valid('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED'),
  feeType: Joi.string().valid('MONTHLY_RENT', 'SECURITY_DEPOSIT', 'MAINTENANCE_FEE', 'MESS_FEE', 'UTILITY_FEE', 'OTHER')
});

exports.listComplaintsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  complaintStatus: Joi.string().valid('OPEN', 'IN_PROGRESS', 'PENDING_STUDENT_RESPONSE', 'CLOSED', 'REJECTED'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
  studentId: Joi.string().hex().length(24)
});
