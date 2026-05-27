const Joi = require('joi');

// Route Validation Schemas
exports.createRouteSchema = Joi.object({
  routeName: Joi.string().min(3).max(100).required(),
  routeNumber: Joi.string().required(),
  startPoint: Joi.object({
    address: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    landmark: Joi.string()
  }).required(),
  endPoint: Joi.object({
    address: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    landmark: Joi.string()
  }).required(),
  stops: Joi.array().items(Joi.object({
    stopName: Joi.string(),
    stopSequence: Joi.number(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    estimatedTime: Joi.string()
  })).optional(),
  distance: Joi.number().min(0),
  estimatedDuration: Joi.string(),
  capacity: Joi.number().min(1).required(),
  routeType: Joi.string().valid('MORNING', 'AFTERNOON', 'EVENING', 'BOTH').default('BOTH'),
  operatingDays: Joi.array().items(Joi.string().valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
  pickupTime: Joi.string(),
  dropoffTime: Joi.string(),
  fee: Joi.number().min(0).required(),
  driverId: Joi.string().hex().length(24),
  driverName: Joi.string(),
  conductorId: Joi.string().hex().length(24),
  conductorName: Joi.string()
}).required();

exports.updateRouteSchema = Joi.object({
  routeName: Joi.string().min(3).max(100),
  routeNumber: Joi.string(),
  startPoint: Joi.object({
    address: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    landmark: Joi.string()
  }),
  endPoint: Joi.object({
    address: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    landmark: Joi.string()
  }),
  capacity: Joi.number().min(1),
  routeType: Joi.string().valid('MORNING', 'AFTERNOON', 'EVENING', 'BOTH'),
  operatingDays: Joi.array().items(Joi.string().valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
  pickupTime: Joi.string(),
  dropoffTime: Joi.string(),
  fee: Joi.number().min(0),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED')
}).min(1);

// Bus Validation Schemas
exports.registerBusSchema = Joi.object({
  busNumber: Joi.string().required(),
  registrationNumber: Joi.string().required(),
  model: Joi.string().required(),
  manufacturer: Joi.string().required(),
  yearOfManufacture: Joi.number().integer().min(2000).max(new Date().getFullYear()).required(),
  capacity: Joi.number().integer().min(10).max(100).required(),
  fuelType: Joi.string().valid('DIESEL', 'PETROL', 'CNG', 'ELECTRIC').required(),
  insuranceExpiryDate: Joi.date().required(),
  fitnessExpiryDate: Joi.date().required(),
  permitExpiryDate: Joi.date().required(),
  lastMaintenanceDate: Joi.date(),
  nextMaintenanceDate: Joi.date(),
  currentMileage: Joi.number().min(0),
  features: Joi.array().items(Joi.string().valid('AC', 'GPS', 'FIRST_AID_KIT', 'FIRE_EXTINGUISHER', 'SEAT_BELTS', 'EMERGENCY_BUTTONS', 'CCTV', 'PANIC_BUTTON')),
  driverId: Joi.string().hex().length(24),
  driverName: Joi.string(),
  conductorId: Joi.string().hex().length(24),
  conductorName: Joi.string(),
  routeId: Joi.string().hex().length(24),
  routeName: Joi.string(),
  description: Joi.string()
}).required();

exports.updateBusSchema = Joi.object({
  busNumber: Joi.string(),
  registrationNumber: Joi.string(),
  model: Joi.string(),
  manufacturer: Joi.string(),
  yearOfManufacture: Joi.number().integer().min(2000).max(new Date().getFullYear()),
  capacity: Joi.number().integer().min(10).max(100),
  fuelType: Joi.string().valid('DIESEL', 'PETROL', 'CNG', 'ELECTRIC'),
  insuranceExpiryDate: Joi.date(),
  fitnessExpiryDate: Joi.date(),
  permitExpiryDate: Joi.date(),
  lastMaintenanceDate: Joi.date(),
  nextMaintenanceDate: Joi.date(),
  currentMileage: Joi.number().min(0),
  features: Joi.array().items(Joi.string().valid('AC', 'GPS', 'FIRST_AID_KIT', 'FIRE_EXTINGUISHER', 'SEAT_BELTS', 'EMERGENCY_BUTTONS', 'CCTV', 'PANIC_BUTTON')),
  driverId: Joi.string().hex().length(24),
  routeId: Joi.string().hex().length(24),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE'),
  description: Joi.string()
}).min(1);

// Driver Validation Schemas
exports.registerDriverSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  driverName: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  licenseType: Joi.string().valid('LMV', 'HMV', 'MCWG').required(),
  licenseExpiryDate: Joi.date().required(),
  yearsOfExperience: Joi.number().min(0).required(),
  dateOfBirth: Joi.date(),
  phoneNumber: Joi.string(),
  address: Joi.string(),
  hireDate: Joi.date().required(),
  medicalFitnessExpiryDate: Joi.date().required(),
  trainings: Joi.array().items(Joi.object({
    trainingType: Joi.string().valid('DEFENSIVE_DRIVING', 'FIRST_AID', 'EMERGENCY_RESPONSE', 'CHILD_SAFETY'),
    completionDate: Joi.date(),
    certificateNumber: Joi.string()
  })),
  emergencyContact: Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    relationship: Joi.string()
  }),
  assignedBusId: Joi.string().hex().length(24)
}).required();

