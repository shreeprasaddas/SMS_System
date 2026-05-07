# 📱 SMS Frontend Implementation Plan

**Project:** School Management System (React 18 + Redux Toolkit + RTK Query)  
**Backend Status:** ✅ 40 phases complete (185+ files, 0 errors)  
**Frontend Status:** 📝 Planning phase  
**Target Focus:** Students, Teachers, Finance/Revenue, Analytics & Reports  

---

## 📋 Executive Summary

This document outlines a structured, phase-based approach to build the frontend for SMS. The plan:
- ✅ Aligns with completed backend (40 phases)
- ✅ Prioritizes 3 core areas: Students, Teachers, Finance
- ✅ Includes Analytics & Reporting
- ✅ Follows React 18 + Redux Toolkit patterns
- ✅ Implements proper RBAC for 10 user roles
- ✅ Covers 200+ backend API endpoints

**Total Implementation Time:** 40-50 hours  
**Team:** 1-2 developers  
**Start Date:** May 5, 2026

---

## 🎯 Frontend Scope

### In Scope ✅
| Area | Features | Status |
|------|----------|--------|
| **Authentication** | Login, Register, Password Reset, MFA | ✅ Will implement |
| **Dashboard** | Role-based home page, KPIs, quick actions | ✅ Will implement |
| **Student Management** | List, Add, Edit, View, Enrollment | ✅ Will implement |
| **Teacher Management** | List, Profile, Class Assignment | ✅ Will implement |
| **Finance** | Fee Collection, Payment Tracking, Reports | ✅ Will implement |
| **Analytics** | Academic, Financial, Engagement reports | ✅ Will implement |
| **Attendance** | Mark, View reports | ⏳ Phase 2 |
| **Grades** | View transcripts, Entry | ⏳ Phase 2 |
| **Communication** | Notices, Messages | ⏳ Phase 3 |

### Out of Scope (Phase 2+)
- [ ] Advanced curriculum management
- [ ] Question paper generation
- [ ] Hostel management
- [ ] Transport management
- [ ] Library management

---

## 🏗️ Frontend Architecture

