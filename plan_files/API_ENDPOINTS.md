# School Management System - API Endpoints Reference

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.schoolmanagementsystem.com/api/v1
```

---

## 1. AUTHENTICATION ENDPOINTS

```
POST   /auth/register                  - Register new user
POST   /auth/login                     - User login
POST   /auth/logout                    - User logout
POST   /auth/refresh-token             - Refresh JWT token
POST   /auth/forgot-password           - Request password reset
POST   /auth/reset-password            - Reset password with token
POST   /auth/verify-email              - Verify email address
POST   /auth/verify-otp                - Verify OTP
POST   /auth/resend-otp                - Resend OTP
POST   /auth/enable-mfa                - Enable 2-factor authentication
POST   /auth/disable-mfa               - Disable 2-factor authentication
GET    /auth/me                        - Get current user profile
POST   /auth/change-password           - Change password
```

---

## 2. USER MANAGEMENT ENDPOINTS

```
// GET Endpoints
GET    /users                          - Get all users (Admin only)
GET    /users/:id                      - Get user by ID
GET    /users/role/:role               - Get users by role
GET    /users/school/:schoolId         - Get users by school
GET    /users/:id/profile              - Get user profile
GET    /users/:id/activities           - Get user activity logs

// POST Endpoints
POST   /users                          - Create new user
POST   /users/:id/activate             - Activate user account
POST   /users/:id/deactivate           - Deactivate user account
POST   /users/:id/block                - Block user account
POST   /users/:id/assign-role          - Assign role to user

// PUT/PATCH Endpoints
PUT    /users/:id                      - Update user information
PATCH  /users/:id/profile              - Update user profile
PATCH  /users/:id/email                - Update email address
PATCH  /users/:id/phone                - Update phone number
PATCH  /users/:id/avatar               - Upload profile photo

// DELETE Endpoints
DELETE /users/:id                      - Delete user account
```

---

## 3. STUDENT ENDPOINTS

```
// Student Master Data
GET    /students                       - Get all students (paginated)
GET    /students?class=classId&status=active - Filter students
POST   /students                       - Create new student
GET    /students/:id                   - Get student details
PUT    /students/:id                   - Update student information
PATCH  /students/:id/status            - Update student status (ACTIVE, GRADUATED, etc.)
DELETE /students/:id                   - Delete student record

// Student Enrollment
GET    /students/:id/enrollment        - Get enrollment details
POST   /students/:id/enroll-class      - Enroll in class
POST   /students/:id/section-assign    - Assign to section
GET    /students/:id/history           - Get enrollment history

// Student Documents
GET    /students/:id/documents         - Get student documents
POST   /students/:id/documents         - Upload document
DELETE /students/:id/documents/:docId  - Delete document

// Promotions & Status
POST   /students/:id/promote           - Promote to next class
POST   /students/:id/demote            - Demote to previous class
POST   /students/:id/transfer-in       - Transfer in from another school
POST   /students/:id/transfer-out      - Transfer out to another school
POST   /students/:id/leave-absence     - Mark leave of absence
POST   /students/:id/readmit           - Re-admit student

// Co-curricular Activities
GET    /students/:id/activities        - Get student activities
POST   /students/:id/activities        - Add activity participation
GET    /students/:id/achievements      - Get achievements & awards
```

---

## 4. CLASS MANAGEMENT ENDPOINTS

```
// Class Operations
GET    /classes                        - Get all classes
POST   /classes                        - Create new class
GET    /classes/:id                    - Get class details
PUT    /classes/:id                    - Update class
DELETE /classes/:id                    - Delete class

// Class Students
GET    /classes/:id/students           - Get students in class
POST   /classes/:id/add-students       - Bulk add students
DELETE /classes/:id/students/:studentId - Remove student from class

// Class Subjects
GET    /classes/:id/subjects           - Get subjects for class
POST   /classes/:id/subjects           - Assign subjects to class
DELETE /classes/:id/subjects/:subjectId - Remove subject from class

