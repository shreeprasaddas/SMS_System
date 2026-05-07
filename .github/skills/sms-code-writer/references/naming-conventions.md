# Naming Conventions

## File Naming Rules (Never Deviate)

| File Type | Convention | Example | Location |
|-----------|-----------|---------|----------|
| Model | `PascalCase` + `.model.js` | `Student.model.js`, `StudentFee.model.js` | `backend/src/models/<domain>/` |
| Controller | `camelCase` + `.controller.js` | `student.controller.js`, `fee.controller.js` | `backend/src/controllers/` |
| Service | `camelCase` + `.service.js` | `fee.service.js`, `attendance.service.js` | `backend/src/services/` |
| Route | `camelCase` + `.routes.js` | `student.routes.js`, `attendance.routes.js` | `backend/src/routes/` |
| Middleware | `camelCase` + `.middleware.js` | `auth.middleware.js`, `cors.middleware.js` | `backend/src/middleware/` |
| Validation | `camelCase` + `.validation.js` | `student.validation.js`, `exam.validation.js` | `backend/src/validations/` |
| Job | `camelCase` + `.job.js` | `payrollGeneration.job.js`, `feeReminder.job.js` | `backend/src/jobs/` |
| Socket | `camelCase` + `.socket.js` | `chat.socket.js`, `notification.socket.js` | `backend/src/sockets/` |
| Event | `camelCase` + `.events.js` | `exam.events.js`, `payment.events.js` | `backend/src/events/` |
| React Component | `PascalCase` + `.jsx` | `StudentList.jsx`, `StudentForm.jsx` | `frontend/src/components/<domain>/` |
| React Hook | `camelCase`, starts with `use` | `useAuth.js`, `useAttendance.js` | `frontend/src/hooks/` |
| Redux Slice | `camelCase` + `Slice.js` | `authSlice.js`, `uiSlice.js` | `frontend/src/store/slices/` |
| RTK Query | `camelCase` + `Api.js` | `studentApi.js`, `feeApi.js` | `frontend/src/store/api/` |
| Utility | `camelCase` + `Helper.js` or `.utils.js` | `dateHelper.js`, `errorHelper.js` | `frontend/src/utils/` or `backend/src/utils/` |
| Type/Interface | `camelCase` + `.types.ts` | `student.types.ts`, `exam.types.ts` | `shared/types/` |
| Constant | `SCREAMING_SNAKE_CASE` in files | `ROLES = ['ADMIN', ...]` | `shared/constants/` or `backend/src/config/` |

## Component Folder Structure

Every React component lives in its own folder:

```
StudentList/
  ├── StudentList.jsx          ← main component (max 150 lines)
  ├── StudentListRow.jsx       ← sub-component for each row
  ├── StudentListFilters.jsx   ← sub-component for filters
  ├── StudentListHeader.jsx    ← if needed
  └── index.js                 ← barrel export
```

**Barrel Export:**
```javascript
// StudentList/index.js
export { default } from './StudentList';
```

**Usage:**
```javascript
import StudentList from '../components/student/StudentList';
```

## Model Grouping by Domain

Models are organized by domain inside `models/` folder:

```
backend/src/models/
├── user/
│   ├── User.model.js
│   ├── Student.model.js
│   ├── Teacher.model.js
│   ├── Parent.model.js
│   └── UserSession.model.js
├── academic/
│   ├── Class.model.js
│   ├── Section.model.js
│   ├── Subject.model.js
│   ├── Stream.model.js
│   ├── AcademicYear.model.js
│   └── Curriculum.model.js
├── attendance/
│   ├── StudentAttendance.model.js
│   ├── StaffAttendance.model.js
│   ├── AttendanceRule.model.js
│   └── HolidayCalendar.model.js
├── exam/
│   ├── Exam.model.js
│   ├── ExamSchedule.model.js
│   ├── QuestionBank.model.js
│   ├── SeatAllocation.model.js
│   └── ExamResult.model.js
├── grade/
│   ├── Grade.model.js
│   ├── GradeScale.model.js
│   ├── ContinuousAssessment.model.js
│   └── ReportCard.model.js
├── finance/
│   ├── FeeStructure.model.js
│   ├── StudentFee.model.js
│   ├── Invoice.model.js
│   ├── Payment.model.js
│   ├── Concession.model.js
│   ├── Expense.model.js
│   └── Budget.model.js
├── library/
│   ├── Book.model.js
│   ├── BookShelf.model.js
│   ├── BookIssue.model.js
│   ├── LibraryMember.model.js
│   └── LibraryFine.model.js
├── transport/
│   ├── Bus.model.js
│   ├── Route.model.js
│   ├── Stop.model.js
│   ├── BusAttendance.model.js
│   └── StudentBusAssign.model.js
├── hostel/
│   ├── Hostel.model.js
│   ├── Room.model.js
│   ├── StudentHostel.model.js
│   ├── HostelAttendance.model.js
│   ├── HostelLeave.model.js
│   └── HostelVisitor.model.js
├── hr/
│   ├── Department.model.js
│   ├── Designation.model.js
│   ├── LeaveType.model.js
│   ├── LeaveApplication.model.js
│   ├── Recruitment.model.js
│   └── PerformanceAppraisal.model.js
├── payroll/
│   ├── Salary.model.js
│   ├── Payroll.model.js
│   ├── PayrollProcess.model.js
│   └── SalarySlip.model.js
└── system/
    ├── SystemConfig.model.js
    ├── SchoolInfo.model.js
    ├── Policy.model.js
    ├── AuditLog.model.js
    └── ActivityLog.model.js
```

## Variable & Function Naming

| Type | Convention | Example |
|------|-----------|---------|
| Boolean | Prefix with `is`, `has`, `can`, `should` | `isActive`, `hasAccess`, `canDelete` |
| Array | Plural | `students`, `fees`, `grades` |
| Map/Object | Use domain name | `studentMap`, `feeByClass` |
| URL variable | `{id}` format | `/api/v1/students/:id` |
| Query param | camelCase | `?classId=...&status=...` |
| Redux action | `SCREAMING_SNAKE_CASE` | `SET_USER`, `FETCH_STUDENTS_SUCCESS` |
| Enum value | `SCREAMING_SNAKE_CASE` | `PENDING`, `ACTIVE`, `GRADUATED` |
| Event name | `resource:action` | `student:created`, `fee:paid`, `grade:published` |
| Class/Constructor | `PascalCase` | `Student`, `FeeCalculator` |
| Constant | `SCREAMING_SNAKE_CASE` | `MAX_FILE_SIZE`, `DEFAULT_PAGE_LIMIT` |
| Private variable | Prefix with `_` | `_id` (already a MongoDB convention) |

## Shared Types (shared/types/)

```typescript
// student.types.ts
export interface Student {
  _id: string;
  schoolId: string;
  userId: string;
  classId: string;
  sectionId?: string;
  studentId: string;
  rollNumber?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'LEFT';
  contact: {
    phone: string;
    emergencyPhone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudentResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto?: string;
  class: { _id: string; name: string };
}
```

## Shared Constants (shared/constants/)

```javascript
// roles.js
export const ROLES = [
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
  'RECEPTIONIST',
];

// status.js
export const STUDENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  GRADUATED: 'GRADUATED',
  TRANSFERRED: 'TRANSFERRED',
  LEFT: 'LEFT',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  HALF_DAY: 'HALF_DAY',
  HOLIDAY: 'HOLIDAY',
  LEAVE: 'LEAVE',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};
```

---

**End of Naming Conventions**