```
frontend/
├── src/
│   ├── app/                      # Core app configuration
│   │   ├── App.jsx
│   │   ├── AppRoutes.jsx         # Route definitions
│   │   └── AppTheme.jsx          # Theme configuration
│   │
│   ├── components/               # Reusable components
│   │   ├── common/               # Generic UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Spinner/
│   │   │   ├── Toast/
│   │   │   ├── Dropdown/
│   │   │   └── Pagination/
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── MainLayout/
│   │   │   ├── AuthLayout/
│   │   │   └── Footer/
│   │   │
│   │   ├── student/              # Student domain components
│   │   │   ├── StudentList/
│   │   │   ├── StudentForm/
│   │   │   ├── StudentCard/
│   │   │   ├── StudentTable/
│   │   │   └── StudentFilters/
│   │   │
│   │   ├── teacher/              # Teacher domain components
│   │   │   ├── TeacherList/
│   │   │   ├── TeacherForm/
│   │   │   └── TeacherCard/
│   │   │
│   │   ├── finance/              # Finance domain components
│   │   │   ├── FeeTable/
│   │   │   ├── PaymentForm/
│   │   │   ├── InvoicePreview/
│   │   │   └── DefaultersList/
│   │   │
│   │   ├── analytics/            # Analytics components
│   │   │   ├── Chart/
│   │   │   ├── KPICard/
│   │   │   ├── ReportTable/
│   │   │   └── DateRangeFilter/
│   │   │
│   │   └── dashboard/            # Dashboard widgets
│   │       ├── AdminDashboard/
│   │       ├── TeacherDashboard/
│   │       ├── StudentDashboard/
│   │       └── Widgets/
│   │
│   ├── pages/                    # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx
│   │   │
│   │   ├── students/
│   │   │   ├── StudentsPage.jsx           # List
│   │   │   ├── AddStudentPage.jsx         # Create
│   │   │   ├── EditStudentPage.jsx        # Update
│   │   │   └── StudentDetailPage.jsx      # View
│   │   │
│   │   ├── teachers/
│   │   │   ├── TeachersPage.jsx
│   │   │   ├── AddTeacherPage.jsx
│   │   │   ├── TeacherDetailPage.jsx
│   │   │   └── TeacherClassesPage.jsx
│   │   │
│   │   ├── finance/
│   │   │   ├── FinancePage.jsx
│   │   │   ├── FeeCollectionPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── InvoicePage.jsx
│   │   │   └── DefaultersPage.jsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── AcademicReports.jsx
│   │   │   ├── FinancialReports.jsx
│   │   │   ├── EngagementReports.jsx
│   │   │   └── BenchmarkingPage.jsx
│   │   │
│   │   ├── attendance/
│   │   │   ├── AttendancePage.jsx
│   │   │   └── AttendanceReports.jsx
│   │   │
│   │   ├── grades/
│   │   │   ├── GradesPage.jsx
│   │   │   └── TranscriptPage.jsx
│   │   │
│   │   ├── 404/
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   └── 403/
│   │       └── UnauthorizedPage.jsx
│   │
│   ├── store/                    # Redux state management
│   │   ├── store.js              # Redux store configuration
│   │   ├── slices/               # Redux slices
│   │   │   ├── authSlice.js      # Auth state
│   │   │   ├── studentSlice.js   # Student state
│   │   │   ├── teacherSlice.js   # Teacher state
│   │   │   ├── feeSlice.js       # Finance state
│   │   │   ├── gradeSlice.js     # Grade state
│   │   │   ├── attendanceSlice.js # Attendance state
│   │   │   ├── analyticsSlice.js # Analytics state
│   │   │   ├── notificationSlice.js # Notifications
│   │   │   └── uiSlice.js        # UI state
│   │   │
│   │   └── api/                  # RTK Query endpoints
│   │       ├── authApi.js        # /auth endpoints
│   │       ├── studentApi.js     # /students endpoints
│   │       ├── teacherApi.js     # /teachers endpoints
│   │       ├── feeApi.js         # /fees endpoints
│   │       ├── gradeApi.js       # /grades endpoints
│   │       ├── attendanceApi.js  # /attendance endpoints
│   │       ├── analyticsApi.js   # /analytics endpoints
│   │       ├── classApi.js       # /classes endpoints
│   │       ├── subjectApi.js     # /subjects endpoints
│   │       └── examApi.js        # /exams endpoints
│   │
│   ├── services/                 # API service layer
│   │   ├── api.service.js        # HTTP client setup
│   │   ├── socket.service.js     # WebSocket client
│   │   ├── notification.service.js # Notifications
│   │   └── storage.service.js    # Local storage management
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.js            # Auth hook
│   │   ├── usePermission.js       # RBAC hook
│   │   ├── usePagination.js       # Pagination hook
│   │   ├── useModal.js            # Modal state hook
│   │   ├── useForm.js             # Form handling hook
│   │   ├── useNotification.js      # Toast notifications
│   │   └── useAsync.js            # Async data fetching
│   │
│   ├── contexts/                 # React contexts
│   │   ├── AuthContext.jsx        # Auth context
│   │   └── ThemeContext.jsx       # Theme context
│   │
│   ├── routes/                   # Route definitions
│   │   ├── Routes.jsx            # Main routes
│   │   ├── ProtectedRoute.jsx     # Auth guard
│   │   └── RoleRoute.jsx          # RBAC guard
│   │
│   ├── styles/                   # Global styles
│   │   ├── index.css             # Main CSS
│   │   ├── variables.css         # CSS variables
│   │   ├── utilities.css         # Utility classes
│   │   └── animations.css        # Animations
│   │
│   ├── utils/                    # Utility functions
│   │   ├── formatters.js         # Date, number formatting
│   │   ├── validators.js         # Form validation
│   │   ├── constants.js          # App constants
│   │   ├── permissions.js        # Permission mappings
│   │   ├── api.js                # API utilities
│   │   └── localStorage.js       # Storage helpers
│   │
│   ├── assets/                   # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── logos/
│   │
│   ├── i18n/                     # Internationalization
│   │   ├── en.json
│   │   ├── es.json
│   │   └── config.js
│   │
│   └── __tests__/                # Tests
│       ├── unit/
│       ├── integration/
│       └── e2e/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── package.json
├── vite.config.js
├── .env.example
├── .eslintrc.js
├── .prettierrc
└── README.md
```

---

## 📊 Phased Implementation Roadmap

### **Phase 1: Foundation & Core Setup** (6-8 hours)

#### 1.1 Project Setup
- [x] Setup Vite + React 18
- [x] Configure Redux Toolkit + RTK Query
- [x] Setup Tailwind CSS / Material-UI
- [x] Environment configuration (.env)
- [x] ESLint + Prettier setup