// Class Teachers
GET    /classes/:id/teachers           - Get assigned teachers
POST   /classes/:id/teachers           - Assign teacher to class
DELETE /classes/:id/teachers/:teacherId - Remove teacher

// Sections
GET    /classes/:id/sections           - Get sections
POST   /classes/:id/sections           - Create section
PUT    /classes/:classId/sections/:id  - Update section
DELETE /classes/:classId/sections/:id  - Delete section
```

---

## 5. SUBJECT ENDPOINTS

```
GET    /subjects                       - Get all subjects
POST   /subjects                       - Create new subject
GET    /subjects/:id                   - Get subject details
PUT    /subjects/:id                   - Update subject
DELETE /subjects/:id                   - Delete subject

GET    /subjects/category/:type        - Get subjects by type (CORE, ELECTIVE)
POST   /subjects/bulk-create           - Bulk create subjects
GET    /subjects/:id/teachers          - Get assigned teachers
GET    /subjects/:id/classes           - Get classes teaching this subject
```

---

## 6. ATTENDANCE ENDPOINTS

```
// Mark Attendance
POST   /attendance/mark                - Mark attendance for class
POST   /attendance/bulk-upload         - Bulk upload attendance
GET    /attendance/:id                 - Get attendance record

// Student Attendance
GET    /students/:id/attendance        - Get student's attendance records
GET    /students/:id/attendance/report - Get attendance report (percentage, trends)
GET    /students/:id/attendance/summary - Get attendance summary

// Class Attendance
GET    /classes/:id/attendance         - Get class attendance for date
GET    /classes/:id/attendance/report  - Class attendance report
POST   /classes/:id/attendance/alert   - Get low attendance alerts

// Attendance Rules
GET    /attendance-rules               - Get all attendance rules
POST   /attendance-rules               - Create attendance rule
PUT    /attendance-rules/:id           - Update rule
GET    /attendance-rules/:id/apply     - Apply rule to class
```

---

## 7. TIMETABLE ENDPOINTS

```
// Class Timetable
GET    /timetables                     - Get all timetables
POST   /timetables                     - Create timetable
GET    /timetables/:id                 - Get timetable details
PUT    /timetables/:id                 - Update timetable
DELETE /timetables/:id                 - Delete timetable

// Generate Timetable
POST   /timetables/generate            - Auto-generate timetable (constraint-based)
GET    /timetables/:id/conflicts       - Check scheduling conflicts
POST   /timetables/:id/validate        - Validate timetable

// View Timetable
GET    /timetables/class/:classId      - Get class timetable
GET    /timetables/teacher/:teacherId  - Get teacher timetable
GET    /timetables/student/:studentId  - Get student timetable

// Changes & Substitutions
POST   /timetables/:id/change          - Request schedule change
PUT    /timetables/:id/substitute      - Assign substitute teacher
DELETE /timetables/:id/change/:changeId - Cancel schedule change
```

---

## 8. EXAM ENDPOINTS

```
// Exam Management
GET    /exams                          - Get all exams
POST   /exams                          - Create new exam
GET    /exams/:id                      - Get exam details
PUT    /exams/:id                      - Update exam
DELETE /exams/:id                      - Delete exam
POST   /exams/:id/publish              - Publish exam results

// Exam Schedule
GET    /exams/:id/schedule             - Get exam schedule
POST   /exams/:id/schedule             - Create exam timetable
PUT    /exams/:id/schedule/:scheduleId - Update schedule

// Question Bank
GET    /exams/:id/questions            - Get questions for exam
POST   /exams/:id/questions            - Add questions to exam
DELETE /exams/:id/questions/:questionId - Remove question

// Question Papers
GET    /exams/:id/papers               - Get question papers
POST   /exams/:id/papers/generate      - Generate question paper
GET    /exams/:id/papers/:paperId      - Get question paper details
POST   /exams/:id/papers/:paperId/print - Print question paper

