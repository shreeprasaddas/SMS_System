# Backend Patterns (Node.js + Express + Mongoose)

## Models

**Location:** `backend/src/models/<domain>/<Name>.model.js`  
**Naming:** PascalCase + `.model.js`  
**Example:** `Student.model.js`, `StudentFee.model.js`

### Template

```javascript
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Always include schoolId for multi-tenancy
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolInfo', required: true },
  
  // Foreign keys use exact model name
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  
  // Basic fields
  studentId: { type: String, required: true, unique: true },
  rollNumber: { type: Number },
  
  // Enum: SCREAMING_SNAKE_CASE
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'LEFT'],
    default: 'ACTIVE'
  },
  
  // Nested objects
  contact: {
    phone: String,
    emergencyPhone: String
  },
  
  // Dates
  dateOfBirth: { type: Date },
  enrollmentDate: { type: Date, default: Date.now },
  
}, {
  timestamps: true,          // adds createdAt, updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ADD INDEXES for every field used in .find()
studentSchema.index({ schoolId: 1, status: 1 });
studentSchema.index({ classId: 1, sectionId: 1 });
studentSchema.index({ studentId: 1 }, { unique: true });
studentSchema.index({ userId: 1 });

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Student', studentSchema);
```

### Rules

- ✅ Always include `schoolId` for multi-tenancy
- ✅ Always use `timestamps: true`
- ✅ Add indexes for **every** field used in `.find()` filters
- ✅ Ref values must match model name exactly: `ref: 'Student'` not `ref: 'student'`
- ✅ Enum values are `SCREAMING_SNAKE_CASE`
- ❌ Never hardcode values
- ❌ Don't put business logic in schemas

## Controllers

**Location:** `backend/src/controllers/<domain>.controller.js`  
**Naming:** camelCase + `.controller.js`  
**Example:** `student.controller.js`, `fee.controller.js`

### Template

```javascript
const Student = require('../models/user/Student.model');
const { responseHelper } = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');

// GET /api/v1/students — list with pagination
exports.getAllStudents = async (req, res, next) => {
  try {
    const { classId, status, page = 1, limit = 20, search } = req.query;
    
    // Always filter by schoolId
    const filter = { schoolId: req.user.schoolId };
    if (classId) filter.classId = classId;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    
    // Use Promise.all for parallel queries
    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate('userId', 'firstName lastName email profilePhoto')
        .populate('classId', 'name')
        .populate('sectionId', 'name')
        .skip(skip)
        .limit(Number(limit))
        .lean(),  // Use .lean() for read-only queries (2-5x faster)
      Student.countDocuments(filter)
    ]);

    return responseHelper.paginated(res, students, { page, limit, total });
  } catch (err) {
    next(err);  // Pass to global error middleware
  }
};

// POST /api/v1/students — create
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create({ 
      ...req.body, 
      schoolId: req.user.schoolId 
    });
    return responseHelper.created(res, student, 'Student created successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/students/:id — get one
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId  // Always scope
    }).populate('userId classId sectionId');
    
    if (!student) throw new AppError('Student not found', 404);
    
    return responseHelper.success(res, student);
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/students/:id — full update
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.user.schoolId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!student) throw new AppError('Student not found', 404);
    
    return responseHelper.success(res, student, 'Student updated successfully');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/students/:id
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      schoolId: req.user.schoolId
    });
    
    if (!student) throw new AppError('Student not found', 404);
    
    return responseHelper.success(res, null, 'Student deleted successfully');
  } catch (err) {
    next(err);
  }
};
```

### Rules

- ✅ Always wrap in try/catch and pass errors to `next(err)`
- ✅ Always scope queries by `req.user.schoolId`
- ✅ Use `.lean()` for read-only queries
- ✅ Use `Promise.all()` for parallel DB calls
- ✅ Use `responseHelper` for all responses
- ✅ Throw `AppError` for errors
- ❌ Never put complex business logic in controllers (move to services)
- ❌ Never return password or sensitive fields

## Services

**Location:** `backend/src/services/<domain>.service.js`  
**Naming:** camelCase + `.service.js`  
**Example:** `fee.service.js`, `attendance.service.js`

### Template