**Deliverables:**
- `package.json` with all dependencies
- `vite.config.js` configured
- `App.jsx` with basic routing
- `.env.example` populated
- GitHub Actions CI/CD setup (optional)

#### 1.2 Authentication System
**Components:**
- LoginPage component
- RegisterPage component
- ForgotPasswordPage component
- ResetPasswordPage component

**API Integration (RTK Query):**
```javascript
// store/api/authApi.js
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh-token
- POST /auth/forgot-password
- POST /auth/reset-password
- GET /auth/me
```

**Redux State:**
```javascript
// store/slices/authSlice.js
- user (current user object)
- token (JWT token)
- isAuthenticated (boolean)
- loading (boolean)
- error (error message)
```

**Features:**
- Form validation with Joi
- Password strength indicator
- Email verification (if enabled)
- MFA/TOTP support (optional)
- Remember me functionality
- Persistent login (localStorage + refresh token)

**Custom Hooks:**
- `useAuth()` - Get auth state
- `useLogin()` - Login mutation
- `useLogout()` - Logout mutation

#### 1.3 Layout & Navigation
**Components:**
- `Navbar/` - Top navigation
- `Sidebar/` - Side navigation (collapsible)
- `MainLayout/` - Main layout wrapper
- `AuthLayout/` - Auth pages layout
- `Footer/` - Footer component

**Features:**
- Role-based menu items
- Breadcrumb navigation
- Search bar in navbar
- User profile dropdown
- Notifications panel
- Theme switcher
- Responsive design

**Context:**
```javascript
// contexts/ThemeContext.jsx
- theme (light/dark mode)
- toggleTheme()
```

#### 1.4 Common Components Library
**UI Components:**
- Button (with variants: primary, secondary, danger)
- Input (text, email, password, number)
- Select/Dropdown
- Checkbox & Radio
- Modal/Dialog
- Card
- Badge
- Table (with sorting, pagination)
- Pagination
- Spinner/Loader
- Toast/Notification
- Alert
- Breadcrumb
- Tabs
- Accordion
- File Upload

**Example Pattern:**
```jsx
// components/common/Button/Button.jsx
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
```

#### 1.5 Routing & Navigation
**Route Structure:**
```javascript
// routes/Routes.jsx
- / → Dashboard (protected)
- /auth/login → LoginPage
- /auth/register → RegisterPage
- /auth/forgot-password → ForgotPasswordPage
- /auth/reset-password/:token → ResetPasswordPage
- /admin/* → Admin routes
- /teacher/* → Teacher routes
- /student/* → Student routes
- /* → 404 Not Found
```

**Protected Routes:**
```javascript
// components/routes/ProtectedRoute.jsx
- Check if user is authenticated
- Redirect to login if not

// components/routes/RoleRoute.jsx
- Check if user has required role
- Redirect to 403 if unauthorized
```

#### 1.6 API Client Setup
**Configuration:**
```javascript
// services/api.service.js
- Base URL: http://localhost:5000/api/v1
- Axios instance with interceptors
- Auth token injection
- Error handling
- Retry logic
```

**RTK Query Base Configuration:**
```javascript
// store/api/baseApi.js
- Create baseApi with CRUD operations
- Auto-injection of auth token
- Error handling middleware
- Cache invalidation strategy
```

**WebSocket Setup:**
```javascript
// services/socket.service.js
- Socket.IO connection
- Event handlers (connect, disconnect, error)
- Room subscription
- Message handling
```

---

### **Phase 2: Student Management** (8-10 hours)

#### 2.1 Student List & Management
**Pages:**
- `StudentsPage.jsx` - Student list with filters
- `AddStudentPage.jsx` - Create new student
- `EditStudentPage.jsx` - Edit student info
- `StudentDetailPage.jsx` - View full student profile

**Components:**
```
components/student/
├── StudentList/
│   ├── StudentList.jsx
│   ├── StudentListRow.jsx
│   ├── StudentListFilters.jsx
│   └── index.js
├── StudentForm/
│   ├── StudentForm.jsx
│   ├── PersonalInfoSection.jsx
│   ├── AddressSection.jsx
│   ├── EnrollmentSection.jsx
│   └── index.js
├── StudentCard/
│   ├── StudentCard.jsx
│   └── index.js
└── StudentTable/
    ├── StudentTable.jsx
    └── index.js
```