// Seat Allocation
POST   /exams/:id/seat-allocation      - Auto-allocate seats
GET    /exams/:id/seat-arrangement     - Get seat arrangement
POST   /exams/:id/admit-cards/generate - Generate admit cards

// Answer Scripts
POST   /exams/:id/upload-answer        - Upload answer script
GET    /exams/:id/answer/:scriptId     - View answer script
POST   /exams/:id/answer/:scriptId/mark - Mark answer script
```

---

## 9. GRADE & RESULT ENDPOINTS

```
// Grade Entry
POST   /grades                         - Enter grades
POST   /grades/bulk-upload             - Bulk upload grades
GET    /grades/:id                     - Get grade details
PUT    /grades/:id                     - Update grade
DELETE /grades/:id                     - Delete grade

// Student Grades
GET    /students/:id/grades            - Get student's all grades
GET    /students/:id/grades/:examId    - Get grades for specific exam
GET    /students/:id/grades/report     - Get grade report

// Class Grades
GET    /classes/:id/grades/:examId     - Get class grades for exam
GET    /classes/:id/grades/report      - Class performance report
GET    /classes/:id/grades/toppers     - Get top performers

// Grade Configuration
GET    /grade-scales                   - Get grade scales
POST   /grade-scales                   - Create grade scale
PUT    /grade-scales/:id               - Update grade scale

// Results
POST   /results/declare                - Declare results
GET    /results/:examId                - Get results for exam
GET    /students/:id/results           - Get student results
POST   /results/:id/re-evaluate        - Request re-evaluation
```

---

## 10. ASSIGNMENT ENDPOINTS

```
// Assignment Management
GET    /assignments                    - Get all assignments
POST   /assignments                    - Create assignment
GET    /assignments/:id                - Get assignment details
PUT    /assignments/:id                - Update assignment
DELETE /assignments/:id                - Delete assignment
POST   /assignments/:id/publish        - Publish assignment

// Student Assignments
GET    /students/:id/assignments       - Get student's assignments
GET    /students/:id/assignments/pending - Get pending assignments
GET    /assignments/:id/students       - Get submissions by students

// Submissions
POST   /assignments/:id/submit         - Submit assignment
GET    /assignments/:id/submissions    - Get all submissions
GET    /assignments/:id/submissions/:studentId - Get student submission
PUT    /assignments/:id/submissions/:studentId - Update submission

// Evaluation
POST   /assignments/:id/submissions/:studentId/grade - Grade submission
GET    /assignments/:id/submissions/:studentId/feedback - Get feedback
PUT    /assignments/:id/submissions/:studentId/feedback - Add feedback
POST   /assignments/:id/submissions/:studentId/resubmit - Allow resubmission
```

---

## 11. FEE MANAGEMENT ENDPOINTS

```
// Fee Structure
GET    /fee-structures                 - Get all fee structures
POST   /fee-structures                 - Create fee structure
GET    /fee-structures/:id             - Get fee structure details
PUT    /fee-structures/:id             - Update fee structure

// Student Fees
GET    /students/:id/fees              - Get student's fees
POST   /students/:id/fees/calculate    - Calculate fee with concessions
GET    /students/:id/fees/due          - Get outstanding dues
POST   /students/:id/fees/concession   - Apply concession/scholarship

// Billing
GET    /bills                          - Get all bills
POST   /bills/generate                 - Generate bills for class
GET    /bills/:id                      - Get bill details
POST   /bills/:id/email                - Email bill to parent
POST   /bills/:id/sms                  - Send bill reminder via SMS

// Payments
POST   /payments                       - Record payment
GET    /payments/:id                   - Get payment details
GET    /students/:id/payments          - Get student's payment history
POST   /payments/:id/receipt           - Generate receipt
POST   /payments/:id/email-receipt     - Email receipt

