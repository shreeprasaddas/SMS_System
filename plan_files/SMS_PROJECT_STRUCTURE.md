# School Management System - Complete Project Structure

## Project Overview
**Tech Stack:** Node.js (Backend) | React.js (Frontend) | MongoDB (Database)  
**Architecture:** MERN Stack with Modular Microservices-ready Design

---

## Root Directory Structure

```
school-management-system/
├── backend/                          # Node.js Backend Server
├── frontend/                         # React.js Web Application
├── mobile/                           # React Native Mobile App
├── shared/                           # Shared Types & Constants
├── docker-compose.yml                # Docker Compose Configuration
├── .env.example                      # Environment Variables Template
├── README.md                         # Project Documentation
└── package.json                      # Root Package (for monorepo)
```

---

## BACKEND STRUCTURE (Node.js + Express)

```
backend/
├── src/
│   ├── config/                       # Configuration Files
│   │   ├── database.js              # MongoDB Connection
│   │   ├── environment.js           # Environment Variables
│   │   ├── constants.js             # App Constants
│   │   └── redis.js                 # Redis Cache Configuration
│   │
│   ├── middleware/                   # Express Middleware
│   │   ├── auth.middleware.js        # JWT Authentication
│   │   ├── authorization.middleware.js  # Role-Based Access Control
│   │   ├── errorHandler.middleware.js   # Global Error Handling
│   │   ├── logger.middleware.js      # Request Logging
│   │   ├── validation.middleware.js  # Request Validation
│   │   ├── cors.middleware.js        # CORS Configuration
│   │   └── rateLimiter.middleware.js # Rate Limiting
│   │
│   ├── models/                       # MongoDB Schema Models
│   │   ├── user/
│   │   │   ├── User.model.js         # Base User Schema
│   │   │   ├── Student.model.js      # Student Schema
│   │   │   ├── Teacher.model.js      # Teacher Schema
│   │   │   ├── Parent.model.js       # Parent Schema
│   │   │   ├── Admin.model.js        # Admin Schema
│   │   │   ├── Staff.model.js        # Staff Schema
│   │   │   └── UserRole.model.js     # Role Definition
│   │   │
│   │   ├── academic/
│   │   │   ├── Class.model.js        # Class/Grade Schema
│   │   │   ├── Section.model.js      # Section Schema
│   │   │   ├── Subject.model.js      # Subject Schema
│   │   │   ├── ClassTeacher.model.js # Class-Teacher Mapping
│   │   │   ├── TeacherSubject.model.js # Teacher-Subject Assignment
│   │   │   ├── Curriculum.model.js   # Curriculum Schema
│   │   │   ├── AcademicYear.model.js # Academic Year Schema
│   │   │   └── Stream.model.js       # Stream Configuration (Science/Arts/Commerce)
│   │   │
│   │   ├── attendance/
│   │   │   ├── StudentAttendance.model.js    # Student Attendance
│   │   │   ├── StaffAttendance.model.js      # Staff Attendance
│   │   │   ├── AttendanceRule.model.js       # Attendance Rules
│   │   │   └── HolidayCalendar.model.js      # Holiday Calendar
│   │   │
│   │   ├── exam/
│   │   │   ├── Exam.model.js                 # Exam Configuration
│   │   │   ├── ExamType.model.js             # Exam Type Definition
│   │   │   ├── QuestionBank.model.js         # Question Bank
│   │   │   ├── QuestionPaper.model.js        # Generated Question Papers
│   │   │   ├── ExamSchedule.model.js         # Exam Timetable
│   │   │   ├── SeatAllocation.model.js       # Seat Arrangements
│   │   │   └── AnswerScript.model.js         # Answer Scripts (Digital)
│   │   │
│   │   ├── grades/
│   │   │   ├── Grade.model.js                # Student Grade/Mark
│   │   │   ├── GradeScale.model.js           # Grading Scale Configuration
│   │   │   ├── AssessmentType.model.js       # Assessment Types
│   │   │   ├── ContinuousAssessment.model.js # Continuous Assessment
│   │   │   └── ReportCard.model.js           # Report Card
│   │   │
│   │   ├── assignment/
│   │   │   ├── Assignment.model.js           # Assignment Creation
│   │   │   ├── AssignmentSubmission.model.js # Student Submission
│   │   │   ├── AssignmentEvaluation.model.js # Teacher Evaluation
│   │   │   └── AssignmentRubric.model.js     # Evaluation Rubric
│   │   │
│   │   ├── timetable/
│   │   │   ├── Timetable.model.js            # Class Timetable
│   │   │   ├── TeacherTimetable.model.js     # Teacher Schedule
│   │   │   ├── TimeSlot.model.js             # Time Slot Configuration
│   │   │   ├── TimetableChange.model.js      # Schedule Modifications
│   │   │   └── PeriodConfiguration.model.js  # Period Setup
│   │   │
│   │   ├── communication/
│   │   │   ├── Announcement.model.js         # School Announcements
│   │   │   ├── Message.model.js              # Direct Messages
│   │   │   ├── NoticeBoard.model.js          # Digital Notice Board
│   │   │   ├── Notification.model.js         # Push Notifications
│   │   │   ├── EventCalendar.model.js        # Event Calendar
│   │   │   └── ChatRoom.model.js             # Chat/Discussion Rooms
│   │   │
│   │   ├── finance/
│   │   │   ├── FeeStructure.model.js         # Fee Configuration
│   │   │   ├── StudentFees.model.js          # Student Fee Records
│   │   │   ├── Invoice.model.js              # Generated Invoices
│   │   │   ├── Payment.model.js              # Payment Records
│   │   │   ├── StudentConcession.model.js    # Discounts/Scholarships
│   │   │   ├── Expense.model.js              # Expense Records
│   │   │   ├── Journal.model.js              # Accounting Journal
│   │   │   ├── Ledger.model.js               # Account Ledger
│   │   │   └── Budget.model.js               # Budget Allocation
│   │   │
│   │   ├── library/
│   │   │   ├── Book.model.js                 # Book Catalog
│   │   │   ├── BookShelf.model.js            # Shelf Management
│   │   │   ├── BookIssue.model.js            # Issue Record
│   │   │   ├── BookReturn.model.js           # Return Record
│   │   │   ├── BookReservation.model.js      # Book Reservation
│   │   │   ├── LibraryMember.model.js        # Member Registration
│   │   │   ├── LibraryFine.model.js          # Fine Management
│   │   │   └── BookInventory.model.js        # Inventory Tracking
│   │   │
│   │   ├── transport/
│   │   │   ├── Bus.model.js                  # Bus/Vehicle Details
│   │   │   ├── Route.model.js                # Bus Route
│   │   │   ├── Stop.model.js                 # Route Stop
│   │   │   ├── TransportFee.model.js         # Transport Fee
│   │   │   ├── StudentBusAssignment.model.js # Student Assignment
│   │   │   ├── Driver.model.js               # Driver Details
│   │   │   ├── Conductor.model.js            # Conductor/Helper
│   │   │   ├── BusAttendance.model.js        # Pickup/Dropoff Tracking
│   │   │   └── MaintenanceRecord.model.js    # Maintenance Logs
│   │   │
│   │   ├── hostel/
│   │   │   ├── Hostel.model.js               # Hostel Setup
│   │   │   ├── Room.model.js                 # Room Details
│   │   │   ├── StudentHostel.model.js        # Hostel Assignment
│   │   │   ├── HostelAttendance.model.js     # Check-in/out Tracking
│   │   │   ├── HostelLeave.model.js          # Leave Management
│   │   │   ├── HostelVisitor.model.js        # Visitor Management
│   │   │   ├── HostelFacility.model.js       # Facility Tracking
│   │   │   ├── HostelFee.model.js            # Hostel Billing
│   │   │   └── HostelComplaint.model.js      # Complaint System
│   │   │
│   │   ├── hr/
│   │   │   ├── Designation.model.js          # Job Positions
│   │   │   ├── Department.model.js           # Departments
│   │   │   ├── Salary.model.js               # Salary Structure
│   │   │   ├── Payroll.model.js              # Payroll Records
│   │   │   ├── LeaveApplication.model.js     # Leave Requests
│   │   │   ├── LeaveType.model.js            # Leave Category
│   │   │   ├── Recruitment.model.js          # Job Posting
│   │   │   ├── PerformanceAppraisal.model.js # Performance Review
│   │   │   ├── Training.model.js             # Training Records
│   │   │   └── Grievance.model.js            # Grievance Management
│   │   │
│   │   ├── admission/
│   │   │   ├── AdmissionCycle.model.js       # Admission Period
│   │   │   ├── ApplicationForm.model.js      # Application Template
│   │   │   ├── Application.model.js          # Student Application
│   │   │   ├── MeritList.model.js            # Merit List
│   │   │   └── DocumentVerification.model.js # Doc Verification
│   │   │
│   │   ├── alumni/
│   │   │   ├── Alumni.model.js               # Alumni Profile
│   │   │   ├── AlumniEvent.model.js          # Events/Reunions
│   │   │   ├── Donation.model.js             # Donation Records
│   │   │   └── AlumniMentorship.model.js     # Mentorship Program
│   │   │
│   │   ├── discipline/
│   │   │   ├── Incident.model.js             # Incident Report
│   │   │   ├── DisciplinaryAction.model.js   # Action Taken
│   │   │   └── DisciplineRecord.model.js     # Historical Record
│   │   │
│   │   ├── documents/
│   │   │   ├── DocumentRequest.model.js      # Document Request
│   │   │   ├── CertificateTemplate.model.js  # Certificate Template
│   │   │   └── DocumentIssued.model.js       # Issued Documents
│   │   │
│   │   ├── inventory/
│   │   │   ├── Asset.model.js                # Asset Master
│   │   │   ├── AssetMaintenance.model.js     # Maintenance
│   │   │   ├── Equipment.model.js            # Equipment Tracking
│   │   │   └── Stock.model.js                # Inventory Stock
│   │   │
│   │   ├── audit/
│   │   │   ├── AuditLog.model.js             # Audit Trail
│   │   │   └── ActivityLog.model.js          # User Activity
│   │   │
│   │   ├── system/
│   │   │   ├── SystemConfig.model.js         # System Settings
│   │   │   ├── SchoolInfo.model.js           # School Details
│   │   │   ├── Policy.model.js               # School Policies
│   │   │   └── BackupLog.model.js            # Backup Records
│   │   │
│   │   └── index.js                          # Export All Models
│   │
│   ├── controllers/                   # Business Logic Controllers
│   │   ├── userController.js          # User Management
│   │   ├── studentController.js       # Student Operations
│   │   ├── teacherController.js       # Teacher Operations
│   │   ├── classController.js         # Class Management
│   │   ├── subjectController.js       # Subject Management
│   │   ├── attendanceController.js    # Attendance Operations
│   │   ├── timetableController.js     # Timetable Management
│   │   ├── examController.js          # Exam Management
│   │   ├── gradeController.js         # Grade/Mark Entry & Processing
│   │   ├── assignmentController.js    # Assignment Management
│   │   ├── communicationController.js # Notifications & Messages
│   │   ├── libraryController.js       # Library Operations
│   │   ├── feeController.js           # Finance & Fee Management
│   │   ├── expenseController.js       # Expense Tracking
│   │   ├── reportingController.js     # Report Generation
│   │   ├── hrController.js            # HR & Staff Management
│   │   ├── payrollController.js       # Payroll Processing
│   │   ├── transportController.js     # Transport Management
│   │   ├── hostelController.js        # Hostel Management
│   │   ├── admissionController.js     # Admission Processing
│   │   ├── alumniController.js        # Alumni Management
│   │   ├── disciplineController.js    # Discipline Management
│   │   ├── documentController.js      # Document Requests
│   │   ├── inventoryController.js     # Asset & Inventory
│   │   ├── dashboardController.js     # Dashboard Data
│   │   └── authController.js          # Authentication & Login
│   │
│   ├── services/                      # Business Logic Services
│   │   ├── auth/
│   │   │   ├── authService.js         # Authentication Logic
│   │   │   ├── tokenService.js        # JWT Token Management
│   │   │   └── passwordService.js     # Password Hashing & Reset
│   │   │
│   │   ├── academic/
│   │   │   ├── studentService.js      # Student Data Operations
│   │   │   ├── classService.js        # Class Operations
│   │   │   ├── subjectService.js      # Subject Operations
│   │   │   ├── timetableService.js    # Timetable Generation
│   │   │   └── promotionService.js    # Promotion Logic
│   │   │
│   │   ├── attendance/
│   │   │   ├── attendanceService.js   # Attendance Marking
│   │   │   ├── attendanceAnalytics.js # Attendance Analysis
│   │   │   └── attendanceAlert.js     # Low Attendance Alerts
│   │   │
│   │   ├── exam/
│   │   │   ├── examService.js         # Exam Management
│   │   │   ├── questionPaperService.js # Question Paper Generation
│   │   │   ├── seatAllocationService.js # Seat Arrangement
│   │   │   └── gradeService.js        # Grade Calculation
│   │   │
│   │   ├── assignment/
│   │   │   ├── assignmentService.js   # Assignment Operations
│   │   │   ├── submissionService.js   # Submission Handling
│   │   │   └── evaluationService.js   # Grade Evaluation
│   │   │
│   │   ├── communication/
│   │   │   ├── notificationService.js # Notification Sending (SMS/Email/Push)
│   │   │   ├── messageService.js      # Direct Messaging
│   │   │   ├── announcementService.js # Announcement Broadcasting
│   │   │   └── emailService.js        # Email Gateway
│   │   │
│   │   ├── finance/
│   │   │   ├── feeService.js          # Fee Calculation & Billing
│   │   │   ├── paymentService.js      # Payment Processing
│   │   │   ├── expenseService.js      # Expense Recording
│   │   │   ├── accountingService.js   # Accounting Operations
│   │   │   ├── budgetService.js       # Budget Management
│   │   │   └── reconciliationService.js # Bank Reconciliation
│   │   │
│   │   ├── library/
│   │   │   ├── libraryService.js      # Book Operations
│   │   │   ├── issueReturnService.js  # Issue/Return Processing
│   │   │   ├── reservationService.js  # Reservation Handling
│   │   │   ├── fineService.js         # Fine Calculation
│   │   │   └── inventoryService.js    # Inventory Management
│   │   │
│   │   ├── transport/
│   │   │   ├── busService.js          # Bus Management
│   │   │   ├── routeService.js        # Route Planning
│   │   │   ├── trackingService.js     # GPS Tracking
│   │   │   └── transportFeeService.js # Transport Fee Calculation
│   │   │
│   │   ├── hr/
│   │   │   ├── staffService.js        # Staff Management
│   │   │   ├── leaveService.js        # Leave Processing
│   │   │   ├── payrollService.js      # Payroll Calculation
│   │   │   ├── performanceService.js  # Performance Appraisal
│   │   │   └── trainingService.js     # Training Management
│   │   │
│   │   ├── hostel/
│   │   │   ├── hostelService.js       # Hostel Operations
│   │   │   ├── roomService.js         # Room Management
│   │   │   ├── attendanceService.js   # Hostel Attendance
│   │   │   ├── complaintService.js    # Complaint Handling
│   │   │   └── billingService.js      # Hostel Billing
│   │   │
│   │   ├── admission/
│   │   │   ├── admissionService.js    # Admission Processing
│   │   │   ├── applicationService.js  # Application Handling
│   │   │   ├── meritService.js        # Merit Calculation
│   │   │   └── verificationService.js # Document Verification
│   │   │
│   │   ├── reporting/
│   │   │   ├── reportService.js       # Report Generation
│   │   │   ├── analyticsService.js    # Data Analytics
│   │   │   ├── excelService.js        # Excel/CSV Export
│   │   │   ├── pdfService.js          # PDF Generation
│   │   │   └── chartingService.js     # Chart Data Preparation
│   │   │
│   │   ├── document/
│   │   │   ├── documentService.js     # Document Generation
│   │   │   ├── certificateService.js  # Certificate Creation
│   │   │   └── requestService.js      # Document Requests
│   │   │
│   │   ├── cache/
│   │   │   ├── cacheService.js        # Redis Caching
│   │   │   └── invalidationService.js # Cache Invalidation
│   │   │
│   │   ├── storage/
│   │   │   ├── fileService.js         # File Upload/Download
│   │   │   └── cloudService.js        # Cloud Storage (S3)
│   │   │
│   │   ├── integration/
│   │   │   ├── paymentGateway.js      # Payment Integration
│   │   │   ├── smsGateway.js          # SMS Integration
│   │   │   ├── emailGateway.js        # Email Service
│   │   │   ├── mapService.js          # Maps & GPS
│   │   │   └── externalAPIService.js  # External APIs
│   │   │
│   │   └── scheduler/
│   │       ├── cronJobs.js            # Scheduled Tasks
│   │       └── taskQueue.js           # Task Queue Management
│   │
│   ├── routes/                        # API Routes
│   │   ├── auth.routes.js             # Auth Endpoints
│   │   ├── user.routes.js             # User Management Routes
│   │   ├── student.routes.js          # Student Routes
│   │   ├── teacher.routes.js          # Teacher Routes
│   │   ├── class.routes.js            # Class Routes
│   │   ├── subject.routes.js          # Subject Routes
│   │   ├── attendance.routes.js       # Attendance Routes
│   │   ├── timetable.routes.js        # Timetable Routes
│   │   ├── exam.routes.js             # Exam Routes
│   │   ├── grade.routes.js            # Grade Routes
│   │   ├── assignment.routes.js       # Assignment Routes
│   │   ├── communication.routes.js    # Communication Routes
│   │   ├── library.routes.js          # Library Routes
│   │   ├── fee.routes.js              # Fee Routes
│   │   ├── expense.routes.js          # Expense Routes
│   │   ├── reporting.routes.js        # Report Routes
│   │   ├── hr.routes.js               # HR Routes
│   │   ├── payroll.routes.js          # Payroll Routes
│   │   ├── transport.routes.js        # Transport Routes
│   │   ├── hostel.routes.js           # Hostel Routes
│   │   ├── admission.routes.js        # Admission Routes
│   │   ├── alumni.routes.js           # Alumni Routes
│   │   ├── discipline.routes.js       # Discipline Routes
│   │   ├── document.routes.js         # Document Routes
│   │   ├── inventory.routes.js        # Inventory Routes
│   │   ├── dashboard.routes.js        # Dashboard Routes
│   │   ├── admin.routes.js            # Admin Routes
│   │   └── index.js                   # Combine All Routes
│   │
│   ├── utils/                         # Utility Functions
│   │   ├── validators.js              # Input Validation
│   │   ├── formatters.js              # Data Formatting
│   │   ├── helpers.js                 # Helper Functions
│   │   ├── errorHandler.js            # Error Handling
│   │   ├── logger.js                  # Logging Utility
│   │   ├── cryptography.js            # Encryption/Decryption
│   │   ├── dateTime.js                # Date/Time Utilities
│   │   ├── pagination.js              # Pagination Helper
│   │   ├── sorting.js                 # Sorting Helper
│   │   ├── fileUpload.js              # File Upload Utilities
│   │   ├── qrCode.js                  # QR Code Generation
│   │   ├── notification.js            # Notification Utilities
│   │   └── constants.js               # Application Constants
│   │
│   ├── validations/                   # Request Validation Schemas
│   │   ├── userValidation.js          # User Validation
│   │   ├── studentValidation.js       # Student Validation
│   │   ├── classValidation.js         # Class Validation
│   │   ├── attendanceValidation.js    # Attendance Validation
│   │   ├── gradeValidation.js         # Grade Validation
│   │   ├── examValidation.js          # Exam Validation
│   │   ├── feeValidation.js           # Fee Validation
│   │   └── otherValidations.js        # Other Validations
│   │
│   ├── jobs/                          # Background Jobs
│   │   ├── attendanceJob.js           # Auto-mark Absentees
│   │   ├── feeReminderJob.js          # Fee Reminders
│   │   ├── payrollJob.js              # Payroll Processing
│   │   ├── reportGenerationJob.js     # Report Generation
│   │   ├── backupJob.js               # Database Backups
│   │   ├── notificationJob.js         # Batch Notifications
│   │   └── cleanupJob.js              # Data Cleanup
│   │
│   ├── seeders/                       # Database Seeders
│   │   ├── seedUsers.js               # Seed Users
│   │   ├── seedClasses.js             # Seed Classes
│   │   ├── seedSubjects.js            # Seed Subjects
│   │   ├── seedAcademicYear.js        # Seed Academic Year
│   │   ├── seedFeeStructure.js        # Seed Fee Structure
│   │   └── index.js                   # Master Seeder
│   │
│   ├── tests/                         # Unit & Integration Tests
│   │   ├── unit/
│   │   │   ├── models.test.js
│   │   │   ├── services.test.js
│   │   │   └── utils.test.js
│   │   ├── integration/
│   │   │   ├── auth.test.js
│   │   │   ├── student.test.js
│   │   │   └── attendance.test.js
│   │   └── jest.config.js
│   │
│   ├── migrations/                    # Database Migrations
│   │   ├── 001_create_users.js
│   │   ├── 002_create_students.js
│   │   ├── 003_create_classes.js
│   │   └── index.js
│   │
│   └── app.js                         # Express App Setup
│
├── public/                            # Static Files
│   └── uploads/                       # User Uploads
│
├── logs/                              # Log Files
│   ├── error.log
│   ├── combined.log
│   └── access.log
│
├── .env                               # Environment Variables
├── .env.example                       # Template
├── .gitignore                         # Git Ignore
├── .eslintrc.json                     # ESLint Config
├── server.js                          # Server Entry Point
├── package.json                       # Dependencies
└── README.md                          # Documentation
```

