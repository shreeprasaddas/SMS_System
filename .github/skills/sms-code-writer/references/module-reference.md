# Module Reference (16 Modules)

Use this to find which controller, service, and models to write code in.

## 1. Auth Module

**Routes:** `auth.routes.js`  
**Controller:** `auth.controller.js`  
**Service:** `auth.service.js`  
**Models:** `User.model.js`, `UserSession.model.js`

### Handles
- Login/logout
- JWT access + refresh token generation
- Password reset
- TOTP MFA setup & verification
- Session management

### Endpoints
```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/mfa/setup
POST   /api/v1/auth/mfa/verify
```

---

## 2. User Module

**Routes:** `user.routes.js`  
**Controller:** `user.controller.js`  
**Models:** `User.model.js`

### Handles
- User CRUD (admins only)
- Profile management
- Role assignment
- Password change

### Endpoints
```
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/users/:id/profile
PUT    /api/v1/users/:id/profile
POST   /api/v1/users/:id/change-password
```

---

## 3. Student Module

**Routes:** `student.routes.js`  
**Controller:** `student.controller.js`  
**Models:** `Student.model.js`, `Parent.model.js`

### Handles
- Student enrollment
- Student transfers & promotions
- Parent assignment
- Student documents
- Siblings management

### Endpoints
```
GET    /api/v1/students
POST   /api/v1/students
GET    /api/v1/students/:id
PUT    /api/v1/students/:id
DELETE /api/v1/students/:id
POST   /api/v1/students/:id/promote
POST   /api/v1/students/:id/transfer
GET    /api/v1/students/:id/attendance
GET    /api/v1/students/:id/grades
POST   /api/v1/students/:id/documents
```

---

## 4. Teacher Module

**Routes:** `teacher.routes.js`  
**Controller:** `teacher.controller.js`  
**Models:** `Teacher.model.js`, `TeacherSubject.model.js`

### Handles
- Teacher hiring & management
- Subject assignment
- Qualifications & certifications
- Leave records

### Endpoints
```
GET    /api/v1/teachers
POST   /api/v1/teachers
GET    /api/v1/teachers/:id
PUT    /api/v1/teachers/:id
DELETE /api/v1/teachers/:id
POST   /api/v1/teachers/:id/subjects
GET    /api/v1/teachers/:id/classes
```

---

## 5. Academic Module

**Routes:** `class.routes.js`, `subject.routes.js`  
**Controller:** `class.controller.js`, `subject.controller.js`  
**Models:** `Class.model.js`, `Section.model.js`, `Subject.model.js`, `AcademicYear.model.js`, `Stream.model.js`, `Curriculum.model.js`

### Handles
- Class & section management
- Subject catalog
- Curriculum mapping
- Academic year setup
- Stream management

### Endpoints
```
GET    /api/v1/classes
POST   /api/v1/classes
GET    /api/v1/classes/:id/sections
POST   /api/v1/classes/:id/sections

GET    /api/v1/subjects
POST   /api/v1/subjects
GET    /api/v1/subjects/:id
PUT    /api/v1/subjects/:id

GET    /api/v1/academic-years
POST   /api/v1/academic-years
```

---

## 6. Attendance Module

**Routes:** `attendance.routes.js`  
**Controller:** `attendance.controller.js`  
**Service:** `attendance.service.js`  
**Models:** `StudentAttendance.model.js`, `StaffAttendance.model.js`, `AttendanceRule.model.js`, `HolidayCalendar.model.js`

### Handles
- Daily attendance marking (students & staff)
- Attendance rules (working days)
- Holiday calendar
- Attendance reports & analytics
- Bulk attendance operations

### Endpoints
```
POST   /api/v1/attendance/mark
POST   /api/v1/attendance/bulk-mark
GET    /api/v1/attendance/report
GET    /api/v1/attendance/students/:id
GET    /api/v1/attendance/staff/:id
POST   /api/v1/holidays
GET    /api/v1/holidays
```

---

## 7. Timetable Module

**Routes:** `timetable.routes.js`  
**Controller:** `timetable.controller.js`  
**Models:** `Timetable.model.js`, `TimeSlot.model.js`, `TimetableChange.model.js`, `TeacherTimetable.model.js`