**API Endpoints (RTK Query):**
```javascript
// store/api/studentApi.js
- GET /students (list with filters)
- GET /students/:id (detail)
- POST /students (create)
- PUT /students/:id (update)
- PATCH /students/:id/status (update status)
- DELETE /students/:id (delete)
- POST /students/:id/enroll-class (enroll)
- GET /students/:id/enrollment (enrollment history)
- GET /students/:id/documents (documents)
- POST /students/:id/documents (upload document)
```

**Features:**
- Paginated list with sorting
- Advanced filtering (class, status, section)
- Search by name/roll number/email
- Bulk actions (select multiple, export)
- Add new student with form validation
- Edit student information
- View student profile with tabs:
  - Personal Info
  - Enrollment Details
  - Contact Information
  - Documents
  - Activities
- Status management (ACTIVE, INACTIVE, GRADUATED, TRANSFERRED)

**Form Validation:**
```javascript
// utils/validators.js
- Name (required, min 3 chars)
- Email (valid email format)
- Date of Birth (valid date, not future)
- Roll Number (alphanumeric)
- Class (required)
- Contact (valid phone format)
```

**Redux State (studentSlice):**
```javascript
- students (array of students)
- selectedStudent (current student)
- filters (filter state)
- pagination (page, limit, total)
- loading (boolean)
- error (error message)
```

#### 2.2 Student Dashboard
**Components:**
```
components/dashboard/StudentDashboard/
├── StudentDashboard.jsx
├── MyGradesCard.jsx
├── MyAttendanceCard.jsx
├── MyAssignmentsCard.jsx
├── AnnouncementsCard.jsx
└── QuickActionsCard.jsx
```

**Features:**
- Display student's own grades
- Attendance percentage
- Pending assignments
- Recent announcements
- Quick links to features
- Notifications from teachers

#### 2.3 Enrollment Management
**Components:**
```
components/student/
├── EnrollmentForm/
├── EnrollmentHistory/
└── ClassAssignment/
```

**Features:**
- Enroll student in class/section
- View enrollment history
- Transfer between classes
- Promote/Demote students
- Bulk enrollment from CSV

---

### **Phase 3: Teacher Management** (8-10 hours)

#### 3.1 Teacher List & Management
**Pages:**
- `TeachersPage.jsx` - Teacher directory
- `AddTeacherPage.jsx` - Create teacher
- `TeacherDetailPage.jsx` - View profile
- `TeacherClassesPage.jsx` - Classes assigned

**Components:**
```
components/teacher/
├── TeacherList/
│   ├── TeacherList.jsx
│   ├── TeacherListRow.jsx
│   └── TeacherListFilters.jsx
├── TeacherForm/
│   ├── TeacherForm.jsx
│   ├── PersonalInfoSection.jsx
│   └── QualificationsSection.jsx
├── TeacherCard/
├── TeacherClassesCard/
└── TeacherSubjectsCard/
```

**API Endpoints:**
```javascript
// store/api/teacherApi.js
- GET /teachers (list)
- GET /teachers/:id (detail)
- POST /teachers (create)
- PUT /teachers/:id (update)
- PATCH /teachers/:id/status (update status)
- GET /teachers/:id/classes (assigned classes)
- GET /teachers/:id/subjects (assigned subjects)
- GET /teachers/:id/students (student list)
- POST /teachers/:id/attendance (mark attendance)
- POST /teachers/:id/grades (submit grades)
```

**Features:**
- Teacher list with filtering
- Search by name/email/employee ID
- View teacher profile:
  - Personal information
  - Qualifications
  - Assigned classes
  - Assigned subjects
  - Students list
- Add/Edit teacher
- Assign classes and subjects
- Update employment status
- View performance metrics

#### 3.2 Teacher Dashboard
**Components:**
```
components/dashboard/TeacherDashboard/
├── TeacherDashboard.jsx
├── MyClassesCard.jsx
├── AttendanceMarkingCard.jsx
├── GradeEntryCard.jsx
├── MyStudentsCard.jsx
├── AssignmentsCard.jsx
└── UpcomingClassesCard.jsx
```

**Features:**
- List of assigned classes
- Quick attendance marking
- Quick grade entry
- My students list
- Pending assignments
- Today's schedule

#### 3.3 Class Management Interface
**Components:**
```
components/class/
├── ClassList/
├── ClassForm/
├── ClassDetail/
└── SectionManagement/
```

**Features:**
- View all classes
- Create/Edit class
- Manage class sections
- Assign class teachers
- Assign subjects
- Assign students to class

---

### **Phase 4: Finance & Revenue Management** (10-12 hours)