---

## FRONTEND STRUCTURE (React.js)

```
frontend/
├── public/
│   ├── index.html                     # Main HTML
│   ├── favicon.ico
│   ├── manifest.json                  # PWA Manifest
│   └── logo.png
│
├── src/
│   ├── index.js                       # React Entry Point
│   ├── App.js                         # Main Component
│   ├── App.css
│   │
│   ├── config/
│   │   ├── api.config.js              # API Configuration
│   │   ├── theme.config.js            # Theme Configuration
│   │   ├── constants.js               # Frontend Constants
│   │   └── permissions.config.js      # Permission Mapping
│   │
│   ├── hooks/                         # Custom Hooks
│   │   ├── useAuth.js                 # Authentication Hook
│   │   ├── useApi.js                  # API Call Hook
│   │   ├── useForm.js                 # Form Handling
│   │   ├── useLocalStorage.js         # Local Storage Hook
│   │   ├── usePagination.js           # Pagination Hook
│   │   ├── useNotification.js         # Notification Hook
│   │   ├── useTable.js                # Table Sorting/Filtering
│   │   └── useDebounce.js             # Debounce Hook
│   │
│   ├── context/                       # React Context API
│   │   ├── AuthContext.js             # Auth Context
│   │   ├── ThemeContext.js            # Theme Context
│   │   ├── NotificationContext.js     # Notification Context
│   │   ├── SidebarContext.js          # Sidebar State
│   │   └── index.js                   # Export Contexts
│   │
│   ├── redux/                         # Redux State Management
│   │   ├── store.js                   # Redux Store
│   │   ├── slices/
│   │   │   ├── authSlice.js           # Auth State
│   │   │   ├── userSlice.js           # User State
│   │   │   ├── studentSlice.js        # Student State
│   │   │   ├── classSlice.js          # Class State
│   │   │   ├── attendanceSlice.js     # Attendance State
│   │   │   ├── gradeSlice.js          # Grade State
│   │   │   ├── feeSlice.js            # Fee State
│   │   │   ├── notificationSlice.js   # Notification State
│   │   │   ├── reportSlice.js         # Report State
│   │   │   └── uiSlice.js             # UI State
│   │   └── actions/
│   │       ├── authActions.js
│   │       ├── studentActions.js
│   │       └── ...actions
│   │
│   ├── services/                      # API Services
│   │   ├── api.service.js             # Axios Instance
│   │   ├── auth.service.js            # Auth API Calls
│   │   ├── student.service.js         # Student API Calls
│   │   ├── teacher.service.js         # Teacher API Calls
│   │   ├── class.service.js           # Class API Calls
│   │   ├── attendance.service.js      # Attendance API Calls
│   │   ├── grade.service.js           # Grade API Calls
│   │   ├── exam.service.js            # Exam API Calls
│   │   ├── fee.service.js             # Fee API Calls
│   │   ├── library.service.js         # Library API Calls
│   │   ├── report.service.js          # Report API Calls
│   │   ├── user.service.js            # User API Calls
│   │   ├── assignment.service.js      # Assignment API Calls
│   │   ├── transport.service.js       # Transport API Calls
│   │   ├── hostel.service.js          # Hostel API Calls
│   │   ├── communication.service.js   # Communication API Calls
│   │   ├── document.service.js        # Document API Calls
│   │   ├── hr.service.js              # HR API Calls
│   │   └── dashboard.service.js       # Dashboard API Calls
│   │
│   ├── components/                    # Reusable Components
│   │   ├── Layout/
│   │   │   ├── Header.js              # Top Header
│   │   │   ├── Sidebar.js             # Side Navigation
│   │   │   ├── Footer.js              # Footer
│   │   │   ├── Breadcrumb.js          # Breadcrumb Navigation
│   │   │   └── MainLayout.js          # Main Layout Wrapper
│   │   │
│   │   ├── Common/
│   │   │   ├── Button.js              # Reusable Button
│   │   │   ├── Input.js               # Input Field
│   │   │   ├── Select.js              # Dropdown Select
│   │   │   ├── Modal.js               # Modal Dialog
│   │   │   ├── Alert.js               # Alert Component
│   │   │   ├── Card.js                # Card Component
│   │   │   ├── Badge.js               # Badge Component
│   │   │   ├── Loading.js             # Loading Spinner
│   │   │   ├── Pagination.js          # Pagination Component
│   │   │   ├── Table.js               # Data Table
│   │   │   ├── DatePicker.js          # Date Picker
│   │   │   ├── FormGroup.js           # Form Group
│   │   │   └── Tooltip.js             # Tooltip Component
│   │   │
│   │   ├── Auth/
│   │   │   ├── LoginForm.js           # Login Form
│   │   │   ├── RegisterForm.js        # Registration Form
│   │   │   ├── ForgotPassword.js      # Forgot Password Form
│   │   │   ├── ResetPassword.js       # Reset Password Form
│   │   │   └── OTPVerification.js     # OTP Verification
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.js      # Admin Dashboard
│   │   │   ├── StudentDashboard.js    # Student Dashboard
│   │   │   ├── TeacherDashboard.js    # Teacher Dashboard
│   │   │   ├── ParentDashboard.js     # Parent Dashboard
│   │   │   ├── DashboardWidget.js     # Widget Component
│   │   │   └── StatisticsCard.js      # Stats Card
│   │   │
│   │   ├── Student/
│   │   │   ├── StudentList.js         # Student Listing
│   │   │   ├── StudentForm.js         # Student Create/Edit
│   │   │   ├── StudentDetail.js       # Student Profile
│   │   │   ├── StudentDocument.js     # Document Management
│   │   │   ├── StudentStatus.js       # Status Management
│   │   │   └── StudentActivity.js     # Activity Tracking
│   │   │
│   │   ├── Class/
│   │   │   ├── ClassList.js           # Class Listing
│   │   │   ├── ClassForm.js           # Class Create/Edit
│   │   │   ├── ClassDetail.js         # Class Details
│   │   │   ├── SectionManagement.js   # Section Management
│   │   │   └── ClassStudent.js        # Class Students List
│   │   │
│   │   ├── Attendance/
│   │   │   ├── AttendanceMarking.js   # Mark Attendance
│   │   │   ├── AttendanceReport.js    # Attendance Report
│   │   │   ├── BulkAttendance.js      # Bulk Upload
│   │   │   ├── AttendanceAnalytics.js # Analysis View
│   │   │   └── AttendanceAlert.js     # Alert Management
│   │   │
│   │   ├── Grade/
│   │   │   ├── GradeEntry.js          # Grade/Mark Entry
│   │   │   ├── GradeReport.js         # Grade Report
│   │   │   ├── ReportCard.js          # Report Card View
│   │   │   ├── GradeAnalytics.js      # Analytics
│   │   │   └── ResultDeclaration.js   # Result Declaration
│   │   │
│   │   ├── Exam/
│   │   │   ├── ExamList.js            # Exam Listing
│   │   │   ├── ExamForm.js            # Exam Setup
│   │   │   ├── ExamSchedule.js        # Exam Timetable
│   │   │   ├── SeatAllocation.js      # Seat Arrangement
│   │   │   ├── QuestionBank.js        # Question Bank
│   │   │   └── AnswerScriptReview.js  # Answer Review
│   │   │
│   │   ├── Assignment/
│   │   │   ├── AssignmentList.js      # Assignment Listing
│   │   │   ├── AssignmentForm.js      # Create Assignment
│   │   │   ├── SubmissionView.js      # Submissions
│   │   │   ├── Evaluation.js          # Grading Interface
│   │   │   └── StudentAssignment.js   # Student View
│   │   │
│   │   ├── Timetable/
│   │   │   ├── TimetableView.js       # Timetable Display
│   │   │   ├── TimetableBuilder.js    # Timetable Creation
│   │   │   ├── ScheduleChange.js      # Schedule Modifications
│   │   │   └── ConflictDetection.js   # Conflict Detection
│   │   │
│   │   ├── Fee/
│   │   │   ├── FeeStructure.js        # Fee Configuration
│   │   │   ├── BillGeneration.js      # Generate Bills
│   │   │   ├── PaymentHistory.js      # Payment Records
│   │   │   ├── PendingDues.js         # Dues Tracking
│   │   │   └── PaymentGateway.js      # Payment Interface
│   │   │
│   │   ├── Library/
│   │   │   ├── BookCatalog.js         # Book Search
│   │   │   ├── IssueReturn.js         # Issue/Return Interface
│   │   │   ├── Reservation.js         # Book Reservation
│   │   │   ├── FineManagement.js      # Fine Payment
│   │   │   └── LibraryInventory.js    # Inventory Management
│   │   │
│   │   ├── Communication/
│   │   │   ├── Announcement.js        # Announcements View
│   │   │   ├── Messaging.js           # Direct Messages
│   │   │   ├── NoticeBoard.js         # Notice Board
│   │   │   ├── EventCalendar.js       # Event Calendar
│   │   │   └── Notification.js        # Notifications Center
│   │   │
│   │   ├── Transport/
│   │   │   ├── BusManagement.js       # Bus List
│   │   │   ├── RouteManagement.js     # Route Configuration
│   │   │   ├── StudentAssignment.js   # Assign Students
│   │   │   ├── Tracking.js            # GPS Tracking View
│   │   │   └── TransportFee.js        # Fee Management
│   │   │
│   │   ├── Hostel/
│   │   │   ├── HostelList.js          # Hostel Listing
│   │   │   ├── RoomManagement.js      # Room Details
│   │   │   ├── CheckInOut.js          # Attendance Tracking
│   │   │   ├── LeaveManagement.js     # Leave Processing
│   │   │   └── ComplaintSystem.js     # Complaints
│   │   │
│   │   ├── HR/
│   │   │   ├── StaffList.js           # Staff Directory
│   │   │   ├── StaffForm.js           # Staff Create/Edit
│   │   │   ├── LeaveManagement.js     # Leave Processing
│   │   │   ├── PayrollView.js         # Payroll Review
│   │   │   ├── Performance.js         # Performance Review
│   │   │   └── Recruitment.js         # Job Postings
│   │   │
│   │   ├── Reports/
│   │   │   ├── ReportBuilder.js       # Report Creation
│   │   │   ├── PrebuiltReports.js     # Template Reports
│   │   │   ├── AnalyticsView.js       # Analytics Dashboard
│   │   │   ├── ChartComponent.js      # Chart Display
│   │   │   └── ExportOptions.js       # Export Formats
│   │   │
│   │   ├── Settings/
│   │   │   ├── SchoolSettings.js      # School Configuration
│   │   │   ├── UserSettings.js        # User Preferences
│   │   │   ├── SystemConfig.js        # System Settings
│   │   │   ├── Backup.js              # Backup Management
│   │   │   └── AuditLog.js            # Audit Trail View
│   │   │
│   │   └── Admin/
│   │       ├── UserManagement.js      # User Management
│   │       ├── RolePermission.js      # Role & Permissions
│   │       ├── AuditLogs.js           # Activity Logs
│   │       └── SystemHealth.js        # System Monitoring
│   │
│   ├── pages/                         # Page Components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── StudentManagement.js
│   │   ├── ClassManagement.js
│   │   ├── AttendanceManagement.js
│   │   ├── GradeManagement.js
│   │   ├── ExamManagement.js
│   │   ├── AssignmentManagement.js
│   │   ├── FeeManagement.js
│   │   ├── LibraryManagement.js
│   │   ├── TransportManagement.js
│   │   ├── HostelManagement.js
│   │   ├── HRManagement.js
│   │   ├── ReportGeneration.js
│   │   ├── Settings.js
│   │   ├── NotFound.js
│   │   └── Unauthorized.js
│   │
│   ├── routes/                        # Route Configuration
│   │   ├── PrivateRoute.js            # Protected Routes
│   │   ├── adminRoutes.js             # Admin Routes
│   │   ├── studentRoutes.js           # Student Routes
│   │   ├── teacherRoutes.js           # Teacher Routes
│   │   ├── parentRoutes.js            # Parent Routes
│   │   ├── publicRoutes.js            # Public Routes
│   │   └── index.js                   # Route Configuration
│   │
│   ├── styles/                        # Global Styles
│   │   ├── index.css                  # Global Styles
│   │   ├── variables.css              # CSS Variables
│   │   ├── responsive.css             # Responsive Design
│   │   ├── animations.css             # Animations
│   │   ├── utilities.css              # Utility Classes
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   │
│   ├── utils/                         # Utility Functions
│   │   ├── api.js                     # API Helper
│   │   ├── storage.js                 # Local Storage Helper
│   │   ├── format.js                  # Data Formatting
│   │   ├── validation.js              # Form Validation
│   │   ├── constants.js               # Constants
│   │   ├── dateTime.js                # Date/Time Utilities
│   │   ├── errorHandler.js            # Error Handling
│   │   ├── permission.js              # Permission Checking
│   │   └── export.js                  # Export Utilities (PDF, Excel)
│   │
│   ├── assets/                        # Static Assets
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── icons/
│   │   │   └── backgrounds/
│   │   ├── fonts/
│   │   └── videos/
│   │
│   ├── i18n/                          # Internationalization
│   │   ├── index.js                   # i18n Setup
│   │   ├── en.json                    # English Translations
│   │   ├── hi.json                    # Hindi Translations
│   │   └── otherLanguages.json
│   │
│   └── tests/                         # Frontend Tests
│       ├── components.test.js
│       ├── services.test.js
│       ├── utils.test.js
│       └── jest.config.js
│
├── .env                               # Environment Variables
├── .env.example                       # Template
├── .gitignore
├── .eslintrc.json
├── package.json                       # Dependencies
├── tailwind.config.js                 # Tailwind CSS Config
├── webpack.config.js                  # Webpack Config (if custom)
└── README.md
```

