# MongoDB Collections & Schema Models - School Management System

## Database: school_management_system

---

## 1. USER MODELS

### User Collection
```javascript
// models/user/User.model.js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "role", "schoolId"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { 
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        username: { bsonType: "string" },
        password: { bsonType: "string" },  // hashed
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        phoneNumber: { bsonType: "string" },
        profilePhoto: { bsonType: "string" },  // URL/Path
        role: { 
          enum: ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "VICE_PRINCIPAL", "TEACHER", 
                 "STUDENT", "PARENT", "ACCOUNTANT", "LIBRARIAN", "ADMISSION_OFFICER",
                 "HR_MANAGER", "TRANSPORT_COORDINATOR", "RECEPTIONIST"]
        },
        schoolId: { bsonType: "objectId" },
        isActive: { bsonType: "bool" },
        isEmailVerified: { bsonType: "bool" },
        isPhoneVerified: { bsonType: "bool" },
        lastLogin: { bsonType: "date" },
        loginAttempts: { bsonType: "int" },
        lockedUntil: { bsonType: "date" },
        mfaEnabled: { bsonType: "bool" },
        mfaSecret: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        createdBy: { bsonType: "objectId" },
        deletedAt: { bsonType: "date" }
      }
    }
  }
});

// Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ schoolId: 1 });
db.users.createIndex({ isActive: 1 });
```

### Student Collection
```javascript
// models/user/Student.model.js
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["studentId", "userId", "classId", "schoolId"],
      properties: {
        _id: { bsonType: "objectId" },
        studentId: { bsonType: "string" },  // Unique across school
        userId: { bsonType: "objectId" },   // Reference to User
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        dateOfBirth: { bsonType: "date" },
        gender: { enum: ["MALE", "FEMALE", "OTHER"] },
        bloodGroup: { bsonType: "string" },
        nationality: { bsonType: "string" },
        religion: { bsonType: "string" },
        motherTongue: { bsonType: "string" },
        
        // Enrollment Details
        classId: { bsonType: "objectId" },
        sectionId: { bsonType: "objectId" },
        rollNumber: { bsonType: "int" },
        admissionDate: { bsonType: "date" },
        status: { enum: ["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED", "LEFT"] },
        previousSchool: { bsonType: "string" },
        
        // Contact Information
        email: { bsonType: "string" },
        phoneNumber: { bsonType: "string" },
        secondaryPhone: { bsonType: "string" },
        currentAddress: {
          bsonType: "object",
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            pincode: { bsonType: "string" },
            country: { bsonType: "string" }
          }
        },
        permanentAddress: {
          bsonType: "object",
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            pincode: { bsonType: "string" },
            country: { bsonType: "string" }
          }
        },
        
        // Parent/Guardian Information
        father: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            occupation: { bsonType: "string" },
            email: { bsonType: "string" },
            phoneNumber: { bsonType: "string" }
          }
        },
        mother: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            occupation: { bsonType: "string" },
            email: { bsonType: "string" },
            phoneNumber: { bsonType: "string" }
          }
        },
        guardian: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            relationship: { bsonType: "string" },
            email: { bsonType: "string" },
            phoneNumber: { bsonType: "string" }
          }
        },
        
        // Emergency Contacts
        emergencyContacts: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              relationship: { bsonType: "string" },
              phoneNumber: { bsonType: "string" }
            }
          }
        },
        
        // Health Information
        healthConditions: { bsonType: "array" },
        allergies: { bsonType: "array" },
        physicallyChallenge: { bsonType: "bool" },
        specialRequirements: { bsonType: "string" },
        
        // Category
        category: { enum: ["GENERAL", "SC", "ST", "OBC"] },
        
        schoolId: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        createdBy: { bsonType: "objectId" }
      }
    }
  }
});

// Indexes
db.students.createIndex({ studentId: 1 }, { unique: true });
db.students.createIndex({ userId: 1 }, { unique: true });
db.students.createIndex({ classId: 1 });
db.students.createIndex({ sectionId: 1 });
db.students.createIndex({ email: 1 });
```

