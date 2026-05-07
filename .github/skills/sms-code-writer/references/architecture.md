# Architecture & End-to-End Flows

This file shows how multiple files work together to implement complete features.

## Flow 1: Student CRUD

Shows: Model → Controller → Service → Route → Frontend Component

### Backend: Model

```javascript
// models/user/Student.model.js
const studentSchema = new mongoose.Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'SchoolInfo', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  studentId: { type: String, required: true, unique: true },
  rollNumber: Number,
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'GRADUATED'], default: 'ACTIVE' },
}, { timestamps: true });

studentSchema.index({ schoolId: 1, status: 1 });
studentSchema.index({ studentId: 1 }, { unique: true });
```

### Backend: Validation

```javascript
// validations/student.validation.js
exports.createStudentSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  classId: Joi.string().hex().length(24).required(),
  studentId: Joi.string().required(),
  email: Joi.string().email().required(),
});
```

### Backend: Service (if complex logic)

```javascript
// services/student.service.js
exports.createStudentWithUser = async (schoolId, studentData, userData) => {
  // 1. Create user first
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  const user = await User.create({
    ...userData,
    password: hashedPassword,
    schoolId,
    role: 'STUDENT'
  });

  // 2. Create student record linked to user
  const student = await Student.create({
    ...studentData,
    userId: user._id,
    schoolId
  });

  return { student, user };
};
```

### Backend: Controller

```javascript
// controllers/student.controller.js
exports.createStudent = async (req, res, next) => {
  try {
    const { studentData, userData } = req.body;

    // 1. Validate
    const { error, value } = createStudentSchema.validate(studentData);
    if (error) throw new AppError(error.message, 400);

    // 2. Call service (if any complex logic)
    const result = await studentService.createStudentWithUser(
      req.user.schoolId,
      studentData,
      userData
    );

    // 3. Return response
    return responseHelper.created(res, result.student, 'Student created');
  } catch (err) {
    next(err);
  }
};

exports.getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, classId, status, search } = req.query;

    const filter = { schoolId: req.user.schoolId };
    if (classId) filter.classId = classId;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate('userId', 'firstName lastName email')
        .populate('classId', 'name')
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Student.countDocuments(filter)
    ]);

    return responseHelper.paginated(res, students, { page, limit, total });
  } catch (err) {
    next(err);
  }
};
```

### Backend: Route

```javascript
// routes/student.routes.js
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const studentController = require('../controllers/student.controller');
const { createStudentSchema } = require('../validations/student.validation');

router.use(authenticate);

router.get('/',
  authorize(['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER']),
  studentController.getAllStudents
);

router.post('/',
  authorize(['SUPER_ADMIN', 'ADMIN', 'ADMISSION_OFFICER']),
  validate(createStudentSchema),
  studentController.createStudent
);

module.exports = router;
```

### Frontend: RTK Query API

```javascript
// store/api/studentApi.js
export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: (params) => ({ url: '/students', params }),
      providesTags: ['Student'],
    }),
    createStudent: builder.mutation({
      query: (body) => ({ url: '/students', method: 'POST', body }),
      invalidatesTags: ['Student'],
    }),
  }),
});

export const { useGetStudentsQuery, useCreateStudentMutation } = studentApi;
```

### Frontend: Component

```javascript
// components/student/StudentList/StudentList.jsx
import { useGetStudentsQuery } from '../../../store/api/studentApi';
import StudentForm from '../StudentForm/StudentForm';

const StudentList = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const { data, isLoading, isError, error } = useGetStudentsQuery(filters);

  if (isLoading) return <Spinner />;
  if (isError) return <EmptyState message={error?.data?.message} />;

  return (
    <div>
      {data?.data.map(student => (
        <StudentCard key={student._id} student={student} />
      ))}
    </div>
  );
};

export default StudentList;
```

### Frontend: Page

```javascript
// pages/students/StudentsPage.jsx
import { RoleGuard } from '../../components/auth/RoleGuard';
import { PageHeader } from '../../components/layout/PageHeader';
import { StudentList } from '../../components/student/StudentList';

const StudentsPage = () => (
  <RoleGuard allowed={['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER']}>
    <PageHeader title="Students" breadcrumb={['Home', 'Students']} />
    <StudentList />
  </RoleGuard>
);

export default StudentsPage;
```

---

## Flow 2: Fee Payment with Job Queue

Shows: Service → Mutation → Queue + Notification

### Backend: Service

```javascript
// services/fee.service.js
exports.processFeePayment = async (schoolId, studentId, paymentId, amount) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Update fee status
    const fee = await StudentFee.findOneAndUpdate(
      { studentId, schoolId, status: 'PENDING' },
      { status: 'COMPLETED', paymentId },
      { session, new: true }
    );

    if (!fee) throw new AppError('Fee not found', 404);

    // 2. Create payment record
    const payment = await Payment.create(
      [{ studentId, schoolId, amount, feeId: fee._id, status: 'COMPLETED' }],
      { session }
    );

    // 3. Send notification (queued)
    await notificationQueue.add({
      type: 'FEE_PAID',
      studentId,
      schoolId,
      amount
    });

    await session.commitTransaction();
    return fee;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
```