```javascript
const Student = require('../models/user/Student.model');
const StudentFee = require('../models/finance/StudentFee.model');
const Invoice = require('../models/finance/Invoice.model');
const notificationService = require('./notification.service');

/**
 * Generate monthly fee invoices for all active students in a school
 * Complex multi-step business logic lives HERE, never in controller
 * @param {string} schoolId
 * @param {string} month  - 'YYYY-MM'
 * @returns {Promise<Array>} array of created invoices
 */
exports.generateMonthlyInvoices = async (schoolId, month) => {
  // 1. Find all active students
  const students = await Student.find({ 
    schoolId, 
    status: 'ACTIVE' 
  });

  // 2. Create invoices
  const invoices = await Promise.all(
    students.map(s => Invoice.create({ 
      studentId: s._id, 
      schoolId, 
      month,
      amount: 50000, // ₹500
      dueDate: new Date(month + '-15')
    }))
  );

  // 3. Send notifications
  await notificationService.sendBulk(
    students, 
    'Fee invoice generated',
    { invoiceCount: invoices.length }
  );

  return invoices;
};

/**
 * Calculate total fee due for a student
 * @param {string} studentId
 * @returns {Promise<number>} total outstanding fee in paise
 */
exports.calculateFeeDue = async (studentId) => {
  const fees = await StudentFee.find({ 
    studentId, 
    status: 'PENDING' 
  });
  
  return fees.reduce((sum, f) => sum + f.amount, 0);
};

/**
 * Apply concession to student fee
 * @param {string} studentId
 * @param {number} percentage (0-100)
 * @param {string} reason
 */
exports.applyFeeConcession = async (studentId, percentage, reason) => {
  // Validate
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }

  // Find student to get schoolId
  const student = await Student.findById(studentId);
  if (!student) throw new Error('Student not found');

  // Update all pending fees
  return StudentFee.updateMany(
    { studentId, status: 'PENDING', schoolId: student.schoolId },
    { 
      $set: { 
        concessionPercentage: percentage, 
        concessionReason: reason,
        appliedAt: Date.now()
      }
    }
  );
};
```

### Rules

- ✅ Services contain all complex/reusable business logic
- ✅ Services never touch `req` or `res` — they are pure functions
- ✅ Services can call other services
- ✅ One service file per domain
- ✅ Document functions with JSDoc
- ✅ Always throw errors (don't catch/swallow)
- ❌ No database queries in controllers
- ❌ Don't mix services and controllers

## Routes

**Location:** `backend/src/routes/<domain>.routes.js`  
**Naming:** camelCase + `.routes.js`  
**Example:** `student.routes.js`, `attendance.routes.js`

### Template

```javascript
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const { createStudentSchema, updateStudentSchema } = require('../validations/student.validation');

// All routes require authentication
router.use(authenticate);

// Declare allowed roles for each route
router.get('/',
  authorize(['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER']),
  studentController.getAllStudents
);

router.post('/',
  authorize(['SUPER_ADMIN', 'ADMIN', 'ADMISSION_OFFICER']),
  validate(createStudentSchema),
  studentController.createStudent
);

router.get('/:id',
  authorize(['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER', 'PARENT', 'STUDENT']),
  studentController.getStudentById
);

router.put('/:id',
  authorize(['SUPER_ADMIN', 'ADMIN']),
  validate(updateStudentSchema),
  studentController.updateStudent
);

router.delete('/:id',
  authorize(['SUPER_ADMIN', 'ADMIN']),
  studentController.deleteStudent
);

// Nested actions
router.post('/:id/promote',
  authorize(['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL']),
  studentController.promoteStudent
);

router.get('/:id/attendance',
  authorize(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT']),
  studentController.getAttendance
);

module.exports = router;
```

### Rules

- ✅ Every route declares its allowed roles in `authorize([...])`
- ✅ Validate request body with `validate(schema)` middleware
- ✅ All routes start with `authenticate` middleware
- ✅ Nest related resources under parent ID: `/students/:id/attendance`
- ✅ Use standard HTTP methods: GET list/read, POST create, PUT full update, DELETE delete
- ❌ Never skip authorization
- ❌ Don't mix unrelated routes in one file

## Validations (Joi)

**Location:** `backend/src/validations/<domain>.validation.js`  
**Naming:** camelCase + `.validation.js`

### Template

```javascript
const Joi = require('joi');

exports.createStudentSchema = Joi.object({
  firstName:   Joi.string().min(2).max(50).required(),
  lastName:    Joi.string().min(2).max(50).required(),
  dateOfBirth: Joi.date().iso().max('now').required(),
  gender:      Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
  classId:     Joi.string().hex().length(24).required(),
  sectionId:   Joi.string().hex().length(24),
  rollNumber:  Joi.number().integer().min(1).max(100),
  email:       Joi.string().email().required(),
  phone:       Joi.string().pattern(/^\d{10}$/).required(),
  status:      Joi.string().valid('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'LEFT')
}).required();

exports.updateStudentSchema = Joi.object({
  firstName:   Joi.string().min(2).max(50),
  lastName:    Joi.string().min(2).max(50),
  dateOfBirth: Joi.date().iso(),
  gender:      Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  classId:     Joi.string().hex().length(24),
  status:      Joi.string().valid('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'LEFT'),
  // All fields optional for update
}).min(1);  // At least one field required

exports.promoteStudentSchema = Joi.object({
  newClassId: Joi.string().hex().length(24).required(),
  newSectionId: Joi.string().hex().length(24),
  newRollNumber: Joi.number().integer().min(1).max(100),
}).required();
```

### Rules

- ✅ Always validate create/update/delete payloads
- ✅ Required fields use `.required()`
- ✅ Optional updates use `.min(1)` to ensure at least one field
- ✅ Validate format: emails, phone (regex), dates (`.iso()`), ObjectIds (`.hex().length(24)`)
- ✅ Enum fields use `.valid('OPTION1', 'OPTION2')`
- ❌ Never skip validation for complex fields

## Middleware

**Location:** `backend/src/middleware/<name>.middleware.js`  
**Naming:** camelCase + `.middleware.js`

### Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHelper');

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new AppError('No token provided', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, schoolId, email }
    next();
  } catch (err) {
    next(new AppError('Invalid token', 401));
  }
};
```

### Authorization Middleware

```javascript
const { AppError } = require('../utils/errorHelper');