### Teacher Collection
```javascript
// models/user/Teacher.model.js
{
  _id: ObjectId,
  employeeId: String (unique),
  userId: ObjectId (ref: User),
  designation: ObjectId (ref: Designation),
  department: ObjectId (ref: Department),
  qualifications: [String],
  certifications: [String],
  joinDate: Date,
  status: String (ACTIVE, INACTIVE, LEAVE, RETIRED),
  experienceYears: Number,
  specialization: String,
  assignedClasses: [ObjectId],  // ref: Class
  assignedSubjects: [ObjectId], // ref: Subject
  officeHours: {
    startTime: String,
    endTime: String,
    days: [String]
  },
  phoneNumber: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Parent Collection
```javascript
// models/user/Parent.model.js
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  parentType: String (FATHER, MOTHER, GUARDIAN),
  relationship: String,
  occupation: String,
  childrenIds: [ObjectId],  // ref: Student
  phoneNumber: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. ACADEMIC MODELS

### Class Collection
```javascript
// models/academic/Class.model.js
{
  _id: ObjectId,
  name: String,  // Class X, Class XII
  classNumber: Number,
  streamId: ObjectId,  // ref: Stream
  academicYearId: ObjectId,  // ref: AcademicYear
  classTeacherId: ObjectId,  // ref: Teacher
  classAdvisorId: ObjectId,  // ref: Teacher
  sections: [ObjectId],  // ref: Section
  totalStrength: Number,
  subjects: [ObjectId],  // ref: Subject
  curriculum: ObjectId,  // ref: Curriculum
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.classes.createIndex({ name: 1, academicYearId: 1 });
db.classes.createIndex({ academicYearId: 1 });
```