// Payment Gateway
POST   /payments/gateway/razorpay      - Razorpay payment
POST   /payments/gateway/paypal        - PayPal payment
GET    /payments/reconcile             - Bank reconciliation
```

---

## 12. LIBRARY ENDPOINTS

```
// Book Catalog
GET    /books                          - Get all books
GET    /books/search?query=title       - Search books
POST   /books                          - Add new book
GET    /books/:id                      - Get book details
PUT    /books/:id                      - Update book information
DELETE /books/:id                      - Delete book

// Issue & Return
POST   /books/:id/issue                - Issue book to member
POST   /books/:id/return               - Return book
GET    /books/:id/issue-history        - Get issue history
GET    /members/:memberId/books        - Get member's issued books

// Reservation
POST   /books/:id/reserve              - Reserve book
GET    /books/:id/reservations         - Get reservations
DELETE /books/:id/reservations/:id     - Cancel reservation
POST   /books/:id/cancel-reservation   - Auto-cancel when available

// Fine Management
GET    /members/:id/fines              - Get member's fines
POST   /members/:id/fines/pay          - Pay fine
POST   /members/:id/fines/waive        - Waive fine

// Inventory
GET    /library/inventory              - Get inventory report
GET    /library/lost-books             - Get lost books
POST   /library/lost-books/:id         - Mark book as lost
GET    /library/acquisition            - Get purchase history
```

---

## 13. TRANSPORT ENDPOINTS

```
// Bus Management
GET    /buses                          - Get all buses
POST   /buses                          - Add new bus
GET    /buses/:id                      - Get bus details
PUT    /buses/:id                      - Update bus
DELETE /buses/:id                      - Delete bus

// Routes
GET    /routes                         - Get all routes
POST   /routes                         - Create route
GET    /routes/:id                     - Get route details
PUT    /routes/:id                     - Update route
GET    /routes/:id/stops               - Get route stops

// Student Assignment
POST   /buses/:id/assign-student       - Assign student to bus
DELETE /buses/:id/students/:studentId  - Remove student
GET    /buses/:id/students             - Get students in bus
POST   /routes/:id/fees                - Set route fee

// Tracking
GET    /buses/:id/location             - Get current bus location (GPS)
GET    /buses/:id/tracking-history     - Get tracking history
POST   /buses/:id/alert                - Get bus alerts
GET    /routes/:id/eta                 - Get ETA for stop

// Driver & Staff
GET    /buses/:id/driver               - Get bus driver
POST   /buses/:id/driver               - Assign driver
GET    /buses/:id/conductor            - Get conductor
POST   /buses/:id/conductor            - Assign conductor
```

---

## 14. HOSTEL ENDPOINTS

```
// Hostel Management
GET    /hostels                        - Get all hostels
POST   /hostels                        - Create hostel
GET    /hostels/:id                    - Get hostel details
PUT    /hostels/:id                    - Update hostel

// Rooms
GET    /hostels/:id/rooms              - Get rooms
POST   /hostels/:id/rooms              - Create room
GET    /hostels/:hostelId/rooms/:id    - Get room details
PUT    /hostels/:hostelId/rooms/:id    - Update room

// Student Assignment
POST   /hostels/:id/assign-student     - Assign student to room
DELETE /hostels/:hostelId/rooms/:roomId/students/:studentId - Remove student
GET    /hostels/:id/occupancy          - Get occupancy status

// Attendance
POST   /hostels/:id/checkin            - Check in
POST   /hostels/:id/checkout           - Check out
GET    /students/:id/hostel-attendance - Get hostel attendance
POST   /hostels/:id/roll-call          - Night roll call

// Leave Management
POST   /hostels/:id/apply-leave        - Apply for leave
GET    /hostels/:id/leaves             - Get leave requests
PUT    /hostels/:id/leaves/:leaveId    - Approve/reject leave