#### 4.1 Fee Management
**Pages:**
- `FinancePage.jsx` - Finance overview
- `FeeCollectionPage.jsx` - Collect fees
- `PaymentPage.jsx` - Record payments
- `InvoicePage.jsx` - Generate invoices
- `DefaultersPage.jsx` - Outstanding dues

**Components:**
```
components/finance/
├── FeeTable/
│   ├── FeeTable.jsx
│   └── FeeTableRow.jsx
├── PaymentForm/
│   ├── PaymentForm.jsx
│   ├── PaymentMethodSelector.jsx
│   └── PaymentSummary.jsx
├── InvoicePreview/
│   ├── InvoicePreview.jsx
│   └── InvoicePrint.jsx
├── DefaultersList/
│   ├── DefaultersList.jsx
│   └── DefaultersFilters.jsx
└── FeeStructureForm/
    ├── FeeStructureForm.jsx
    ├── ComponentEntry.jsx
    └── index.js
```

**API Endpoints:**
```javascript
// store/api/feeApi.js
- GET /fees (list with filters)
- GET /fees/:id (detail)
- POST /fees (create)
- PUT /fees/:id (update)
- DELETE /fees/:id (delete)
- POST /fees/:id/payment (record payment)
- GET /fees/:id/receipt (generate receipt)
- POST /fees/:id/reminder (send reminder)
- GET /fees/defaulters (outstanding dues)
- POST /fees/bulk-import (import from CSV)
- GET /fees/reports (fee reports)
```

**Features:**
- **Fee Structure:**
  - Define fee components (tuition, transport, etc.)
  - Set fees for classes/sections
  - Manage discounts and waivers
  - Fee structure by academic year

- **Fee Collection:**
  - List students with fees due
  - Collect payments
  - Multiple payment methods (cash, cheque, bank, online)
  - Receipt generation (print/download)
  - Partial payment tracking

- **Outstanding Dues:**
  - Identify defaulters
  - Send reminders
  - Track overdue amounts
  - Generate demand notices

- **Financial Reports:**
  - Fee collection summary
  - Outstanding dues report
  - Payment history
  - Defaulter list

**Redux State (feeSlice):**
```javascript
- fees (array of fees)
- selectedFee (current fee)
- payments (array of payments)
- filters (filter state)
- loading (boolean)
- error (error message)
```

#### 4.2 Finance Dashboard
**Components:**
```
components/dashboard/
├── FinanceDashboard.jsx
├── CollectionMetricsCard.jsx
├── OutstandingDuesCard.jsx
├── PaymentMethodChart.jsx
├── MonthlRevenueChart.jsx
└── DefaultersCard.jsx
```

**Features:**
- Collection metrics (total, pending, overdue)
- Outstanding dues summary
- Payment breakdown by method
- Monthly revenue trend
- Top defaulters
- Quick actions (collect fee, send reminder)

#### 4.3 Payment Integration
**Features:**
- Manual payment entry (cash, cheque)
- Online payment gateway integration
- Payment reconciliation
- Receipt generation
- Payment history

---

### **Phase 5: Analytics & Reporting** (12-15 hours)

#### 5.1 Analytics Dashboard
**Pages:**
- `AnalyticsDashboard.jsx` - Main analytics view
- `AcademicReports.jsx` - Academic metrics
- `FinancialReports.jsx` - Financial metrics
- `EngagementReports.jsx` - Engagement metrics
- `BenchmarkingPage.jsx` - School benchmarking

**Components:**
```
components/analytics/
├── Dashboard/
│   ├── AnalyticsDashboard.jsx
│   ├── KPICard.jsx
│   └── MetricsGrid.jsx
├── Charts/
│   ├── LineChart.jsx
│   ├── BarChart.jsx
│   ├── PieChart.jsx
│   ├── DoughnutChart.jsx
│   └── AreaChart.jsx
├── Reports/
│   ├── ReportTable.jsx
│   ├── ReportExporter.jsx
│   └── DateRangeFilter.jsx
├── Filters/
│   ├── DateRangeFilter.jsx
│   ├── ClassFilter.jsx
│   ├── SectionFilter.jsx
│   └── PeriodSelector.jsx
└── Widgets/
    ├── TrendCard.jsx
    ├── RankingCard.jsx
    └── ComparisonCard.jsx
```