exports.updateDriverSchema = Joi.object({
  driverName: Joi.string(),
  licenseExpiryDate: Joi.date(),
  yearsOfExperience: Joi.number().min(0),
  dateOfBirth: Joi.date(),
  phoneNumber: Joi.string(),
  address: Joi.string(),
  medicalFitnessExpiryDate: Joi.date(),
  trainings: Joi.array().items(Joi.object({
    trainingType: Joi.string().valid('DEFENSIVE_DRIVING', 'FIRST_AID', 'EMERGENCY_RESPONSE', 'CHILD_SAFETY'),
    completionDate: Joi.date(),
    certificateNumber: Joi.string()
  })),
  emergencyContact: Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    relationship: Joi.string()
  }),
  performanceRating: Joi.number().min(1).max(5),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED')
}).min(1);

// Student Transport Allocation Validation Schemas
exports.assignStudentSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  studentName: Joi.string(),
  className: Joi.string(),
  rollNumber: Joi.string(),
  routeId: Joi.string().hex().length(24).required(),
  routeName: Joi.string(),
  busId: Joi.string().hex().length(24).required(),
  busNumber: Joi.string(),
  pickupStop: Joi.object({
    stopName: Joi.string(),
    pickupTime: Joi.string(),
    sequence: Joi.number()
  }),
  dropoffStop: Joi.object({
    stopName: Joi.string(),
    dropoffTime: Joi.string(),
    sequence: Joi.number()
  }),
  transportType: Joi.string().valid('ONE_WAY', 'TWO_WAY').default('TWO_WAY'),
  allocationStartDate: Joi.date().required(),
  allocationEndDate: Joi.date(),
  transportFee: Joi.number().min(0).required(),
  parentName: Joi.string(),
  parentPhone: Joi.string(),
  emergencyContact: Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    relationship: Joi.string()
  }),
  specialInstructions: Joi.string()
}).required();

exports.updateAllocationSchema = Joi.object({
  routeId: Joi.string().hex().length(24),
  busId: Joi.string().hex().length(24),
  pickupStop: Joi.object({
    stopName: Joi.string(),
    pickupTime: Joi.string(),
    sequence: Joi.number()
  }),
  dropoffStop: Joi.object({
    stopName: Joi.string(),
    dropoffTime: Joi.string(),
    sequence: Joi.number()
  }),
  transportType: Joi.string().valid('ONE_WAY', 'TWO_WAY'),
  allocationEndDate: Joi.date(),
  transportFee: Joi.number().min(0),
  feePaymentStatus: Joi.string().valid('PAID', 'PARTIAL', 'PENDING', 'OVERDUE'),
  allocationStatus: Joi.string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TRANSFERRED', 'GRADUATED'),
  specialInstructions: Joi.string()
}).min(1);

// Transport Attendance/Log Validation
exports.addAttendanceSchema = Joi.object({
  busId: Joi.string().hex().length(24).required(),
  routeId: Joi.string().hex().length(24).required(),
  driverId: Joi.string().hex().length(24).required(),
  logDate: Joi.date().required(),
  tripType: Joi.string().valid('MORNING', 'AFTERNOON', 'EVENING').required(),
  startTime: Joi.date().required(),
  endTime: Joi.date(),
  startMileage: Joi.number().min(0).required(),
  endMileage: Joi.number().min(0),
  distanceTraveled: Joi.number(),
  fuelConsumed: Joi.number().min(0),
  totalStudentsPickedUp: Joi.number().min(0),
  totalStudentsDropped: Joi.number().min(0),
  studentsAttendance: Joi.array().items(Joi.object({
    studentId: Joi.string().hex().length(24),
    studentName: Joi.string(),
    attendanceStatus: Joi.string().valid('PRESENT', 'ABSENT', 'LATE'),
    pickupTime: Joi.date(),
    dropoffTime: Joi.date(),
    remarks: Joi.string()
  })),
  incidents: Joi.array().items(Joi.object({
    incidentType: Joi.string().valid('ACCIDENT', 'BREAKDOWN', 'DELAY', 'MISBEHAVIOR', 'OTHER'),
    description: Joi.string(),
    severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    isResolved: Joi.boolean(),
    resolution: Joi.string()
  })),
  weatherCondition: Joi.string().valid('CLEAR', 'RAINY', 'FOGGY', 'SNOWY', 'WINDY'),
  trafficCondition: Joi.string().valid('LIGHT', 'MODERATE', 'HEAVY', 'EXTREME'),
  tripStatus: Joi.string().valid('COMPLETED', 'IN_PROGRESS', 'CANCELLED', 'DELAYED'),
  remarks: Joi.string()
}).required();

