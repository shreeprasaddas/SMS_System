import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { refreshToken } from './store/slices/authSlice.js';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicRoute from './routes/PublicRoute.jsx';
import MainLayout from './components/layout/MainLayout/MainLayout.jsx';
import AuthLayout from './components/layout/AuthLayout/AuthLayout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import StudentsPage from './pages/students/StudentsPage.jsx';
import StudentDetailPage from './pages/students/StudentDetailPage.jsx';
import CreateStudentPage from './pages/students/CreateStudentPage.jsx';
import EditStudentPage from './pages/students/EditStudentPage.jsx';
import TeachersPage from './pages/teachers/TeachersPage.jsx';
import TeacherDetailPage from './pages/teachers/TeacherDetailPage.jsx';
import CreateTeacherPage from './pages/teachers/CreateTeacherPage.jsx';
import EditTeacherPage from './pages/teachers/EditTeacherPage.jsx';
import ClassesPage from './pages/classes/ClassesPage.jsx';
import ClassDetailPage from './pages/classes/ClassDetailPage.jsx';
import CreateClassPage from './pages/classes/CreateClassPage.jsx';
import EditClassPage from './pages/classes/EditClassPage.jsx';
import AttendancePage from './pages/attendance/AttendancePage.jsx';
import AttendanceReportPage from './pages/attendance/AttendanceReportPage.jsx';
import StudentAttendancePage from './pages/attendance/StudentAttendancePage.jsx';
import FeesPage from './pages/finance/FeesPage.jsx';
import ExpensesPage from './pages/finance/ExpensesPage.jsx';
import FinancialReportPage from './pages/finance/FinancialReportPage.jsx';
import GradesPage from './pages/grades/GradesPage.jsx';
import MarkGradesPage from './pages/grades/MarkGradesPage.jsx';
import StudentGradesPage from './pages/grades/StudentGradesPage.jsx';
import GradeReportPage from './pages/grades/GradeReportPage.jsx';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard.jsx';
import AcademicReports from './pages/analytics/AcademicReports.jsx';
import EngagementReports from './pages/analytics/EngagementReports.jsx';
import BenchmarkingPage from './pages/analytics/BenchmarkingPage.jsx';
import SubjectsPage from './pages/subjects/SubjectsPage.jsx';
import CreateSubjectPage from './pages/subjects/CreateSubjectPage.jsx';
import EditSubjectPage from './pages/subjects/EditSubjectPage.jsx';
import SubjectDetailPage from './pages/subjects/SubjectDetailPage.jsx';
import ExamsPage from './pages/exams/ExamsPage.jsx';
import CreateExamPage from './pages/exams/CreateExamPage.jsx';
import EditExamPage from './pages/exams/EditExamPage.jsx';
import ExamSchedulePage from './pages/exams/ExamSchedulePage.jsx';
import ExamDetailPage from './pages/exams/ExamDetailPage.jsx';
import AssignmentsPage from './pages/assignments/AssignmentsPage.jsx';
import CreateAssignmentPage from './pages/assignments/CreateAssignmentPage.jsx';
import EditAssignmentPage from './pages/assignments/EditAssignmentPage.jsx';
import AssignmentDetailPage from './pages/assignments/AssignmentDetailPage.jsx';
import GradeSubmissionsPage from './pages/assignments/GradeSubmissionsPage.jsx';
import TimetablesPage from './pages/timetables/TimetablesPage.jsx';
import CreateTimetablePage from './pages/timetables/CreateTimetablePage.jsx';
import EditTimetablePage from './pages/timetables/EditTimetablePage.jsx';
import TimetableCalendarPage from './pages/timetables/TimetableCalendarPage.jsx';
import RoutesPage from './pages/transport/RoutesPage.jsx';
import CreateRoutePage from './pages/transport/CreateRoutePage.jsx';
import EditRoutePage from './pages/transport/EditRoutePage.jsx';
import RouteMapPage from './pages/transport/RouteMapPage.jsx';
import TransportPage from './pages/transport/TransportPage.jsx';
import RouteDetailPage from './pages/transport/RouteDetailPage.jsx';

import HostelPage from './pages/hostel/HostelPage.jsx';
import RoomDetailPage from './pages/hostel/RoomDetailPage.jsx';

import LibraryPage from './pages/library/LibraryPage.jsx';
import BookDetailPage from './pages/library/BookDetailPage.jsx';

import AdmissionPage from './pages/admission/AdmissionPage.jsx';
import ApplicationDetailPage from './pages/admission/ApplicationDetailPage.jsx';

import DisciplinePage from './pages/admin/DisciplinePage.jsx';
import AlumniPage from './pages/admin/AlumniPage.jsx';
import ParentPortalDashboard from './pages/portals/ParentPortalDashboard.jsx';

import AnnouncementsPage from './pages/communication/AnnouncementsPage.jsx';
import MessagesPage from './pages/communication/MessagesPage.jsx';
import SchoolProfilePage from './pages/settings/SchoolProfilePage.jsx';
import SystemSettingsPage from './pages/settings/SystemSettingsPage.jsx';
import UserProfilePage from './pages/settings/UserProfilePage.jsx';