**API Endpoints:**
```javascript
// store/api/analyticsApi.js
- GET /analytics/dashboard (overview)
- GET /analytics/academic (academic metrics)
- GET /analytics/financial (financial metrics)
- GET /analytics/engagement (engagement metrics)
- GET /analytics/performance (performance analysis)
- GET /analytics/trends (trend analysis)
- GET /analytics/benchmarks (benchmarking)
- GET /analytics/reports/:type (generate report)
- POST /analytics/export (export to PDF/Excel)
```

#### 5.2 Academic Analytics
**Reports:**
- Pass percentage by class
- Grade distribution analysis
- Top/Bottom performers
- Subject-wise performance
- Teacher performance metrics
- Student progress tracking
- Comparison with benchmarks

**Features:**
- Drill-down reports (school → class → subject → student)
- Trend analysis (year-over-year)
- Predictive insights
- Export to PDF/Excel
- Print functionality
- Real-time dashboard

#### 5.3 Financial Analytics
**Reports:**
- Fee collection rate
- Outstanding dues analysis
- Payment method breakdown
- Monthly revenue trend
- Expense tracking
- Budget vs actual
- Profit/Loss analysis

**Features:**
- Collection efficiency metrics
- Defaulter identification
- Revenue forecasting
- Expense analysis
- Cash flow tracking
- Budget compliance

#### 5.4 Engagement Analytics
**Reports:**
- Attendance trends
- Student engagement score
- Class participation rate
- Assignment submission rate
- Online activity tracking

**Features:**
- Identify at-risk students
- Engagement patterns
- Class-wise comparison
- Individual progress tracking

#### 5.5 Chart & Visualization Library
**Charts Used:**
- Line Charts (trends over time)
- Bar Charts (comparisons)
- Pie Charts (distribution)
- Doughnut Charts (composition)
- Area Charts (cumulative trends)
- Scatter Plots (correlations)
- Heat Maps (performance matrix)

**Tools:**
- Chart.js or Recharts or Victory Charts
- Table with sorting/filtering
- Data export (CSV, Excel, PDF)

---

### **Phase 6: Supporting Features** (8-10 hours)

#### 6.1 Attendance Management
**Components:**
```
components/attendance/
├── AttendanceMarkingForm/
├── AttendanceTable/
├── BulkAttendanceUpload/
└── AttendanceReports/
```

**Features:**
- Mark student attendance
- Bulk attendance marking
- Import from biometric
- Attendance reports
- Attendance percentage tracking
- Late arrival tracking
- Leave management

#### 6.2 Grade Management
**Components:**
```
components/grades/
├── GradeEntryForm/
├── GradeTable/
├── TranscriptView/
├── ReportCardPreview/
└── GradeAnalysis/
```

**Features:**
- Grade entry by exam
- Grade publishing
- Transcript generation
- Report card preview & print
- Grade analysis
- GPA calculation
- Grade distribution

#### 6.3 Communication
**Components:**
```
components/communication/
├── NoticeBoard/
├── Announcements/
├── Messages/
└── Events/
```

**Features:**
- Post notices & circulars
- Broadcast announcements
- Messaging system (teacher-student, teacher-parent)
- Event calendar
- Event registration

#### 6.4 User Profile & Settings
**Components:**
```
components/settings/
├── ProfilePage/
├── PasswordChange/
├── NotificationPreferences/
├── SchoolSettings/
└── ThemeSettings/
```

**Features:**
- Edit profile information
- Change password
- Notification preferences
- Theme selection (light/dark)
- Language selection
- Two-factor authentication

---

## 🔐 Authentication & Authorization

### Authentication Flow
```
User → Login → API /auth/login → JWT Token → Store in Redux + localStorage
→ Protected Routes Check → Dashboard

Logout → Clear Redux + localStorage → Redirect to Login
```

### RBAC (Role-Based Access Control)

**10 User Roles:**
1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - School administration
3. **PRINCIPAL** - Academic & administrative
4. **VICE_PRINCIPAL** - Support principal
5. **TEACHER** - Class & subject management
6. **STUDENT** - Own data access
7. **PARENT** - Child data & communication
8. **ACCOUNTANT** - Financial operations
9. **LIBRARIAN** - Library management
10. **ADMISSION_OFFICER** - Admission process

**Permission Mapping:**
```javascript
// utils/permissions.js
const permissions = {
  ADMIN: ['CREATE_STUDENT', 'EDIT_STUDENT', 'DELETE_STUDENT', ...],
  TEACHER: ['VIEW_STUDENTS', 'MARK_ATTENDANCE', 'ENTER_GRADES', ...],
  STUDENT: ['VIEW_GRADES', 'VIEW_ATTENDANCE', 'DOWNLOAD_DOCUMENTS', ...],
  PARENT: ['VIEW_CHILD_GRADES', 'VIEW_CHILD_ATTENDANCE', ...],
  ...
};
```