// Filter Schemas
exports.listRoutesSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
  routeType: Joi.string().valid('MORNING', 'AFTERNOON', 'EVENING', 'BOTH'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

exports.listBusesSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

exports.listDriversSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

module.exports = exports;

// Get buses (filters)
exports.getBusesSchema = Joi.object({
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE')
    .optional(),
  driver: Joi.string().optional(),
  route: Joi.string().optional(),
}).unknown(true);

// Add driver
exports.addDriverSchema = Joi.object({
  user: Joi.string().required().messages({
    'string.empty': 'User ID is required',
  }),
  licenseNumber: Joi.string().required().trim().messages({
    'string.empty': 'License number is required',
  }),
  licenseType: Joi.string()
    .valid('LMV', 'HMV', 'MCWG')
    .required(),
  licenseExpiry: Joi.date().required().messages({
    'date.base': 'Valid license expiry date is required',
  }),
  experience: Joi.number().integer().min(0).max(50).required(),
  emergencyContact: Joi.object({
    name: Joi.string().required().trim(),
    phone: Joi.string().required().trim(),
    relationship: Joi.string().required().trim(),
  }).required(),
  medicalFitnessExpiry: Joi.date().required().messages({
    'date.base': 'Valid medical fitness expiry date is required',
  }),
  trainingCompleted: Joi.array().items(
    Joi.string().valid('DEFENSIVE_DRIVING', 'FIRST_AID', 'EMERGENCY_RESPONSE', 'CHILD_SAFETY')
  ).optional(),
  hireDate: Joi.date().required(),
  remarks: Joi.string().optional().max(500),
}).unknown(false);

// Get drivers (filters)
exports.getDriversSchema = Joi.object({
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED')
    .optional(),
  assignedBus: Joi.string().optional(),
}).unknown(true);

// Add route
exports.addRouteSchema = Joi.object({
  routeNumber: Joi.string().required().trim().messages({
    'string.empty': 'Route number is required',
  }),
  routeName: Joi.string().required().trim(),
  startPoint: Joi.string().required().trim(),
  endPoint: Joi.string().required().trim(),
  distance: Joi.number().min(0).required(),
  estimatedDuration: Joi.number().min(0).required(),
  stops: Joi.array().items(
    Joi.object({
      stopNumber: Joi.number().integer().min(1).required(),
      stopName: Joi.string().required().trim(),
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional(),
      pickupTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      dropTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      fare: Joi.number().min(0).required(),
    })
  ).min(2).required(),
  routeType: Joi.string()
    .valid('MORNING_PICKUP', 'EVENING_DROPOFF', 'ROUND_TRIP')
    .required(),
  frequency: Joi.string()
    .valid('DAILY', 'WEEKDAYS', 'WEEKENDS', 'CUSTOM')
    .default('DAILY'),
  customSchedule: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.string()
        .valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')
        .required(),
      isActive: Joi.boolean().default(true),
    })
  ).optional(),
  description: Joi.string().optional().max(500),
}).unknown(false);

// Assign student transport
exports.assignStudentTransportSchema = Joi.object({
  student: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
  }),
  route: Joi.string().required().messages({
    'string.empty': 'Route ID is required',
  }),
  bus: Joi.string().required().messages({
    'string.empty': 'Bus ID is required',
  }),
  pickupStop: Joi.object({
    stopNumber: Joi.number().integer().min(1).required(),
    stopName: Joi.string().required().trim(),
    pickupTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  }).required(),
  dropStop: Joi.object({
    stopNumber: Joi.number().integer().min(1).required(),
    stopName: Joi.string().required().trim(),
    dropTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  }).required(),
  transportFee: Joi.number().min(0).required(),
  academicYear: Joi.string().required().trim(),
  emergencyContact: Joi.object({
    name: Joi.string().required().trim(),
    phone: Joi.string().required().trim(),
    relationship: Joi.string().required().trim(),
  }).required(),
  specialInstructions: Joi.string().optional().max(500),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional(),
}).unknown(false);

// Get student transports (filters)
exports.getStudentTransportsSchema = Joi.object({
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
  student: Joi.string().optional(),
  route: Joi.string().optional(),
  bus: Joi.string().optional(),
  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'SUSPENDED', 'GRADUATED')
    .optional(),
  paymentStatus: Joi.string()
    .valid('PAID', 'PENDING', 'OVERDUE')
    .optional(),
  academicYear: Joi.string().optional(),
}).unknown(true);