---

## DATABASE STRUCTURE (MongoDB Collections)

```
mongodb://localhost:27017/school_management_system

Collections:
├── users
│   └── Indexes: email, username, role, schoolId
│
├── students
│   └── Indexes: studentId, email, classId, schoolId
│
├── teachers
│   └── Indexes: employeeId, email, schoolId
│
├── classes
│   └── Indexes: name, academicYearId, schoolId
│
├── subjects
│   └── Indexes: code, name, schoolId
│
├── attendance
│   └── Indexes: studentId, date, classId
│
├── grades
│   └── Indexes: studentId, examId, subjectId
│
├── exams
│   └── Indexes: name, date, classId
│
├── assignments
│   └── Indexes: teacherId, classId, dueDate
│
├── fees
│   └── Indexes: studentId, status, schoolId
│
├── books
│   └── Indexes: isbn, title, schoolId
│
├── hostels
│   └── Indexes: name, schoolId
│
├── buses
│   └── Indexes: regNumber, schoolId
│
├── staff
│   └── Indexes: employeeId, email, schoolId
│
├── payments
│   └── Indexes: studentId, date, status
│
├── announcements
│   └── Indexes: date, schoolId, type
│
└── auditLogs
    └── Indexes: userId, action, timestamp
```

---

## SHARED UTILITIES (Monorepo)