### Handles
- Class timetable creation
- Teacher timetable generation
- Timetable changes & substitutions
- Time slot management
- Conflict detection

### Endpoints
```
GET    /api/v1/timetables
POST   /api/v1/timetables
GET    /api/v1/timetables/:id
PUT    /api/v1/timetables/:id
POST   /api/v1/timetables/:id/publish
GET    /api/v1/teacher-timetables/:teacherId
```

---

## 8. Exam Module

**Routes:** `exam.routes.js`  
**Controller:** `exam.controller.js`  
**Models:** `Exam.model.js`, `ExamSchedule.model.js`, `QuestionBank.model.js`, `QuestionPaper.model.js`, `SeatAllocation.model.js`

### Handles
- Exam creation & scheduling
- Question bank management
- Question paper generation
- Seat allocation for exams
- Exam rules & conduct

### Endpoints
```
GET    /api/v1/exams
POST   /api/v1/exams
GET    /api/v1/exams/:id
PUT    /api/v1/exams/:id
POST   /api/v1/exams/:id/schedule
POST   /api/v1/exams/:id/seat-allocation
GET    /api/v1/question-banks
```

---

## 9. Grade Module

**Routes:** `grade.routes.js`  
**Controller:** `grade.controller.js`  
**Service:** `grade.service.js`  
**Models:** `Grade.model.js`, `GradeScale.model.js`, `ContinuousAssessment.model.js`, `ReportCard.model.js`

### Handles
- Grade entry (marks)
- Continuous assessment (CA) scoring
- Grade scale configuration
- Report card generation
- Grade publication & locking

### Endpoints
```
POST   /api/v1/grades/bulk-entry
GET    /api/v1/grades/:studentId
GET    /api/v1/grades/:studentId/:examId
POST   /api/v1/grades/:id/publish
GET    /api/v1/report-cards/:studentId
GET    /api/v1/grade-scales
```

---

## 10. Assignment Module

**Routes:** `assignment.routes.js`  
**Controller:** `assignment.controller.js`  
**Models:** `Assignment.model.js`, `Submission.model.js`, `Evaluation.model.js`, `Rubric.model.js`

### Handles
- Assignment creation & distribution
- Submission management
- Peer/teacher grading
- Rubric-based evaluation
- Assignment tracking

### Endpoints
```
GET    /api/v1/assignments
POST   /api/v1/assignments
GET    /api/v1/assignments/:id/submissions
POST   /api/v1/assignments/:id/submit
POST   /api/v1/submissions/:id/grade
GET    /api/v1/assignments/:id/rubric
```

---

## 11. Finance Module (Fees & Expenses)

**Routes:** `fee.routes.js`, `expense.routes.js`  
**Controller:** `fee.controller.js`, `expense.controller.js`  
**Service:** `fee.service.js`  
**Models:** `FeeStructure.model.js`, `StudentFee.model.js`, `Invoice.model.js`, `Payment.model.js`, `Concession.model.js`, `Expense.model.js`, `Budget.model.js`

### Handles
- Fee structure setup
- Student fee assignment
- Invoice generation & tracking
- Payment processing (Razorpay)
- Concessions & waivers
- Expense recording
- Budget planning

### Endpoints
```
GET    /api/v1/fees
POST   /api/v1/fees/bulk-generate
GET    /api/v1/fees/:studentId
POST   /api/v1/payments
GET    /api/v1/payments/:id
POST   /api/v1/concessions
POST   /api/v1/expenses
GET    /api/v1/expenses/report
POST   /api/v1/budgets
```

---

## 12. Library Module

**Routes:** `library.routes.js`  
**Controller:** `library.controller.js`  
**Models:** `Book.model.js`, `BookShelf.model.js`, `BookIssue.model.js`, `LibraryMember.model.js`, `LibraryFine.model.js`

### Handles
- Book catalog management
- Book issue & return
- Library member management
- Overdue tracking & fines
- Inventory management

### Endpoints
```
GET    /api/v1/books
POST   /api/v1/books
POST   /api/v1/books/:id/issue
POST   /api/v1/books/:id/return
GET    /api/v1/library-members/:id/issued-books
GET    /api/v1/library-fines
POST   /api/v1/library-fines/:id/pay
```

---

## 13. Transport Module

