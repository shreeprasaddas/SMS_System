# Database Rules

## Multi-Tenancy (CRITICAL)

**Every single query MUST be scoped by `schoolId`.** Data must never leak between schools.

### ✅ Correct

```javascript
// Controller
Student.find({ schoolId: req.user.schoolId, status: 'ACTIVE' });

// Service
StudentFee.findOneAndUpdate(
  { _id: feeId, schoolId: schoolId },
  { status: 'PAID' }
);

// Always attach schoolId to new documents
await Student.create({ ...req.body, schoolId: req.user.schoolId });
```

### ❌ Wrong (NEVER Do This)

```javascript
// Missing schoolId — SECURITY RISK
Student.find({ status: 'ACTIVE' });

// Could return data from ANY school
StudentFee.findById(feeId);

// No schoolId on create — data isolation failure
await Student.create(req.body);
```

## ObjectId References (Exact Model Names)

Always use the **exact model name as string** for `ref` field:

| Field | Ref | Model File |
|-------|-----|-----------|
| `userId` | `'User'` | `User.model.js` |
| `studentId` | `'Student'` | `Student.model.js` |
| `teacherId` | `'Teacher'` | `Teacher.model.js` |
| `classId` | `'Class'` | `Class.model.js` |
| `sectionId` | `'Section'` | `Section.model.js` |
| `subjectId` | `'Subject'` | `Subject.model.js` |
| `schoolId` | `'SchoolInfo'` | `SchoolInfo.model.js` |
| `examId` | `'Exam'` | `Exam.model.js` |
| `academicYearId` | `'AcademicYear'` | `AcademicYear.model.js` |

### Example

```javascript
const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolInfo' },
});
```

## Key Status Enums (Use Exactly)

### Student Status
```javascript
enum: ['ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'LEFT']
```

### User Roles (11 total)
```javascript
enum: [
  'SUPER_ADMIN',
  'ADMIN',
  'PRINCIPAL',
  'VICE_PRINCIPAL',
  'TEACHER',
  'STUDENT',
  'PARENT',
  'ACCOUNTANT',
  'LIBRARIAN',
  'ADMISSION_OFFICER',
  'HR_MANAGER',
  'TRANSPORT_COORDINATOR',
  'RECEPTIONIST'
]
```

### Attendance Status
```javascript
enum: ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'HOLIDAY', 'LEAVE']
```

### Payment Status
```javascript
enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']
```

### Leave Status
```javascript
enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']
```

### Exam Type
```javascript
enum: ['UNIT_TEST', 'HALF_YEARLY', 'ANNUAL', 'PRACTICAL', 'PROJECT', 'BOARD']
```

### Gender
```javascript
enum: ['MALE', 'FEMALE', 'OTHER']
```

## Indexes (CRITICAL for Performance)

Add MongoDB indexes for **every field** used in queries:

```javascript
// Always index schoolId (appears in every query)
studentSchema.index({ schoolId: 1 });

// Composite index for common filters
studentSchema.index({ schoolId: 1, status: 1 });
studentSchema.index({ classId: 1, sectionId: 1 });

// Unique indexes
studentSchema.index({ studentId: 1 }, { unique: true });
studentSchema.index({ email: 1 }, { unique: true });

// For text search
studentSchema.index({ firstName: 'text', lastName: 'text' });
```

### Performance Rules

- ✅ Index fields used in `.find()` filters
- ✅ Index fields used in `.sort()`
- ✅ Use compound indexes for common combinations
- ✅ Use `.lean()` on read-only queries (2-5x faster)
- ❌ Don't over-index (slows writes)
- ❌ Don't skip schoolId index

### .lean() Usage

```javascript
// ✅ Use .lean() when you don't need Mongoose methods
const students = await Student.find({ schoolId }).lean();

// ❌ Don't use .lean() when you'll call .save() or modify document
const student = await Student.findById(id); // returns full Mongoose doc
```

## Pagination

Every list endpoint **must** paginate. Never return unbounded arrays:

```javascript
// ✅ Always paginate
const page = req.query.page || 1;
const limit = req.query.limit || 20;
const skip = (page - 1) * limit;

const [data, total] = await Promise.all([
  Student.find(filter).skip(skip).limit(limit),
  Student.countDocuments(filter)
]);

res.json({
  data,
  pagination: {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / limit)
  }
});

// ❌ Never do this
const students = await Student.find(filter); // Could be 100,000 docs!
```

## Connection & Pool

**Location:** `backend/src/config/database.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Transactions (Multi-Document ACID)

For operations that span multiple documents:

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  const student = await Student.findById(studentId, {}, { session });
  await StudentFee.updateMany(
    { studentId },
    { status: 'WAIVED' },
    { session }
  );
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

## Query Patterns

### Common Filters

```javascript
// With sorting and lean
const students = await Student.find({
  schoolId,
  status: 'ACTIVE',
  classId: { $in: classIds }
})
  .sort({ rollNumber: 1 })
  .lean();

// Text search
const results = await Student.find({
  schoolId,
  $text: { $search: req.query.search }
});

// Range query
const fees = await StudentFee.find({
  schoolId,
  dueDate: { $gte: startDate, $lte: endDate }
});

// Nested field
const admissions = await Admission.find({
  schoolId,
  'contact.email': 'john@example.com'
});

// Array contains
const students = await Student.find({
  schoolId,
  tags: 'scholarship'
});
```

### Aggregation Example

```javascript
const stats = await StudentAttendance.aggregate([
  { $match: { schoolId: ObjectId(schoolId), month: 'March' } },
  { $group: {
      _id: '$studentId',
      presentDays: { $sum: { $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0] } },
      absentDays: { $sum: { $cond: [{ $eq: ['$status', 'ABSENT'] }, 1, 0] } }
    }
  },
  { $sort: { presentDays: -1 } }
]);
```

## Data Validation

Always validate at the schema level:

```javascript
const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/
  },
  phone: {
    type: String,
    validate: {
      validator: (v) => /^\d{10}$/.test(v),
      message: 'Phone must be 10 digits'
    }
  },
  age: {
    type: Number,
    min: 5,
    max: 25
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
});
```

## Environment Variables

**Location:** `backend/src/config/environment.js`

```javascript
// Read from env, never hardcode
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  RAZORPAY_KEY: process.env.RAZORPAY_KEY,
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET,
  TWILIO_SID: process.env.TWILIO_SID,
  TWILIO_TOKEN: process.env.TWILIO_TOKEN,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};
```

### Frontend Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_KEY=...
REACT_APP_FILE_SIZE_LIMIT=5242880
```

---

**End of Database Rules**
