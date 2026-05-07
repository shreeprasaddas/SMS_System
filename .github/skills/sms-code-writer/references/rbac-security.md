# RBAC & Security

## User Roles (11 Total)

Every user has exactly one role. Enforce in every route and component.

| Role | Purpose | Can Access |
|------|---------|-----------|
| `SUPER_ADMIN` | System superuser | Everything |
| `ADMIN` | School admin | All school data, settings, users |
| `PRINCIPAL` | School principal | Academic data, reports, announcements |
| `VICE_PRINCIPAL` | Assistant principal | Academic data, discipline, partial settings |
| `TEACHER` | Classroom teacher | Attendance, grades, assignments, class roster |
| `STUDENT` | Enrolled student | Own grades, attendance, timetable, assignments |
| `PARENT` | Student guardian | Child's grades, attendance, fees, reports |
| `ACCOUNTANT` | Finance staff | All finance modules (fees, payroll, expenses) |
| `LIBRARIAN` | Library staff | Library catalog, issues, fines, inventory |
| `ADMISSION_OFFICER` | Admissions staff | Admission forms, applicant management |
| `HR_MANAGER` | HR staff | Employee records, payroll, leave, recruitment |
| `TRANSPORT_COORDINATOR` | Transport staff | Bus routes, attendance, driver management |
| `RECEPTIONIST` | Front desk | Visitor logs, basic student queries, announcements |

## Backend: Route Authorization

Every route **must** declare which roles can access it.

### Pattern

```javascript
router.get('/',
  authenticate,                    // 1. Must be logged in
  authorize(['ADMIN', 'TEACHER']), // 2. Only these roles
  validate(schema),                 // 3. Validate request
  controller.method                 // 4. Handler
);
```

### Examples

```javascript
// Student list — only admin & teachers
router.get('/',
  authorize(['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER']),
  studentController.getAllStudents
);

// Create student — only admission officer & admin
router.post('/',
  authorize(['SUPER_ADMIN', 'ADMIN', 'ADMISSION_OFFICER']),
  validate(createStudentSchema),
  studentController.createStudent
);

// Student owns their own data
router.get('/:id',
  authorize(['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER', 'PARENT', 'STUDENT']),
  studentController.getStudentById // Must verify req.params.id belongs to req.user.studentId
);

// Sensitive action — admin only
router.delete('/:id',
  authorize(['SUPER_ADMIN', 'ADMIN']),
  studentController.deleteStudent
);
```

## Frontend: Permission Checks

Every component/page **must** check permissions before rendering sensitive content.

### usePermission Hook

```javascript
import { usePermission } from '../hooks/usePermission';

const Dashboard = () => {
  const { can, canAny, canAll, role } = usePermission();

  return (
    <div>
      {can('VIEW_STUDENTS') && <StudentList />}
      {canAny('VIEW_FEES', 'MANAGE_FEES') && <FinanceModule />}
      {canAll('VIEW_GRADES', 'PUBLISH_GRADES') && <GradePublisher />}
    </div>
  );
};
```

### RoleGuard Component

```javascript
import { RoleGuard } from '../components/auth/RoleGuard';

const StudentsPage = () => (
  <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER']}>
    <StudentList />
  </RoleGuard>
);
```

### ProtectedRoute (React Router)

```javascript
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

<Routes>
  <Route
    path="/students"
    element={
      <ProtectedRoute allowed={['ADMIN', 'TEACHER']}>
        <StudentsPage />
      </ProtectedRoute>
    }
  />
</Routes>
```

## JWT Structure

**Access Token** (expires in 15 min)

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "ADMIN",
  "schoolId": "507f1f77bcf86cd799439012",
  "email": "admin@school.com",
  "iat": 1234567890,
  "exp": 1234568890
}
```

**Refresh Token** (expires in 7 days, stored securely)

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1234567890,
  "exp": 1234567890 + 7*24*60*60
}
```

## Password Security

```javascript
const bcrypt = require('bcryptjs');

// Hash on create
const hashedPassword = await bcrypt.hash(password, 12);
const user = await User.create({ ...data, password: hashedPassword });

// Compare on login
const isMatch = await bcrypt.compare(inputPassword, user.password);

// Never return password in responses
User.find().select('-password');

// Force logout on password change
// Generate new refresh token, invalidate old sessions
```

## MFA (TOTP)

Two-Factor Authentication via Time-Based One-Time Password:

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// 1. Generate secret on setup
const secret = speakeasy.generateSecret({
  name: `SMS (${email})`,
  length: 32
});

// 2. Return QR code to user
const qr = await QRCode.toDataURL(secret.otpauth_url);

// 3. Verify TOTP on login
const isValid = speakeasy.totp.verify({
  secret: user.totpSecret,
  encoding: 'base32',
  token: userInput
});
```

## Data Ownership

For resources that belong to a user, always verify ownership:

```javascript
// ✅ Correct — student can only see their own grades
exports.getStudentGrades = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      userId: req.user.userId,    // Verify ownership
      schoolId: req.user.schoolId
    });

    if (!student) throw new AppError('Not found', 404);

    const grades = await Grade.find({
      studentId: student._id,
      schoolId: req.user.schoolId
    });

    return responseHelper.success(res, grades);
  } catch (err) {
    next(err);
  }
};
```

## Sensitive Data Masking

Never return sensitive data in responses or logs:

```javascript
// ❌ Wrong
logger.info(`User ${user} logged in with password ${password}`);

// ✅ Correct
logger.info(`User ${user.email} logged in`);

// Mask Aadhaar
const maskedAadhaar = '****' + aadhaar.slice(-4); // Show last 4 only

// Mask SSN
const maskedSSN = '***-**-' + ssn.slice(-4);

// Always exclude password from responses
const userResponse = await User.findById(id).select('-password');
```

## Audit Logging

Log all sensitive operations:

```javascript
// Log model
const auditSchema = new mongoose.Schema({
  schoolId: ObjectId,
  userId: ObjectId,
  action: String,           // 'CREATE', 'UPDATE', 'DELETE'
  resource: String,         // 'Student', 'Fee'
  resourceId: ObjectId,
  changes: Mixed,           // what changed
  timestamp: { type: Date, default: Date.now }
});

// Usage
await AuditLog.create({
  schoolId: req.user.schoolId,
  userId: req.user.userId,
  action: 'DELETE',
  resource: 'Student',
  resourceId: studentId,
  changes: student.toObject()
});
```

## CORS & Headers

```javascript
// config/corsOptions.js
module.exports = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per windowMs
});
app.use(limiter);
```

## File Upload Security

```javascript
const multer = require('multer');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Whitelist extensions
    const allowed = ['pdf', 'doc', 'docx', 'jpg', 'png'];
    const ext = file.originalname.split('.').pop();
    if (!allowed.includes(ext)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Then upload to S3, don't store locally
router.post('/upload', upload.single('file'), async (req, res, next) => {
  // 1. Check file exists
  // 2. Scan for malware (if needed)
  // 3. Upload to S3
  // 4. Delete local file
});
```

## Environment-Specific Rules

### Development
- ✅ CORS: Allow `localhost:3000`
- ✅ Logging: Verbose
- ✅ MFA: Optional
- ✅ Rate limiting: Relaxed

### Production
- ✅ CORS: Whitelist only known domains
- ✅ Logging: Errors only
- ✅ MFA: Enforced for admins
- ✅ Rate limiting: Strict
- ✅ SSL/TLS: Enforced
- ✅ HTTPS: Required
- ✅ Headers: Security headers set

---

**End of RBAC & Security**