// Complaints
POST   /hostels/:id/complaints         - File complaint
GET    /hostels/:id/complaints         - Get complaints
PUT    /hostels/:id/complaints/:id     - Resolve complaint

// Billing
GET    /hostels/:id/bills              - Get hostel bills
POST   /hostels/:id/bills/generate     - Generate bills
```

---

## 15. HR & PAYROLL ENDPOINTS

```
// Staff Management
GET    /staff                          - Get all staff
POST   /staff                          - Add staff member
GET    /staff/:id                      - Get staff details
PUT    /staff/:id                      - Update staff
DELETE /staff/:id                      - Delete staff

// Leave Management
GET    /leave/types                    - Get leave types
POST   /leave/apply                    - Apply for leave
GET    /staff/:id/leaves               - Get leave history
PUT    /leave/:id/approve              - Approve leave
PUT    /leave/:id/reject               - Reject leave
GET    /leave/report                   - Leave report

// Payroll
GET    /payroll/:month                 - Get payroll for month
POST   /payroll/generate               - Generate payroll
GET    /staff/:id/payslip/:month       - Get payslip
POST   /payroll/salary-certificate     - Generate salary certificate
POST   /payroll/bank-transfer          - Initiate bank transfer

// Performance Management
POST   /performance/appraisal          - Create appraisal
GET    /staff/:id/appraisal            - Get appraisal
PUT    /performance/appraisal/:id      - Update appraisal
GET    /performance/report             - Performance report

// Recruitment
POST   /recruitment/job-posting        - Create job posting
GET    /recruitment/job-posting        - Get job postings
POST   /recruitment/applications       - Submit application
GET    /recruitment/applicants         - Get applicants
PUT    /recruitment/applicants/:id     - Update applicant status
```

---

## 16. COMMUNICATION ENDPOINTS

```
// Announcements
GET    /announcements                  - Get all announcements
POST   /announcements                  - Create announcement
GET    /announcements/:id              - Get announcement details
PUT    /announcements/:id              - Update announcement
DELETE /announcements/:id              - Delete announcement

// Direct Messages
POST   /messages                       - Send message
GET    /messages/inbox                 - Get inbox
GET    /messages/sent                  - Get sent messages
GET    /messages/:id                   - Get message details
DELETE /messages/:id                   - Delete message
POST   /messages/:id/read              - Mark as read

// Notice Board
GET    /notice-board                   - Get notices
POST   /notice-board                   - Post notice
GET    /notice-board/:id               - Get notice details

// Events
GET    /events                         - Get all events
POST   /events                         - Create event
GET    /events/:id                     - Get event details
POST   /events/:id/rsvp                - RSVP to event
GET    /events/:id/attendees           - Get attendees

// Notifications
GET    /notifications                  - Get notifications
GET    /notifications/unread           - Get unread notifications
PUT    /notifications/:id/read         - Mark as read
DELETE /notifications/:id              - Delete notification
```

---

## 17. REPORTING & ANALYTICS ENDPOINTS

```
// Academic Reports
GET    /reports/student-performance    - Student performance report
GET    /reports/class-performance      - Class performance report
GET    /reports/teacher-performance    - Teacher performance report
GET    /reports/attendance-summary     - Attendance summary report
GET    /reports/exam-analysis          - Exam analysis report
GET    /reports/grade-distribution     - Grade distribution

// Financial Reports
GET    /reports/fee-collection         - Fee collection report
GET    /reports/outstanding-dues       - Outstanding dues report
GET    /reports/expense-summary        - Expense summary
GET    /reports/budget-vs-actual       - Budget vs actual
GET    /reports/financial-statement    - Financial statement

// Operational Reports
GET    /reports/student-enrollment     - Enrollment report
GET    /reports/staff-strength         - Staff strength report
GET    /reports/inventory              - Inventory report
GET    /reports/transport-utilization  - Transport utilization