### Backend: Controller

```javascript
// controllers/fee.controller.js
exports.processFeePayment = async (req, res, next) => {
  try {
    const { studentId, amount, paymentMethod } = req.body;

    // 1. Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `fee-${Date.now()}`
    });

    // 2. Store order for verification
    await PaymentOrder.create({
      schoolId: req.user.schoolId,
      studentId,
      orderId: order.id,
      amount
    });

    return responseHelper.success(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyFeePayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // 1. Verify signature
    const isValid = razorpay.payments.verify({
      orderId,
      paymentId,
      signature
    });

    if (!isValid) throw new AppError('Invalid payment', 400);

    // 2. Process fee update (calls service)
    const fee = await feeService.processFeePayment(
      req.user.schoolId,
      req.body.studentId,
      paymentId,
      req.body.amount
    );

    return responseHelper.success(res, fee, 'Payment completed');
  } catch (err) {
    next(err);
  }
};
```

### Backend: Job Queue

```javascript
// jobs/feeNotificationJob.js
const Queue = require('bull');
const notificationService = require('../services/notification.service');

const feeNotificationQueue = new Queue('feeNotification', process.env.REDIS_URL);

feeNotificationQueue.process(async (job) => {
  const { type, studentId, schoolId, amount } = job.data;

  try {
    if (type === 'FEE_PAID') {
      // Send email & SMS
      const student = await Student.findById(studentId)
        .populate('userId');

      await notificationService.sendEmail({
        to: student.userId.email,
        subject: 'Fee Payment Received',
        template: 'feeReceipt',
        data: { amount, studentId: student.studentId }
      });

      await notificationService.sendSMS({
        to: student.contact.phone,
        message: `Fee payment of ₹${amount} received. Thank you!`
      });
    }
  } catch (err) {
    logger.error('Fee notification failed:', err);
    throw err; // Retry the job
  }
});

module.exports = feeNotificationQueue;
```

### Frontend: Payment Component

```javascript
// components/finance/FeePayment/FeePayment.jsx
import { useCreatePaymentMutation } from '../../../store/api/feeApi';

const FeePayment = ({ fee }) => {
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const handlePayment = async () => {
    try {
      // 1. Create order
      const { data: orderData } = await createPayment({
        studentId: fee.studentId,
        amount: fee.amount
      }).unwrap();

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'School Management System',
        order_id: orderData.orderId,
        handler: (response) => {
          // 3. Verify payment
          verifyPayment(response);
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading}>
      {isLoading ? 'Processing...' : `Pay ₹${fee.amount}`}
    </Button>
  );
};
```

---

## Flow 3: Attendance Marking with WebSocket

Shows: Socket.IO real-time sync

### Backend: Socket Handler

```javascript
// sockets/attendance.socket.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    const { userId, role, schoolId } = socket.user;

    // Join room for class
    socket.on('join:class', (classId) => {
      socket.join(`class-${classId}`);
    });

    // Mark attendance for a student
    socket.on('attendance:mark', async ({ classId, studentId, status }) => {
      try {
        // Verify permissions
        if (!['TEACHER', 'ADMIN'].includes(role)) {
          throw new Error('Not authorized');
        }

        // Mark attendance
        const attendance = await StudentAttendance.create({
          schoolId,
          classId,
          studentId,
          status,
          date: new Date()
        });

        // Broadcast to all connected teachers/admins in this class
        io.to(`class-${classId}`).emit('attendance:marked', {
          studentId,
          status,
          timestamp: new Date()
        });

        // Notify student
        io.to(`student-${studentId}`).emit('notification:new', {
          type: 'ATTENDANCE_MARKED',
          message: `Your attendance has been marked as ${status}`
        });

        socket.emit('attendance:success', attendance);
      } catch (err) {
        socket.emit('attendance:error', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      // Cleanup
    });
  });
};
```

### Frontend: Real-Time Component

```javascript
// components/attendance/AttendanceMarker/AttendanceMarker.jsx
import { useEffect } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import { useGetClassStudentsQuery } from '../../../store/api/classApi';

const AttendanceMarker = ({ classId }) => {
  const { socket } = useSocket();
  const { data: students } = useGetClassStudentsQuery(classId);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    if (!socket) return;

    // Join the class room
    socket.emit('join:class', classId);

    // Listen for real-time updates
    socket.on('attendance:marked', (data) => {
      console.log(`${data.studentId} marked as ${data.status}`);
      // Update local state
    });

    return () => {
      socket.off('attendance:marked');
    };
  }, [socket, classId]);

  const markAttendance = (studentId, status) => {
    // Send to server via WebSocket
    socket.emit('attendance:mark', { classId, studentId, status });

    // Optimistic update
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <div>
      {students?.map(student => (
        <AttendanceRow
          key={student._id}
          student={student}
          status={attendance[student._id]}
          onMark={markAttendance}
        />
      ))}
    </div>
  );
};
```