import StaffPage from './pages/hr/StaffPage.jsx';
import StaffDetailPage from './pages/hr/StaffDetailPage.jsx';
import LeaveManagementPage from './pages/hr/LeaveManagementPage.jsx';
import PayrollPage from './pages/hr/PayrollPage.jsx';

import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  // Refresh token on mount if user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      // Token refresh logic can be added here
      dispatch(refreshToken());
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes - Auth Pages */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* Protected Routes - App Pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Students - Phase 2 */}
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/create" element={<CreateStudentPage />} />
            <Route path="/students/:studentId" element={<StudentDetailPage />} />
            <Route path="/students/:studentId/edit" element={<EditStudentPage />} />

            {/* Teachers - Phase 2 */}
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/teachers/create" element={<CreateTeacherPage />} />
            <Route path="/teachers/:teacherId" element={<TeacherDetailPage />} />
            <Route path="/teachers/:teacherId/edit" element={<EditTeacherPage />} />

            {/* Classes - Phase 3 */}
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/classes/create" element={<CreateClassPage />} />
            <Route path="/classes/:classId" element={<ClassDetailPage />} />
            <Route path="/classes/:classId/edit" element={<EditClassPage />} />

            {/* Attendance - Phase 2 */}
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/attendance/report" element={<AttendanceReportPage />} />
            <Route path="/attendance/student/:studentId" element={<StudentAttendancePage />} />

            {/* Finance - Phase 4 */}
            <Route path="/finance/fees" element={<FeesPage />} />
            <Route path="/finance/expenses" element={<ExpensesPage />} />
            <Route path="/finance/reports" element={<FinancialReportPage />} />

            {/* Grades - Phase 3 */}
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/grades/mark" element={<MarkGradesPage />} />
            <Route path="/grades/student/:studentId" element={<StudentGradesPage />} />
            <Route path="/grades/report" element={<GradeReportPage />} />

            {/* Analytics & Reporting - Phase 5 */}
            <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />
            <Route path="/analytics/academic" element={<AcademicReports />} />
            <Route path="/analytics/engagement" element={<EngagementReports />} />
            <Route path="/analytics/benchmarks" element={<BenchmarkingPage />} />

            {/* Subjects - Phase 4 */}
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subjects/create" element={<CreateSubjectPage />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
            <Route path="/subjects/:subjectId/edit" element={<EditSubjectPage />} />

            {/* Exams - Phase 4 */}
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/exams/create" element={<CreateExamPage />} />
            <Route path="/exams/:examId" element={<ExamDetailPage />} />
            <Route path="/exams/:examId/edit" element={<EditExamPage />} />
            <Route path="/exams/schedule" element={<ExamSchedulePage />} />

            {/* Assignments - Phase 4 Part 2 */}
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/assignments/create" element={<CreateAssignmentPage />} />
            <Route path="/assignments/:assignmentId" element={<AssignmentDetailPage />} />
            <Route path="/assignments/:assignmentId/edit" element={<EditAssignmentPage />} />
            <Route path="/assignments/:assignmentId/grade" element={<GradeSubmissionsPage />} />

            {/* Timetables - Phase 4 Part 3 */}
            <Route path="/timetables" element={<TimetablesPage />} />
            <Route path="/timetables/create" element={<CreateTimetablePage />} />
            <Route path="/timetables/:timetableId/edit" element={<EditTimetablePage />} />
            <Route path="/timetables/calendar" element={<TimetableCalendarPage />} />

            {/* Transport Routes - Phase 4 & 8 */}
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/transport/routes" element={<RoutesPage />} />
            <Route path="/transport/routes/create" element={<CreateRoutePage />} />
            <Route path="/transport/routes/:routeId" element={<RouteDetailPage />} />
            <Route path="/transport/routes/:routeId/edit" element={<EditRoutePage />} />
            <Route path="/transport/routes/map" element={<RouteMapPage />} />

            {/* Hostel Routes - Phase 8 */}
            <Route path="/hostels" element={<HostelPage />} />
            <Route path="/hostels/rooms/:roomId" element={<RoomDetailPage />} />

            {/* Library & Admissions - Phase 9 */}
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/library/books/:bookId" element={<BookDetailPage />} />
            <Route path="/admissions" element={<AdmissionPage />} />
            <Route path="/admissions/:applicationId" element={<ApplicationDetailPage />} />

            {/* Advanced Admin & Portals - Phase 10 */}
            <Route path="/discipline" element={<DisciplinePage />} />
            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="/parent-portal" element={<ParentPortalDashboard />} />

            {/* Communication - Phase 3 & 6 */}
            <Route path="/communication" element={<AnnouncementsPage />} />
            <Route path="/communication/messages" element={<MessagesPage />} />

            {/* Settings & Profile - Phase 6 */}
            <Route path="/settings/school" element={<SchoolProfilePage />} />
            <Route path="/settings/system" element={<SystemSettingsPage />} />
            <Route path="/profile" element={<UserProfilePage />} />

            {/* HR & Staff Management - Phase 7 */}
            <Route path="/hr/staff" element={<StaffPage />} />
            <Route path="/hr/staff/:staffId" element={<StaffDetailPage />} />
            <Route path="/hr/leave" element={<LeaveManagementPage />} />
            <Route path="/hr/payroll" element={<PayrollPage />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