```
shared/
├── types/
│   ├── user.types.ts
│   ├── student.types.ts
│   ├── teacher.types.ts
│   ├── class.types.ts
│   ├── attendance.types.ts
│   ├── grade.types.ts
│   ├── exam.types.ts
│   ├── fee.types.ts
│   └── common.types.ts
│
├── constants/
│   ├── roles.js
│   ├── permissions.js
│   ├── status.js
│   ├── errorCodes.js
│   └── messages.js
│
├── validations/
│   ├── studentValidation.js
│   ├── userValidation.js
│   └── otherValidation.js
│
├── utilities/
│   ├── dateFormatter.js
│   ├── errorHandler.js
│   └── commonFunctions.js
│
└── package.json
```

---

## DOCKER CONFIGURATION

```
docker-compose.yml (Root Directory):

services:
  mongodb:
    image: mongo:latest
    ports: 27017:27017
    volumes: mongodb_data
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: school_management_system

  backend:
    build: ./backend
    ports: 5000:5000
    depends_on: mongodb
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://admin:password@mongodb:27017/school_management_system
      JWT_SECRET: your_jwt_secret
      PORT: 5000

  frontend:
    build: ./frontend
    ports: 3000:3000
    depends_on: backend
    environment:
      REACT_APP_API_URL: http://localhost:5000/api

  redis:
    image: redis:alpine
    ports: 6379:6379

volumes:
  mongodb_data:
```