**Permission Check Hook:**
```javascript
// hooks/usePermission.js
const { can, canAny, canAll } = usePermission();

// Usage
{can('CREATE_STUDENT') && <Button>Add Student</Button>}
{canAny(['EDIT_STUDENT', 'DELETE_STUDENT']) && <ActionsMenu />}
{canAll(['VIEW_GRADES', 'EDIT_GRADES']) && <GradeForm />}
```

---

## 📦 Dependencies & Libraries

### Core
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x.x"
}
```

### State Management
```json
{
  "@reduxjs/toolkit": "^1.9.x",
  "react-redux": "^8.x.x",
  "@reduxjs/toolkit/query": "^1.9.x"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.x.x",
  "@heroicons/react": "^2.x.x",
  "react-hot-toast": "^2.x.x"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.x.x",
  "joi": "^17.x.x",
  "joi-browser": "^17.x.x"
}
```

### Charts & Data Viz
```json
{
  "recharts": "^2.x.x",
  "chart.js": "^4.x.x",
  "react-chartjs-2": "^5.x.x"
}
```

### HTTP & API
```json
{
  "axios": "^1.x.x",
  "socket.io-client": "^4.x.x"
}
```

### Date & Time
```json
{
  "dayjs": "^1.x.x",
  "date-fns": "^2.x.x"
}
```

### Utilities
```json
{
  "clsx": "^1.x.x",
  "lodash": "^4.x.x",
  "uuid": "^9.x.x"
}
```

### Development
```json
{
  "vite": "^4.x.x",
  "eslint": "^8.x.x",
  "prettier": "^3.x.x",
  "@testing-library/react": "^14.x.x",
  "vitest": "^0.x.x"
}
```

---

## 🎨 UI/UX Design Patterns

### Color Scheme
```javascript
// Tailwind color palette
primary: blue-600
secondary: gray-600
success: green-600
warning: amber-600
danger: red-600
info: cyan-600
```

### Typography
```javascript
- Font Family: Inter, Segoe UI, Roboto
- Heading: Bold, 24-32px
- Body: Regular, 14-16px
- Small: Regular, 12px
```

### Spacing
```javascript
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
```

### Component Sizes
```javascript
- Button: sm (8px padding), md (12px), lg (16px)
- Input: md (8px padding), lg (12px)
- Card: 16px padding
```

---

## 📱 Responsive Design

### Breakpoints
```javascript
mobile: < 640px    (sm)
tablet: 640-1024px (md-lg)
desktop: > 1024px  (xl)
```

### Mobile-First Approach
- Design for mobile first
- Progressively enhance for larger screens
- Responsive navigation (hamburger menu)
- Touch-friendly buttons (min 44px)

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Props validation
- Event handlers
- Conditional rendering

### Integration Tests
- Redux store integration
- API call integration
- Route transitions

### E2E Tests
- Login flow
- Student management flow
- Fee collection flow
- Report generation flow

### Tools
- Vitest (unit)
- React Testing Library (component)
- Cypress (E2E)

---

## 🚀 Deployment

### Build
```bash
npm run build
# Output: dist/
```

### Deployment Targets
- **Development:** http://localhost:5173
- **Staging:** staging.sms.com
- **Production:** sms.schoolname.com

### Environment Configuration
```
.env.development
.env.staging
.env.production
```

### CI/CD Pipeline
- GitHub Actions for automated testing
- Build on push to main/develop
- Auto-deploy to staging on merge to develop
- Manual approval for production

---

## 📊 Project Statistics

### Estimated Metrics
- **Total Files:** 150+
- **Total Components:** 80+
- **Total Pages:** 20+
- **Total API Endpoints:** 100+
- **Redux Slices:** 9
- **Custom Hooks:** 10+
- **Utility Functions:** 50+

### Code Quality
- ESLint configuration
- Prettier formatting
- 80%+ test coverage target
- Type safety (PropTypes)

---

## ⏱️ Timeline & Resource Allocation

### Phase Breakdown
| Phase | Hours | Duration | Dev |
|-------|-------|----------|-----|
| Phase 1 (Foundation) | 6-8 | 1-2 days | 1 |
| Phase 2 (Students) | 8-10 | 2-3 days | 1 |
| Phase 3 (Teachers) | 8-10 | 2-3 days | 1 |
| Phase 4 (Finance) | 10-12 | 2-3 days | 1-2 |
| Phase 5 (Analytics) | 12-15 | 3-4 days | 1-2 |
| Phase 6 (Support) | 8-10 | 2-3 days | 1 |
| **TOTAL** | **52-65** | **14-18 days** | **1-2** |

### Resource Needs
- 1-2 Frontend Developers
- 1 UI/UX Designer (optional)
- 1 QA Engineer (optional)

---

## ✅ Success Criteria

### Functionality
- ✅ All pages functional
- ✅ All API integrations working
- ✅ RBAC properly enforced
- ✅ Data validation on client-side
- ✅ Error handling implemented

### Performance
- ✅ Page load time < 3 seconds
- ✅ API response time < 1 second
- ✅ No console errors
- ✅ 90+ Lighthouse score

### User Experience
- ✅ Intuitive navigation
- ✅ Responsive design
- ✅ Accessible (WCAG AA)
- ✅ Proper error messages
- ✅ Loading states

### Code Quality
- ✅ 80%+ test coverage
- ✅ ESLint compliant
- ✅ Prettier formatted
- ✅ No TypeScript errors (if used)

---

## 🔄 Iteration & Improvement

### Phase 2 Features (Post-launch)
- [ ] Advanced reporting & analytics
- [ ] Mobile app support
- [ ] Real-time notifications (WebSocket)
- [ ] Offline mode
- [ ] Advanced search & filters
- [ ] Data export (PDF, Excel, CSV)
- [ ] Audit logging
- [ ] API documentation (Swagger)

### Maintenance
- Monthly dependency updates
- Security patches
- Performance optimization
- Bug fixes

---

## 📖 Documentation Requirements

### For Developers
- Component documentation (Storybook)
- API documentation (Swagger/OpenAPI)
- Redux store documentation
- Custom hooks documentation
- Utils & helpers documentation

### For Users
- User guide (role-based)
- Video tutorials
- FAQ
- Troubleshooting guide

---

## 🎓 Code Examples & Patterns

### Example 1: Student List Component
```jsx
// pages/students/StudentsPage.jsx
import { useGetStudentsQuery } from '@/store/api/studentApi';
import StudentList from '@/components/student/StudentList';
import { useState } from 'react';