### Section Collection
```javascript
// models/academic/Section.model.js
{
  _id: ObjectId,
  name: String,  // A, B, C, etc.
  classId: ObjectId,  // ref: Class
  classTeacherId: ObjectId,  // ref: Teacher
  capacity: Number,
  currentStrength: Number,
  students: [ObjectId],  // ref: Student
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Subject Collection
```javascript
// models/academic/Subject.model.js
{
  _id: ObjectId,
  code: String (unique),
  name: String,
  description: String,
  subjectType: String (CORE, ELECTIVE, COCURRICULAR, SKILL),
  creditHours: Number,
  maxMarks: Number,
  minPassMarks: Number,
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.subjects.createIndex({ code: 1 });
db.subjects.createIndex({ name: 1 });
```

---

## 3. ATTENDANCE MODELS

### Student Attendance Collection
```javascript
// models/attendance/StudentAttendance.model.js
{
  _id: ObjectId,
  studentId: ObjectId,  // ref: Student
  classId: ObjectId,    // ref: Class
  sectionId: ObjectId,  // ref: Section
  date: Date,
  status: String (PRESENT, ABSENT, LEAVE, HALF_DAY),
  remarks: String,
  markedBy: ObjectId,   // ref: Teacher
  markedAt: Date,
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.attendance.createIndex({ studentId: 1, date: 1 });
db.attendance.createIndex({ classId: 1, date: 1 });
db.attendance.createIndex({ date: 1 });
```

### Attendance Rule Collection
```javascript
// models/attendance/AttendanceRule.model.js
{
  _id: ObjectId,
  name: String,
  description: String,
  minimumAttendance: Number (percentage),
  lateMarkTime: String (HH:MM),
  workingDays: [String],  // MON, TUE, WED, etc.
  holidayCalendarId: ObjectId,  // ref: HolidayCalendar
  schoolId: ObjectId,
  isActive: Boolean,
  createdAt: Date
}
```

---

## 4. EXAM & GRADE MODELS

### Exam Collection
```javascript
// models/exam/Exam.model.js
{
  _id: ObjectId,
  name: String,
  examType: String (UNIT_TEST, HALF_YEARLY, FINAL, PRACTICAL, PROJECT),
  description: String,
  academicYearId: ObjectId,
  classIds: [ObjectId],  // ref: Class
  subjectIds: [ObjectId],  // ref: Subject
  startDate: Date,
  endDate: Date,
  totalDuration: Number,  // in minutes
  totalMarks: Number,
  passingMarks: Number,
  admitCardTemplate: ObjectId,
  resultTemplate: ObjectId,
  schoolId: ObjectId,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Grade Collection
```javascript
// models/grades/Grade.model.js
{
  _id: ObjectId,
  studentId: ObjectId,  // ref: Student
  classId: ObjectId,    // ref: Class
  subjectId: ObjectId,  // ref: Subject
  examId: ObjectId,     // ref: Exam
  marksObtained: Number,
  totalMarks: Number,
  percentage: Number,
  gradePoint: Number,
  gradeLetterGrade: String (A+, A, B+, B, C, D, E, F),
  remarks: String,
  enteredBy: ObjectId,  // ref: Teacher
  enteredAt: Date,
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.grades.createIndex({ studentId: 1, examId: 1, subjectId: 1 });
db.grades.createIndex({ classId: 1, examId: 1 });
```

### Report Card Collection
```javascript
// models/grades/ReportCard.model.js
{
  _id: ObjectId,
  studentId: ObjectId,  // ref: Student
  classId: ObjectId,
  academicYearId: ObjectId,
  termId: String (TERM_1, TERM_2, ANNUAL),
  grades: [{
    subjectId: ObjectId,
    marks: Number,
    percentage: Number,
    grade: String,
    teacherRemarks: String
  }],
  totalMarks: Number,
  totalPercentage: Number,
  classRank: Number,
  attendance: Number,
  conductRating: String (EXCELLENT, GOOD, SATISFACTORY, POOR),
  teacherComments: String,
  parentSignature: Boolean,
  reportCardGenerated: Date,
  schoolId: ObjectId,
  createdAt: Date
}
```

---

## 5. FINANCIAL MODELS

### Fee Structure Collection
```javascript
// models/finance/FeeStructure.model.js
{
  _id: ObjectId,
  name: String,
  description: String,
  classId: ObjectId,  // ref: Class
  academicYearId: ObjectId,
  feeComponents: [{
    name: String (TUITION_FEE, DEVELOPMENT_FEE, TRANSPORT_FEE, etc.),
    amount: Number,
    frequency: String (MONTHLY, QUARTERLY, ANNUAL),
    dueDate: String,
    isOptional: Boolean
  }],
  totalAmount: Number,
  applicableFrom: Date,
  applicableTo: Date,
  schoolId: ObjectId,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Student Fees Collection
```javascript
// models/finance/StudentFees.model.js
{
  _id: ObjectId,
  studentId: ObjectId,  // ref: Student
  classId: ObjectId,
  academicYearId: ObjectId,
  feeStructureId: ObjectId,
  feeDetails: [{
    component: String,
    amount: Number,
    dueDate: Date,
    paidAmount: Number,
    outstandingAmount: Number,
    status: String (PAID, PENDING, OVERDUE, PARTIAL),
    paymentDate: Date,
    receiptNumber: String,
    remarks: String
  }],
  totalAmount: Number,
  totalPaid: Number,
  totalOutstanding: Number,
  concession: {
    type: String (PERCENTAGE, FIXED, SCHOLARSHIP),
    amount: Number,
    reason: String,
    approvedBy: ObjectId
  },
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.fees.createIndex({ studentId: 1 });
db.fees.createIndex({ academicYearId: 1 });
db.fees.createIndex({ status: 1 });
```

### Payment Collection
```javascript
// models/finance/Payment.model.js
{
  _id: ObjectId,
  transactionId: String (unique),
  studentId: ObjectId,
  feeId: ObjectId,  // ref: StudentFees
  amount: Number,
  paymentMethod: String (CASH, CHEQUE, CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING),
  paymentDate: Date,
  paymentGateway: String (RAZORPAY, PAYPAL, etc.),
  gatewayTransactionId: String,
  status: String (PENDING, COMPLETED, FAILED, REFUNDED),
  remarks: String,
  receiptGenerated: Boolean,
  receiptNumber: String,
  schoolId: ObjectId,
  createdAt: Date
}

// Indexes
db.payments.createIndex({ transactionId: 1 }, { unique: true });
db.payments.createIndex({ studentId: 1 });
db.payments.createIndex({ paymentDate: 1 });
```

---

## 6. LIBRARY MODELS

### Book Collection
```javascript
// models/library/Book.model.js
{
  _id: ObjectId,
  isbn: String (unique),
  title: String,
  author: String,
  publisher: String,
  edition: String,
  publicationYear: Number,
  category: String (FICTION, NON_FICTION, REFERENCE, TEXTBOOK, etc.),
  subject: String,
  quantity: Number,
  quantityAvailable: Number,
  shelfLocation: String,
  cost: Number,
  purchaseDate: Date,
  language: String,
  pages: Number,
  description: String,
  bookPhoto: String (URL),
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.books.createIndex({ isbn: 1 }, { unique: true });
db.books.createIndex({ title: 1 });
db.books.createIndex({ category: 1 });
```

### Book Issue Collection
```javascript
// models/library/BookIssue.model.js
{
  _id: ObjectId,
  bookId: ObjectId,  // ref: Book
  memberId: ObjectId,  // ref: Student/Staff
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  remarks: String,
  status: String (ISSUED, RETURNED, OVERDUE),
  fineApplicable: Boolean,
  fineAmount: Number,
  schoolId: ObjectId,
  createdAt: Date
}

// Indexes
db.bookissue.createIndex({ memberId: 1 });
db.bookissue.createIndex({ issueDate: 1 });
```

---

## 7. TRANSPORT MODELS

### Bus Collection
```javascript
// models/transport/Bus.model.js
{
  _id: ObjectId,
  registrationNumber: String (unique),
  busNumber: String,
  model: String,
  manufacturer: String,
  registrationDate: Date,
  capacity: Number,
  currentStudents: Number,
  driverId: ObjectId,  // ref: Teacher/Staff
  conductorId: ObjectId,
  routeIds: [ObjectId],  // ref: Route
  fuelType: String (DIESEL, PETROL, CNG),
  lastServiceDate: Date,
  nextServiceDate: Date,
  insurance: {
    policyNumber: String,
    expiryDate: Date,
    agencyName: String
  },
  fitness: {
    certificateNumber: String,
    expiryDate: Date
  },
  pollution: {
    certificateNumber: String,
    expiryDate: Date
  },
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.buses.createIndex({ registrationNumber: 1 }, { unique: true });
```

### Route Collection
```javascript
// models/transport/Route.model.js
{
  _id: ObjectId,
  name: String,
  routeNumber: String,
  startPoint: String,
  endPoint: String,
  totalDistance: Number,
  estimatedTime: Number,  // in minutes
  stops: [{
    stopNumber: Number,
    stopName: String,
    latitude: Number,
    longitude: Number,
    arrivalTime: String (HH:MM),
    departureTime: String (HH:MM)
  }],
  fee: Number,
  busIds: [ObjectId],  // ref: Bus
  studentCount: Number,
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.routes.createIndex({ name: 1 });
```

---

## 8. HOSTEL MODELS

### Hostel Collection
```javascript
// models/hostel/Hostel.model.js
{
  _id: ObjectId,
  name: String,
  type: String (BOYS, GIRLS, MIXED),
  totalRooms: Number,
  totalCapacity: Number,
  currentOccupancy: Number,
  manager: ObjectId,  // ref: Staff
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  contactNumber: String,
  facilities: [String],  // WIFI, MESS, LAUNDRY, etc.
  rules: String,
  monthlyFee: Number,
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Room Collection
```javascript
// models/hostel/Room.model.js
{
  _id: ObjectId,
  roomNumber: String (unique),
  hostelId: ObjectId,  // ref: Hostel
  roomType: String (SINGLE, DOUBLE, TRIPLE),
  capacity: Number,
  currentOccupancy: Number,
  floor: Number,
  students: [ObjectId],  // ref: Student
  amenities: [String],
  monthlyFee: Number,
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.rooms.createIndex({ roomNumber: 1 }, { unique: true });
db.rooms.createIndex({ hostelId: 1 });
```

---

## 9. HR & PAYROLL MODELS

### Staff Collection
```javascript
// models/hr/Staff.model.js
{
  _id: ObjectId,
  employeeId: String (unique),
  userId: ObjectId,  // ref: User
  designation: ObjectId,  // ref: Designation
  department: ObjectId,  // ref: Department
  joinDate: Date,
  employmentType: String (FULL_TIME, PART_TIME, CONTRACT),
  status: String (ACTIVE, INACTIVE, LEAVE, RETIRED),
  experience: Number,
  qualifications: [String],
  certifications: [String],
  reportingManager: ObjectId,  // ref: Staff
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountType: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  phoneNumber: String,
  email: String,
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.staff.createIndex({ employeeId: 1 }, { unique: true });
```

### Payroll Collection
```javascript
// models/hr/Payroll.model.js
{
  _id: ObjectId,
  staffId: ObjectId,  // ref: Staff
  payrollMonth: Date,
  basicSalary: Number,
  allowances: {
    dearness: Number,
    houseRent: Number,
    medical: Number,
    conveyance: Number,
    other: Number
  },
  deductions: {
    pf: Number,
    gst: Number,
    incomeTax: Number,
    professionalTax: Number,
    other: Number
  },
  totalAllowances: Number,
  totalDeductions: Number,
  grossSalary: Number,
  netSalary: Number,
  paymentDate: Date,
  paymentStatus: String (PENDING, COMPLETED, FAILED),
  remarks: String,
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.payroll.createIndex({ staffId: 1, payrollMonth: 1 });
```

---

## 10. COMMUNICATION MODELS

### Announcement Collection
```javascript
// models/communication/Announcement.model.js
{
  _id: ObjectId,
  title: String,
  content: String,
  type: String (ACADEMIC, CIRCULAR, EVENT, EMERGENCY, HOLIDAY),
  priority: String (LOW, MEDIUM, HIGH),
  targetAudience: [String],  // STUDENTS, TEACHERS, PARENTS, STAFF
  classIds: [ObjectId],  // ref: Class (if specific classes)
  attachments: [String],  // URLs
  postedBy: ObjectId,  // ref: User
  postedDate: Date,
  startDate: Date,
  endDate: Date,
  isPublished: Boolean,
  schoolId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.announcements.createIndex({ postedDate: -1 });
db.announcements.createIndex({ schoolId: 1 });
```

### Message Collection
```javascript
// models/communication/Message.model.js
{
  _id: ObjectId,
  senderId: ObjectId,  // ref: User
  receiverId: ObjectId,  // ref: User
  subject: String,
  content: String,
  attachments: [String],  // URLs
  isRead: Boolean,
  readAt: Date,
  schoolId: ObjectId,
  createdAt: Date
}

// Indexes
db.messages.createIndex({ receiverId: 1, isRead: 1 });
db.messages.createIndex({ senderId: 1 });
```

---

## 11. AUDIT LOG MODELS

### Audit Log Collection
```javascript
// models/audit/AuditLog.model.js
{
  _id: ObjectId,
  userId: ObjectId,  // ref: User
  action: String,  // CREATE, UPDATE, DELETE, LOGIN, etc.
  module: String,  // STUDENT, CLASS, GRADE, etc.
  entityId: ObjectId,  // ID of the modified entity
  entityType: String,
  oldValues: Object,
  newValues: Object,
  ipAddress: String,
  userAgent: String,
  status: String (SUCCESS, FAILURE),
  remarks: String,
  schoolId: ObjectId,
  createdAt: Date
}

// Indexes
db.auditlogs.createIndex({ userId: 1, createdAt: -1 });
db.auditlogs.createIndex({ action: 1 });
db.auditlogs.createIndex({ createdAt: -1 });
```

---

## Database Backup Script

```javascript
// For MongoDB Atlas or local MongoDB
// Run daily at midnight

// Backup Command
mongodump --uri="mongodb://username:password@host:port/school_management_system" \
          --out="/backup/sms-$(date +%Y%m%d-%H%M%S)"

// Restore Command
mongorestore --uri="mongodb://username:password@host:port/school_management_system" \
             "/path/to/backup/dump"
```

---

## Connection String Examples

```
// Local Development
mongodb://localhost:27017/school_management_system

// With Authentication
mongodb://username:password@localhost:27017/school_management_system

// MongoDB Atlas (Cloud)
mongodb+srv://username:password@cluster.mongodb.net/school_management_system

// Docker Compose
mongodb://mongo:27017/school_management_system
```

---

## Index Strategy for Performance

```javascript
// Create indexes after initial setup
db.students.createIndex({ studentId: 1 }, { unique: true });
db.students.createIndex({ email: 1 });
db.students.createIndex({ classId: 1 });

db.attendance.createIndex({ studentId: 1, date: 1 });
db.attendance.createIndex({ classId: 1, date: 1 });

db.grades.createIndex({ studentId: 1, examId: 1 });
db.grades.createIndex({ classId: 1 });

db.fees.createIndex({ studentId: 1, academicYearId: 1 });
db.fees.createIndex({ status: 1 });

db.messages.createIndex({ receiverId: 1, isRead: 1 });
db.messages.createIndex({ senderId: 1 });

db.auditlogs.createIndex({ userId: 1, createdAt: -1 });
db.auditlogs.createIndex({ action: 1 });

// Monitor index usage
db.collection.aggregate([{ $indexStats: {} }])
```

---

This comprehensive MongoDB schema covers all 20+ modules of the School Management System with proper relationships and indexes for optimal performance.