---

## KEY FILES DESCRIPTION

### Backend Key Files:

1. **server.js** - Application Entry Point
2. **src/app.js** - Express Configuration
3. **src/config/database.js** - MongoDB Connection
4. **src/middleware/auth.middleware.js** - JWT Verification
5. **src/middleware/authorization.middleware.js** - Role-Based Access Control
6. **.env** - Environment Variables

### Frontend Key Files:

1. **src/index.js** - React Entry Point
2. **src/App.js** - Main Component
3. **src/services/api.service.js** - API Configuration
4. **src/redux/store.js** - Redux Store Setup
5. **src/routes/index.js** - Route Configuration
6. **.env** - API URL Configuration

---

## INSTALLATION & SETUP

### Backend Setup:
```bash
cd backend
npm install
npm run dev              # Development
npm run build            # Production Build
npm test                 # Run Tests
npm run seed             # Seed Database
npm run migrate          # Run Migrations
```

### Frontend Setup:
```bash
cd frontend
npm install
npm start                # Development
npm run build            # Production Build
npm test                 # Run Tests
```

### Docker Setup:
```bash
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```

---

## ENVIRONMENT VARIABLES

### Backend (.env):
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:password@localhost:27017/school_management_system
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=refresh_secret
REDIS_URL=redis://localhost:6379
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
SMS_API_KEY=twilio_key
AWS_ACCESS_KEY=your_key
AWS_SECRET_KEY=your_secret
AWS_S3_BUCKET=bucket_name
RAZORPAY_KEY=payment_key
RAZORPAY_SECRET=payment_secret
```

### Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_GOOGLE_MAPS_KEY=your_key
REACT_APP_VERSION=1.0.0
```