export default function StudentsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    classId: null,
  });

  const { data, isLoading, error } = useGetStudentsQuery(filters);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorAlert message={error.message} />;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Students</h1>
      <StudentList 
        students={data.data} 
        pagination={data.pagination}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
```

### Example 2: Redux Slice
```javascript
// store/slices/studentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    students: [],
    selectedStudent: null,
    filters: {},
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    selectStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
  },
});

export default studentSlice.reducer;
```

### Example 3: RTK Query API
```javascript
// store/api/studentApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: (filters) => ({
        url: '/students',
        params: filters,
      }),
    }),
    getStudent: builder.query({
      query: (id) => `/students/${id}`,
    }),
    createStudent: builder.mutation({
      query: (data) => ({
        url: '/students',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetStudentsQuery, useGetStudentQuery, useCreateStudentMutation } = studentApi;
```

---

## ❓ FAQ

**Q: How long will it take to implement?**  
A: 40-50 hours for a single developer, 25-30 hours with 2 developers.

**Q: Can I start with just the core features?**  
A: Yes, start with Phases 1-3 (foundation, students, teachers), then add finance and analytics.

**Q: What if I want to customize the UI?**  
A: Use Tailwind CSS utilities or replace with Material-UI/Bootstrap as needed.

**Q: How do I handle real-time updates?**  
A: Use Socket.IO for notifications, grade updates, and live dashboard updates.

**Q: Can I add more modules later?**  
A: Yes, the architecture is designed to be extensible. Each module is independent.

---

## 📞 Next Steps

1. **Review This Plan** - Read through all phases
2. **Setup Frontend** - Follow Phase 1 guide
3. **Implement Foundation** - Create base components and routing
4. **Implement Phase 2** - Student management
5. **Implement Phase 3** - Teacher management
6. **Implement Phase 4** - Finance management
7. **Implement Phase 5** - Analytics & reporting
8. **Testing & Deployment** - Test all features and deploy

---

**Document Version:** 1.0  
**Last Updated:** May 5, 2026  
**Status:** Ready for Implementation  
**Aligned With:** Backend Phase 40, Testing Framework Complete
