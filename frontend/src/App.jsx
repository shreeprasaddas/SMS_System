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
import FeesPage from './pages/fees/FeesPage.jsx';
import FeesReportPage from './pages/fees/FeesReportPage.jsx';
import GradesPage from './pages/grades/GradesPage.jsx';
import MarkGradesPage from './pages/grades/MarkGradesPage.jsx';
import StudentGradesPage from './pages/grades/StudentGradesPage.jsx';
import GradeReportPage from './pages/grades/GradeReportPage.jsx';
import ReportsPage from './pages/reports/ReportsPage.jsx';
import AttendanceReportPageReport from './pages/reports/AttendanceReportPage.jsx';
import PerformanceReportPage from './pages/reports/PerformanceReportPage.jsx';
import FinanceReportPage from './pages/reports/FinanceReportPage.jsx';
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

            {/* Fees - Phase 2 */}
            <Route path="/fees" element={<FeesPage />} />
            <Route path="/fees/report" element={<FeesReportPage />} />

            {/* Grades - Phase 3 */}
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/grades/mark" element={<MarkGradesPage />} />
            <Route path="/grades/student/:studentId" element={<StudentGradesPage />} />
            <Route path="/grades/report" element={<GradeReportPage />} />

            {/* Reports - Phase 3 */}
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/attendance" element={<AttendanceReportPageReport />} />
            <Route path="/reports/performance" element={<PerformanceReportPage />} />
            <Route path="/reports/finance" element={<FinanceReportPage />} />

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

            {/* Transport Routes - Phase 4 Part 4 */}
            <Route path="/transport/routes" element={<RoutesPage />} />
            <Route path="/transport/routes/create" element={<CreateRoutePage />} />
            <Route path="/transport/routes/:routeId/edit" element={<EditRoutePage />} />
            <Route path="/transport/routes/map" element={<RouteMapPage />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