---

## API NAMING CONVENTIONS

```
GET     /api/v1/students              - Get all students
POST    /api/v1/students              - Create student
GET     /api/v1/students/:id          - Get student by ID
PUT     /api/v1/students/:id          - Update student
DELETE  /api/v1/students/:id          - Delete student
PATCH   /api/v1/students/:id          - Partial update

GET     /api/v1/students/:id/grades   - Get student grades
GET     /api/v1/students/:id/attendance - Get attendance
POST    /api/v1/students/:id/promote  - Promote student
POST    /api/v1/students/:id/documents - Upload documents
```

---

## FILE NAMING CONVENTIONS

- **Models:** `StudentModel.js` (PascalCase)
- **Controllers:** `studentController.js` (camelCase)
- **Services:** `studentService.js` (camelCase)
- **Routes:** `student.routes.js` (kebab-case)
- **Components:** `StudentList.js` (PascalCase)
- **Hooks:** `useStudent.js` (camelCase with 'use' prefix)
- **Utils:** `studentUtils.js` (camelCase)

---

## SECURITY BEST PRACTICES

1. ✅ JWT-based Authentication
2. ✅ Role-Based Access Control (RBAC)
3. ✅ Data Encryption (Passwords, PII)
4. ✅ Environment Variables for Secrets
5. ✅ Input Validation & Sanitization
6. ✅ CORS Configuration
7. ✅ Rate Limiting
8. ✅ Audit Logging
9. ✅ Regular Security Updates
10. ✅ Database Backups

---

This comprehensive structure ensures scalability, maintainability, and follows industry best practices for a production-ready School Management System.