// Export
GET    /reports/export/pdf             - Export to PDF
GET    /reports/export/excel           - Export to Excel
GET    /reports/export/csv             - Export to CSV

// Custom Reports
POST   /reports/custom                 - Create custom report
GET    /reports/custom                 - Get custom reports
DELETE /reports/custom/:id             - Delete custom report
```

---

## 18. DOCUMENT ENDPOINTS

```
// Document Requests
POST   /documents/request              - Request document
GET    /documents/requests             - Get all requests
GET    /documents/requests/:id         - Get request details
PUT    /documents/requests/:id/approve - Approve request
PUT    /documents/requests/:id/reject  - Reject request
POST   /documents/requests/:id/generate - Generate document

// Document Types
GET    /documents/types                - Get document types
GET    /documents/types/:type          - Get template

// Issued Documents
GET    /students/:id/documents-issued  - Get issued documents
POST   /documents/verify               - Verify document authenticity
```

---

## 19. SETTINGS & ADMINISTRATION ENDPOINTS

```
// School Configuration
GET    /settings/school                - Get school info
PUT    /settings/school                - Update school info
GET    /settings/academic-year         - Get academic year
POST   /settings/academic-year         - Create academic year

// System Configuration
GET    /settings/system                - Get system settings
PUT    /settings/system                - Update system settings
GET    /settings/policies              - Get policies
PUT    /settings/policies              - Update policies

// Backup & Recovery
POST   /settings/backup                - Initiate backup
GET    /settings/backup-history        - Get backup history
POST   /settings/restore               - Restore from backup

// Audit Logs
GET    /audit-logs                     - Get audit logs
GET    /audit-logs/:id                 - Get log details
POST   /audit-logs/export              - Export logs

// Role & Permissions
GET    /roles                          - Get all roles
POST   /roles                          - Create role
PUT    /roles/:id                      - Update role
DELETE /roles/:id                      - Delete role
GET    /permissions                    - Get all permissions
POST   /roles/:id/permissions          - Assign permissions
```

---

## 20. DASHBOARD ENDPOINTS

```
// Admin Dashboard
GET    /dashboard/admin                - Admin dashboard data
GET    /dashboard/admin/statistics     - Admin statistics
GET    /dashboard/admin/recent-activity - Recent activities

// Teacher Dashboard
GET    /dashboard/teacher              - Teacher dashboard
GET    /dashboard/teacher/classes      - Teacher's classes
GET    /dashboard/teacher/assignments  - Pending assignments

// Student Dashboard
GET    /dashboard/student              - Student dashboard
GET    /dashboard/student/academics    - Academic performance
GET    /dashboard/student/attendance   - Attendance data

// Parent Dashboard
GET    /dashboard/parent               - Parent dashboard
GET    /dashboard/parent/children      - Children's data
GET    /dashboard/parent/fees          - Fee status

// Principal Dashboard
GET    /dashboard/principal            - Principal dashboard
GET    /dashboard/principal/school-stats - School statistics
```

---

## Common Query Parameters

```
// Pagination
?page=1&limit=20

// Filtering
?status=ACTIVE&class=classId

// Sorting
?sortBy=name&sortOrder=asc

// Date Range
?startDate=2024-01-01&endDate=2024-12-31

// Search
?search=student_name

// Include Relations
?include=grades,attendance
```

---

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "statusCode": 200
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "message": "Error message",
  "error": "ERROR_CODE",
  "statusCode": 400,
  "details": []
}
```

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful, no response body |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error |

---

## Authentication

All endpoints (except /auth/*) require:
```
Header: Authorization: Bearer <JWT_TOKEN>
```

---

## Rate Limiting

- **Free Tier:** 1000 requests/hour
- **Standard:** 5000 requests/hour
- **Premium:** 10000 requests/hour

Response Header: `X-RateLimit-Remaining`

---

This comprehensive API documentation covers all 20+ modules with 200+ endpoints for the School Management System.