---

## Flow 4: Report Generation with Aggregation

Shows: Service → Aggregation Pipeline → PDF Generation

### Backend: Service

```javascript
// services/report.service.js
exports.generateGradeReport = async (schoolId, classId, examId) => {
  // Complex aggregation pipeline
  const report = await Grade.aggregate([
    // 1. Match exam & class
    {
      $match: {
        schoolId: ObjectId(schoolId),
        classId: ObjectId(classId),
        examId: ObjectId(examId)
      }
    },
    // 2. Lookup student details
    {
      $lookup: {
        from: 'students',
        localField: 'studentId',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    // 3. Group by subject
    {
      $group: {
        _id: '$subjectId',
        students: {
          $push: {
            name: '$student.rollNumber',
            marks: '$marks',
            grade: '$grade'
          }
        },
        avgMarks: { $avg: '$marks' },
        maxMarks: { $max: '$marks' },
        minMarks: { $min: '$marks' }
      }
    },
    // 4. Sort
    { $sort: { avgMarks: -1 } }
  ]);

  return report;
};

exports.generatePDFReport = async (reportData) => {
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();

  doc.fontSize(20).text('Grade Report', 100, 100);
  doc.fontSize(12);

  reportData.forEach(subject => {
    doc.text(`Subject: ${subject.subjectName}`);
    doc.text(`Class Average: ${subject.avgMarks}`);
    // Add more content
  });

  return doc; // Convert to buffer
};
```

### Backend: Controller

```javascript
// controllers/report.controller.js
exports.downloadGradeReport = async (req, res, next) => {
  try {
    const { classId, examId } = req.params;

    // 1. Generate report data
    const reportData = await reportService.generateGradeReport(
      req.user.schoolId,
      classId,
      examId
    );

    // 2. Generate PDF
    const pdfDoc = await reportService.generatePDFReport(reportData);

    // 3. Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

    // 4. Pipe to response
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    next(err);
  }
};
```

---

## Dependency Diagram

```
┌─────────────────────────────────────────┐
│         React Frontend                  │
│  ┌──────────────────────────────────┐   │
│  │  Pages (route-level)             │   │
│  │  ├── StudentsPage.jsx            │   │
│  │  └── AttendancePage.jsx          │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  Components (UI + Logic)         │   │
│  │  ├── StudentList                 │   │
│  │  ├── AttendanceMarker            │   │
│  │  └── FeePayment                  │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  RTK Query (Data Fetching)       │   │
│  │  ├── studentApi                  │   │
│  │  ├── attendanceApi               │   │
│  │  └── feeApi                      │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  Custom Hooks                    │   │
│  │  ├── usePermission()             │   │
│  │  ├── useSocket()                 │   │
│  │  └── useAuth()                   │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  Redux Slices (UI State)         │   │
│  │  └── uiSlice.js                  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
          ↓ (HTTP + WebSocket)
┌─────────────────────────────────────────┐
│      Express Backend                    │
│  ┌──────────────────────────────────┐   │
│  │  Routes (route definitions)      │   │
│  │  ├── student.routes.js           │   │
│  │  ├── attendance.routes.js        │   │
│  │  └── fee.routes.js               │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  Middleware Chain                │   │
│  │  ├── authenticate                │   │
│  │  ├── authorize                   │   │
│  │  └── validate                    │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  Controllers (HTTP handlers)     │   │
│  │  ├── student.controller.js       │   │
│  │  ├── attendance.controller.js    │   │
│  │  └── fee.controller.js           │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  Services (Business Logic)       │   │
│  │  ├── student.service.js          │   │
│  │  ├── fee.service.js              │   │
│  │  └── notification.service.js     │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  Models (Data Schema)            │   │
│  │  ├── Student.model.js            │   │
│  │  ├── StudentAttendance.model.js  │   │
│  │  └── StudentFee.model.js         │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  Jobs & Queues (Background)      │   │
│  │  ├── feeReminder.job.js          │   │
│  │  ├── payrollGeneration.job.js    │   │
│  │  └── Bull Queue (Redis)          │   │
│  └──────────────────────────────────┘   │
│             ↓                            │
│  ┌──────────────────────────────────┐   │
│  │  Sockets (Real-time)             │   │
│  │  ├── attendance.socket.js        │   │
│  │  ├── notification.socket.js      │   │
│  │  └── Socket.IO                   │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
          ↓ (MongoDB)
┌─────────────────────────────────────────┐
│      MongoDB Database                   │
│  ├── Collections (one per model)        │
│  ├── Indexes (for performance)          │
│  └── Transactions (for consistency)     │
└─────────────────────────────────────────┘
```

---

**End of Architecture**