**Routes:** `transport.routes.js`  
**Controller:** `transport.controller.js`  
**Models:** `Bus.model.js`, `Route.model.js`, `Stop.model.js`, `Driver.model.js`, `BusAttendance.model.js`, `StudentBusAssign.model.js`

### Handles
- Bus fleet management
- Route planning
- Stop management
- Driver assignment
- Student bus allocation
- Bus attendance tracking

### Endpoints
```
GET    /api/v1/buses
POST   /api/v1/buses
GET    /api/v1/routes
POST   /api/v1/routes
POST   /api/v1/bus-assignments
GET    /api/v1/bus-attendance
POST   /api/v1/bus-attendance/mark
```

---

## 14. Hostel Module

**Routes:** `hostel.routes.js`  
**Controller:** `hostel.controller.js`  
**Models:** `Hostel.model.js`, `Room.model.js`, `StudentHostel.model.js`, `HostelAttendance.model.js`, `HostelLeave.model.js`, `HostelVisitor.model.js`, `HostelFee.model.js`

### Handles
- Hostel & room management
- Student hostel allocation
- Hostel attendance (check-in/out)
- Leave management (hostel leaves)
- Visitor management
- Hostel fees

### Endpoints
```
GET    /api/v1/hostels
POST   /api/v1/hostels/:id/allocate
GET    /api/v1/hostels/:id/rooms
POST   /api/v1/hostel-attendance/check-in
POST   /api/v1/hostel-attendance/check-out
POST   /api/v1/hostel-leaves
GET    /api/v1/hostel-visitors
```

---

## 15. HR & Payroll Module

**Routes:** `hr.routes.js`, `payroll.routes.js`  
**Controller:** `hr.controller.js`, `payroll.controller.js`  
**Service:** `payroll.service.js`  
**Models:** `Department.model.js`, `Designation.model.js`, `Salary.model.js`, `Payroll.model.js`, `LeaveType.model.js`, `LeaveApplication.model.js`, `Recruitment.model.js`, `PerformanceAppraisal.model.js`

### Handles
- Department & designation management
- Salary structure setup
- Payroll processing & salary slip generation
- Leave type & leave application management
- Recruitment tracking
- Performance appraisals

### Endpoints
```
GET    /api/v1/departments
POST   /api/v1/leave-types
POST   /api/v1/leave-applications
GET    /api/v1/leave-applications/:id
PUT    /api/v1/leave-applications/:id/approve
POST   /api/v1/payroll/process
GET    /api/v1/payroll/:id/salary-slip
POST   /api/v1/recruitment
GET    /api/v1/appraisals
```

---

## 16. Communication Module

**Routes:** `communication.routes.js`  
**Controller:** `communication.controller.js`  
**Service:** `notification.service.js`  
**Models:** `Announcement.model.js`, `Message.model.js`, `NoticeBoard.model.js`, `Notification.model.js`, `EventCalendar.model.js`, `ChatRoom.model.js`

### Handles
- School announcements
- SMS/email notifications
- Notice board management
- Event calendar
- Chat & messaging (via Socket.IO)
- Notification preferences

### Endpoints
```
GET    /api/v1/announcements
POST   /api/v1/announcements
POST   /api/v1/notifications/send
GET    /api/v1/notifications
GET    /api/v1/events
POST   /api/v1/events
POST   /api/v1/messages
GET    /api/v1/chat-rooms/:id/messages
```

### WebSocket Events
```
socket.on('join:room', roomId)
socket.on('message:send', { roomId, content })
socket.on('message:new', msg)
socket.on('notification:new', notification)
```

---

## 17. System & Settings Module

**Routes:** `system.routes.js`  
**Controller:** `system.controller.js`  
**Models:** `SystemConfig.model.js`, `SchoolInfo.model.js`, `Policy.model.js`, `AuditLog.model.js`, `ActivityLog.model.js`

### Handles
- School information
- System configuration
- Policies & rules
- Audit logging
- Activity tracking
- Backup & recovery

### Endpoints
```
GET    /api/v1/school-info
PUT    /api/v1/school-info
GET    /api/v1/settings
POST   /api/v1/settings
GET    /api/v1/audit-logs
GET    /api/v1/activity-logs
POST   /api/v1/backup
```

---

**End of Module Reference**