exports.authorize = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError('Access denied', 403));
  }
  next();
};
```

### Validation Middleware

```javascript
const { AppError } = require('../utils/errorHelper');

exports.validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  req.body = value;
  next();
};
```

## Response Helper

**Location:** `backend/src/utils/responseHelper.js`

```javascript
exports.responseHelper = {
  success: (res, data, message = 'Success') =>
    res.status(200).json({ success: true, message, data }),
  
  created: (res, data, message = 'Created') =>
    res.status(201).json({ success: true, message, data }),
  
  paginated: (res, data, { page, limit, total }) =>
    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }),
  
  error: (res, message, statusCode = 400) =>
    res.status(statusCode).json({ success: false, message }),
};
```

### Rules

- ✅ Always use response helper for consistent shape
- ✅ All responses have `{ success, message, data }`
- ✅ Paginated endpoints include `pagination` object
- ❌ Never use `res.json()` directly

## Jobs (Bull + Redis)

**Location:** `backend/src/jobs/<name>.job.js`

```javascript
const Queue = require('bull');
const cron = require('node-cron');
const feeService = require('../services/fee.service');

const feeReminderQueue = new Queue('feeReminder', process.env.REDIS_URL);

// Process jobs
feeReminderQueue.process(async (job) => {
  const { schoolId } = job.data;
  await feeService.sendReminders(schoolId);
});

// Schedule: run every day at 9 AM
cron.schedule('0 9 * * *', () => {
  feeReminderQueue.add(
    { schoolId: 'all' },
    { attempts: 3, backoff: 5000 }
  );
});

module.exports = feeReminderQueue;
```

## Sockets (Socket.IO)

**Location:** `backend/src/sockets/<name>.socket.js`

```javascript
module.exports = (io) => {
  io.on('connection', (socket) => {
    const { userId, role, schoolId } = socket.user; // set by socket auth middleware

    // Join room
    socket.on('join:room', (roomId) => {
      socket.join(roomId);
    });

    // Send message
    socket.on('message:send', async ({ roomId, content }) => {
      const msg = await Message.create({
        senderId: userId,
        roomId,
        content,
        schoolId
      });
      io.to(roomId).emit('message:new', msg);
    });

    socket.on('disconnect', () => {
      // Cleanup
    });
  });
};
```

### Rules

- ✅ Event names: `resource:action` (e.g., `attendance:marked`, `grade:published`)
- ✅ Always scope by `schoolId`
- ✅ Emit events only to authorized rooms

---

**End of Backend Patterns**
